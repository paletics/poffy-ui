import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import type { PageAssertionsToHaveScreenshotOptions } from '@playwright/test';

/**
 * Storybook story entry covered by a visual regression test.
 */
export interface VisualStory {
  name: string;
  screenshotOptions?: PageAssertionsToHaveScreenshotOptions;
  story: string;
}

/**
 * Options used to generate shared Storybook visual and accessibility tests.
 */
export interface VisualSpecOptions {
  accessibilityStory?: string;
  componentId: string;
  snapshotPrefix: string;
  title: string;
  stories: VisualStory[];
}

const toSnapshotPart = (value: string) =>
  value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();

export const waitForStoryRoot = async (page: import('@playwright/test').Page) => {
  const storyRoot = page.locator('#storybook-root, #root').first();

  await expect
    .poll(
      async () => {
        try {
          return await storyRoot.evaluate((node) => node.childElementCount);
        } catch {
          return 0;
        }
      },
      {
        timeout: 60_000,
      },
    )
    .toBeGreaterThan(0);

  return storyRoot;
};

/** Loads one Storybook iframe story and waits for its rendered root. */
export const gotoStory = async (
  page: import('@playwright/test').Page,
  {
    componentId,
    globals,
    story,
  }: {
    componentId: string;
    globals?: string;
    story: string;
  },
) => {
  const globalsQuery = globals ? `&globals=${encodeURIComponent(globals)}` : '';
  await page.goto(`/iframe.html?id=${componentId}--${story}&viewMode=story${globalsQuery}`);
  return waitForStoryRoot(page);
};

export const expectNoHorizontalOverflow = async (page: import('@playwright/test').Page) => {
  const hasHorizontalOverflow = await page.evaluate(() => {
    if (document.documentElement.scrollWidth > document.documentElement.clientWidth) return true;
    return document.body.scrollWidth > document.body.clientWidth;
  });

  expect(hasHorizontalOverflow).toBe(false);
};

export const testStoriesDoNotOverflowOnMobile = ({
  componentId,
  stories,
  title,
}: Pick<VisualSpecOptions, 'componentId' | 'stories' | 'title'>) => {
  test.describe(`${title} Mobile Overflow`, () => {
    for (const story of stories) {
      test(`${story.name} story does not overflow on mobile`, async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 });
        await page.goto(`/iframe.html?id=${componentId}--${story.story}&viewMode=story`);
        await waitForStoryRoot(page);
        await page.waitForTimeout(500);

        await expectNoHorizontalOverflow(page);
      });
    }
  });
};

/**
 * Registers screenshot and axe checks for a component's Storybook stories.
 */
export const testVisualStories = ({
  accessibilityStory = 'default',
  componentId,
  snapshotPrefix,
  stories,
  title,
}: VisualSpecOptions) => {
  test.describe(`${title} Visual Regression`, () => {
    for (const story of stories) {
      test(`${story.name} matches snapshot`, async ({ page }) => {
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await page.goto(`/iframe.html?id=${componentId}--${story.story}&viewMode=story`);
        await waitForStoryRoot(page);

        await expect(page).toHaveScreenshot(
          `${snapshotPrefix}-${toSnapshotPart(story.name)}.png`,
          story.screenshotOptions,
        );
      });
    }

    test('should pass accessibility compliance', async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto(`/iframe.html?id=${componentId}--${accessibilityStory}&viewMode=story`);
      await waitForStoryRoot(page);
      await page.waitForTimeout(500);

      // Floating UI renders overlay content into a portal under document.body,
      // outside Storybook's canvas root. Scan the iframe document so open
      // dialog/menu content and its focus guards are checked as well.
      const results = await new AxeBuilder({ page })
        .exclude('iframe')
        .disableRules(['landmark-one-main', 'page-has-heading-one', 'region'])
        .analyze();

      expect(results.violations).toEqual([]);
    });
  });
};
