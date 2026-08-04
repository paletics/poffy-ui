import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import type { Locator, Page } from '@playwright/test';
import { readdirSync, readFileSync } from 'node:fs';
import { extname, join, relative, resolve } from 'node:path';

interface ComponentStory {
  id: string;
  title: string;
  filePath: string;
}

const COMPONENTS_ROOT = resolve(process.cwd(), 'packages/react/src/components');

const getStoryFiles = (directory: string): string[] =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolutePath = join(directory, entry.name);

    if (entry.isDirectory()) {
      return getStoryFiles(absolutePath);
    }

    return extname(entry.name) === '.tsx' && entry.name.endsWith('.stories.tsx')
      ? [relative(COMPONENTS_ROOT, absolutePath)]
      : [];
  });

const toStorybookIdPart = (value: string) =>
  value
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();

const getComponentStories = (): ComponentStory[] =>
  getStoryFiles(COMPONENTS_ROOT)
    .map((filePath) => {
      const absolutePath = resolve(COMPONENTS_ROOT, filePath);
      const source = readFileSync(absolutePath, 'utf8');
      // Restrict the match to the Storybook metadata. Component fixtures may
      // legitimately contain unrelated `title` props before `meta`.
      const title = /const meta[\s\S]*?title:\s*['"]([^'"]+)['"]/.exec(source)?.[1];

      if (!title || !source.includes('export const Default')) {
        return null;
      }

      return {
        id: `${toStorybookIdPart(title)}--default`,
        title,
        filePath: relative(process.cwd(), absolutePath),
      };
    })
    .filter((story): story is ComponentStory => story !== null)
    .sort((a, b) => a.title.localeCompare(b.title));

const stories = getComponentStories();

const MOBILE_STORY_IDS = new Set([
  'inputs-input--default',
  'inputs-listboxselect--default',
  'layout-container--default',
  'layout-grid--default',
  'layout-simplegrid--default',
  'layout-wrap--default',
  'overlay-drawer--default',
  'overlay-modal--default',
]);

const mobileStories = stories.filter((story) => MOBILE_STORY_IDS.has(story.id));

const getRootMetrics = (storyRoot: Locator) =>
  storyRoot.evaluate((node) => {
    const rect = node.getBoundingClientRect();

    return {
      childCount: node.childElementCount,
      height: rect.height,
      width: rect.width,
    };
  });

const loadStory = async (page: Page, story: ComponentStory) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(`/iframe.html?id=${story.id}&viewMode=story`);

  const storyRoot = page.locator('#storybook-root, #root').first();
  await expect
    .poll(() => storyRoot.evaluate((node) => node.childElementCount), {
      message: story.filePath,
      timeout: 60_000,
    })
    .toBeGreaterThan(0);

  return storyRoot;
};

const expectNoHorizontalOverflow = async (page: Page, story: ComponentStory) => {
  const horizontalOverflow = await page.evaluate(() => {
    const documentElement = document.documentElement;

    return documentElement.scrollWidth - documentElement.clientWidth;
  });

  expect(horizontalOverflow, story.filePath).toBeLessThanOrEqual(1);
};

test.describe('component default stories', () => {
  test.describe.configure({ mode: 'serial' });
  test.setTimeout(90_000);

  for (const story of stories) {
    test(`${story.title} renders and passes axe`, async ({ page }) => {
      const storyRoot = await loadStory(page, story);
      const rootMetrics = await getRootMetrics(storyRoot);

      expect(rootMetrics.childCount, story.filePath).toBeGreaterThan(0);
      await expectNoHorizontalOverflow(page, story);
      await page.waitForTimeout(500);

      const accessibilityScanResults = await new AxeBuilder({ page })
        .include('#storybook-root')
        .exclude('iframe')
        .disableRules(['landmark-one-main', 'page-has-heading-one', 'region'])
        .analyze();

      expect(accessibilityScanResults.violations, story.filePath).toEqual([]);
    });
  }
});

test.describe('component default stories mobile smoke', () => {
  test.describe.configure({ mode: 'serial' });
  test.setTimeout(90_000);

  for (const story of mobileStories) {
    test(`${story.title} fits a mobile viewport`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });

      const storyRoot = await loadStory(page, story);
      const rootMetrics = await getRootMetrics(storyRoot);

      expect(rootMetrics.childCount, story.filePath).toBeGreaterThan(0);
      expect(rootMetrics.width, story.filePath).toBeGreaterThan(0);
      await expectNoHorizontalOverflow(page, story);
    });
  }
});
