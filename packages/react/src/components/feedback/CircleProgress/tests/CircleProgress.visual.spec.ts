import AxeBuilder from '@axe-core/playwright';
import { test, expect } from '@playwright/test';

test.describe('CircleProgress Visual Regression', () => {
  test('Default render matches snapshot', async ({ page }) => {
    await page.goto('/iframe.html?id=feedback-circleprogress--default&viewMode=story');
    await expect(page.locator('#storybook-root svg')).toBeVisible();
    await expect(page).toHaveScreenshot('circle-progress-default.png');
  });

  test('Primary variant matches snapshot', async ({ page }) => {
    await page.goto('/iframe.html?id=feedback-circleprogress--primary&viewMode=story');
    await expect(page.locator('#storybook-root svg')).toBeVisible();
    await expect(page).toHaveScreenshot('circle-progress-primary.png');
  });

  test('Sizes matches snapshot', async ({ page }) => {
    await page.goto('/iframe.html?id=feedback-circleprogress--sizes&viewMode=story');
    await expect(page.locator('svg').first()).toBeVisible();
    await expect(page).toHaveScreenshot('circle-progress-sizes.png');
  });

  test('Thickness matches snapshot', async ({ page }) => {
    await page.goto('/iframe.html?id=feedback-circleprogress--thickness&viewMode=story');
    await expect(page.locator('svg').first()).toBeVisible();
    await expect(page).toHaveScreenshot('circle-progress-thickness.png');
  });

  test('With Label matches snapshot', async ({ page }) => {
    await page.goto('/iframe.html?id=feedback-circleprogress--with-label&viewMode=story');
    await expect(page.getByText('Done')).toBeVisible();
    await expect(page).toHaveScreenshot('circle-progress-with-label.png');
  });

  test('should pass accessibility compliance', async ({ page }) => {
    await page.goto('/iframe.html?id=feedback-circleprogress--default&viewMode=story');
    const results = await new AxeBuilder({ page }).include('#storybook-root').analyze();
    expect(results.violations).toEqual([]);
  });
});
