import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('NumberInput Visual Regression', () => {
  test('Default render matches snapshot', async ({ page }) => {
    await page.goto('/iframe.html?id=inputs-numberinput--default&viewMode=story');
    const input = page.getByRole('spinbutton');
    const root = input.locator('..');

    await expect(input).toBeVisible();
    await expect(root).toHaveScreenshot('number-input-default-component.png');
  });

  test('Sizes matches snapshot', async ({ page }) => {
    await page.goto('/iframe.html?id=inputs-numberinput--sizes&viewMode=story');
    await expect(page.getByRole('spinbutton').first()).toBeVisible();
    await expect(page).toHaveScreenshot('number-input-sizes.png');
  });

  test('Appearances matches snapshot', async ({ page }) => {
    await page.goto('/iframe.html?id=inputs-numberinput--appearances&viewMode=story');
    await expect(page.getByRole('spinbutton').first()).toBeVisible();
    await expect(page).toHaveScreenshot('number-input-appearances.png');
  });

  test('Stepper interaction remains visually aligned', async ({ page }) => {
    await page.goto('/iframe.html?id=inputs-numberinput--default&viewMode=story');
    const input = page.getByRole('spinbutton');
    const root = input.locator('..');
    const increment = page.getByRole('button', { name: 'Increment' });
    const decrement = page.getByRole('button', { name: 'Decrement' });

    await expect(input).toHaveValue('10');
    await increment.click();
    await expect(input).toHaveValue('11');
    await decrement.click();
    await expect(input).toHaveValue('10');
    await expect(root).toHaveScreenshot('number-input-stepper-interaction-component.png');
  });

  test('should pass accessibility compliance', async ({ page }) => {
    await page.goto('/iframe.html?id=inputs-numberinput--default&viewMode=story');
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
});
