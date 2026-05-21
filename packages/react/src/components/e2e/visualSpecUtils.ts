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

const waitForStoryRoot = async (page: import('@playwright/test').Page) => {
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

      const results = await new AxeBuilder({ page })
        .include('#storybook-root')
        .exclude('iframe')
        .disableRules(['landmark-one-main', 'page-has-heading-one', 'region'])
        .analyze();

      expect(results.violations).toEqual([]);
    });
  });
};
