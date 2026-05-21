import AxeBuilder from '@axe-core/playwright';
import { test, expect } from '@playwright/test';

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

  test('Appearances match snapshot', async ({ page }) => {
    await page.goto('/iframe.html?id=feedback-progressbar--appearances&viewMode=story');
    await expect(page.getByRole('progressbar').first()).toBeVisible();
    await expect(page).toHaveScreenshot('progressbar-appearances.png');
  });

  test('should pass accessibility compliance', async ({ page }) => {
    await page.goto('/iframe.html?id=feedback-progressbar--default&viewMode=story');
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
});
