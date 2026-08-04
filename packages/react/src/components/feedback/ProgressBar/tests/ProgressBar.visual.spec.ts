import AxeBuilder from '@axe-core/playwright';
import { test, expect } from '@playwright/test';
import { expectNoHorizontalOverflow } from '@/components/e2e/visualSpecUtils';

test.describe('ProgressBar Visual Regression', () => {
  test('Default render matches snapshot', async ({ page }) => {
    await page.goto('/iframe.html?id=feedback-progressbar--default&viewMode=story');
    await expect(page.getByRole('progressbar')).toBeVisible();
    await expect(page).toHaveScreenshot('progressbar-default.png');
  });

  test('Intents match snapshot', async ({ page }) => {
    await page.goto('/iframe.html?id=feedback-progressbar--intents&viewMode=story');
    await expect(page.getByRole('progressbar').first()).toBeVisible();
    await expect(page).toHaveScreenshot('progressbar-intents.png');
  });

  test('Thickness matches snapshot', async ({ page }) => {
    await page.goto('/iframe.html?id=feedback-progressbar--thickness&viewMode=story');
    await expect(page.getByRole('progressbar').first()).toBeVisible();
    await expect(page).toHaveScreenshot('progressbar-thickness.png');
  });

  test('Widths match snapshot', async ({ page }) => {
    await page.goto('/iframe.html?id=feedback-progressbar--widths&viewMode=story');
    await expect(page.getByRole('progressbar').first()).toBeVisible();
    await expect(page).toHaveScreenshot('progressbar-widths.png');
  });

  test('CSS widths resolve against the responsive story container', async ({ page }) => {
    await page.setViewportSize({ width: 800, height: 720 });
    await page.goto('/iframe.html?id=feedback-progressbar--responsive-widths&viewMode=story');

    const percentage = page.getByTestId('percentage-width');
    await expect(percentage.getByRole('progressbar')).toBeVisible();
    const dimensions = await Promise.all(
      ['percentage-width', 'functional-width', 'custom-property-width'].map((testId) =>
        page.getByTestId(testId).evaluate((element) => ({
          parentWidth: element.parentElement?.getBoundingClientRect().width ?? 0,
          width: element.getBoundingClientRect().width,
        })),
      ),
    );
    const [percentageSize, functionalSize, customPropertySize] = dimensions;
    expect(Math.abs(percentageSize.width - percentageSize.parentWidth * 0.5)).toBeLessThanOrEqual(
      1,
    );
    expect(
      Math.abs(functionalSize.width - Math.min(functionalSize.parentWidth, 384)),
    ).toBeLessThanOrEqual(1);
    expect(
      Math.abs(customPropertySize.width - Math.min(customPropertySize.parentWidth, 448)),
    ).toBeLessThanOrEqual(1);
  });

  test('Appearances match snapshot', async ({ page }) => {
    await page.goto('/iframe.html?id=feedback-progressbar--appearances&viewMode=story');
    await expect(page.getByRole('progressbar').first()).toBeVisible();
    await expect(page).toHaveScreenshot('progressbar-appearances.png');
  });

  test('Patterns match snapshot', async ({ page }) => {
    await page.goto('/iframe.html?id=feedback-progressbar--patterns&viewMode=story');
    await expect(page.getByRole('progressbar').first()).toBeVisible();
    await expect(page).toHaveScreenshot('progressbar-patterns.png');
  });

  for (const story of [
    'animations',
    'auto-label-placement',
    'center-labels',
    'edge-cases',
    'states',
  ]) {
    test(`${story} matches snapshot`, async ({ page }) => {
      await page.goto(`/iframe.html?id=feedback-progressbar--${story}&viewMode=story`);
      await expect(page.getByRole('progressbar').first()).toBeVisible();
      await expect(page).toHaveScreenshot(`progressbar-${story}.png`);
    });
  }

  test('should pass accessibility compliance', async ({ page }) => {
    await page.goto('/iframe.html?id=feedback-progressbar--default&viewMode=story');
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  test('external localized labels stay in flow inside a narrow parent', async ({ page }) => {
    await page.goto(
      '/iframe.html?id=feedback-progressbar--constrained-localized-labels&viewMode=story',
    );

    const parent = page.getByLabel('Constrained progress bars');
    const bars = page.getByRole('progressbar');
    await expect(bars).toHaveCount(2);
    expect(await parent.evaluate((element) => element.scrollWidth <= element.clientWidth + 1)).toBe(
      true,
    );
    await expectNoHorizontalOverflow(page);
  });

  test('auto placement is reversible after a narrow-to-wide resize', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/iframe.html?id=feedback-progressbar--auto-label-placement&viewMode=story');

    const progressbar = page.getByRole('progressbar').nth(4);
    const label = progressbar.locator('xpath=..').locator('[data-progressbar-label-position]');
    await expect(label).toHaveAttribute('data-progressbar-label-position', 'inside');

    await page.setViewportSize({ width: 180, height: 720 });
    await expect(label).toHaveAttribute('data-progressbar-label-position', 'right');

    await page.setViewportSize({ width: 1280, height: 720 });
    await expect(label).toHaveAttribute('data-progressbar-label-position', 'inside');
  });

  for (const story of [
    'animations',
    'appearances',
    'auto-label-placement',
    'center-labels',
    'edge-cases',
    'intents',
    'patterns',
    'responsive-widths',
    'states',
    'thickness',
    'widths',
  ]) {
    test(`${story} story does not overflow on mobile`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(`/iframe.html?id=feedback-progressbar--${story}&viewMode=story`);
      await expect(page.locator('#storybook-root > *').first()).toBeVisible();

      await expectNoHorizontalOverflow(page);
    });
  }
});
