import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

interface ThemeVariant {
  globals: string;
  name: string;
}

interface ThemeStory {
  componentId: string;
  snapshotPrefix: string;
  story: string;
  title: string;
}

const themeVariants: ThemeVariant[] = [
  { globals: 'theme:dark;brand:blue', name: 'dark-blue' },
  { globals: 'theme:dark;brand:pome', name: 'dark-pome' },
];

const themeStories: ThemeStory[] = [
  {
    componentId: 'inputs-button',
    snapshotPrefix: 'button-default',
    story: 'default',
    title: 'Button default',
  },
  {
    componentId: 'feedback-alert',
    snapshotPrefix: 'alert-statuses',
    story: 'statuses',
    title: 'Alert statuses',
  },
  {
    componentId: 'display-card',
    snapshotPrefix: 'card-appearances',
    story: 'appearances',
    title: 'Card appearances',
  },
];

const waitForStoryRoot = async (page: Page) => {
  const storyRoot = page.locator('#storybook-root, #root').first();

  await expect
    .poll(() => storyRoot.evaluate((node) => node.childElementCount), {
      timeout: 60_000,
    })
    .toBeGreaterThan(0);
};

test.describe('theme variant visual regression', () => {
  for (const story of themeStories) {
    for (const variant of themeVariants) {
      test(`${story.title} matches ${variant.name}`, async ({ page }) => {
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await page.goto(
          `/iframe.html?id=${story.componentId}--${story.story}&viewMode=story&globals=${variant.globals}`,
        );
        await waitForStoryRoot(page);

        await expect(page).toHaveScreenshot(`${story.snapshotPrefix}-${variant.name}.png`);
      });
    }
  }
});
