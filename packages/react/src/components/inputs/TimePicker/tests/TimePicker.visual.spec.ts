import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('TimePicker Visual Regression', () => {
  test('Default component matches snapshot', async ({ page }) => {
    await page.goto('/iframe.html?id=inputs-timepicker--default&viewMode=story');
    const root = page.getByRole('group');

    await expect(root).toBeVisible();
    await expect(root).toHaveScreenshot('time-picker-default-component.png');
  });

  test('Sizes story matches snapshot', async ({ page }) => {
    await page.goto('/iframe.html?id=inputs-timepicker--sizes&viewMode=story');
    await expect(page.getByRole('spinbutton', { name: 'Hours' }).first()).toBeVisible();
    await expect(page).toHaveScreenshot('time-picker-sizes.png');
  });

  test('12-hour mode matches snapshot', async ({ page }) => {
    await page.goto('/iframe.html?id=inputs-timepicker--twelve-hour&viewMode=story');
    const root = page.getByRole('group');

    await expect(root).toBeVisible();
    await expect(root).toHaveScreenshot('time-picker-twelve-hour-component.png');
  });

  test('Seconds story matches snapshot', async ({ page }) => {
    await page.goto('/iframe.html?id=inputs-timepicker--with-seconds&viewMode=story');
    const root = page.getByRole('group');

    await expect(root).toBeVisible();
    await expect(root).toHaveScreenshot('time-picker-seconds-component.png');
  });

  test('should pass accessibility compliance', async ({ page }) => {
    await page.goto('/iframe.html?id=inputs-timepicker--default&viewMode=story');
    await expect(page.getByRole('group')).toBeVisible();
    const results = await new AxeBuilder({ page }).include('[role="group"]').analyze();
    expect(results.violations).toEqual([]);
  });
});
