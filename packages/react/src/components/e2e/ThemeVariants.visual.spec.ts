import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { gotoStory } from '@/components/e2e/visualSpecUtils';

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

  test('Button default matches the light pome theme', async ({ page }) => {
    await gotoStory(page, {
      componentId: 'inputs-button',
      globals: 'theme:light;brand:pome',
      story: 'default',
    });

    await expect(page.getByRole('button')).toHaveCSS('background-color', 'rgb(245, 158, 11)');
    await expect(page).toHaveScreenshot('button-default-light-pome.png');
  });

  test('safe custom palette resolves in light and dark scoped themes', async ({ page }) => {
    await gotoStory(page, {
      componentId: 'theme-accessibility-matrix',
      story: 'custom-palette',
    });

    const lightPanel = page.getByTestId('custom-theme-light');
    const darkPanel = page.getByTestId('custom-theme-dark');
    const lightBoundary = page.locator('[data-brand="custom"][data-theme="light"]');
    const darkBoundary = page.locator('[data-brand="custom"][data-theme="dark"]');

    await expect(lightBoundary).toContainText('Custom light');
    await expect(darkBoundary).toContainText('Custom dark');
    await expect(lightBoundary).toHaveAttribute('data-brand', 'custom');
    await expect(lightBoundary).toHaveAttribute('data-theme', 'light');
    await expect(darkBoundary).toHaveAttribute('data-brand', 'custom');
    await expect(darkBoundary).toHaveAttribute('data-theme', 'dark');
    await expect(lightBoundary).toHaveCSS('--poffy-custom-main', '#5B21B6');
    await expect(darkBoundary).toHaveCSS('--poffy-custom-main-dark', '#C4B5FD');
    await expect(lightPanel.getByRole('button', { name: 'Primary action' })).toHaveCSS(
      'background-color',
      'rgb(91, 33, 182)',
    );
    await expect(darkPanel.getByRole('button', { name: 'Primary action' })).toHaveCSS(
      'background-color',
      'rgb(196, 181, 253)',
    );
    const results = await new AxeBuilder({ page })
      .include('#storybook-root')
      .disableRules(['landmark-one-main', 'page-has-heading-one', 'region'])
      .analyze();
    expect(results.violations).toEqual([]);
    await expect(page).toHaveScreenshot('theme-custom-palette-light-dark.png');
  });
});
