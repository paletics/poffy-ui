import { test, expect } from '@playwright/test';
import { testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  componentId: 'navigation-dropdown',
  snapshotPrefix: 'dropdown',
  title: 'Dropdown',
  stories: [{ name: 'Default Closed', story: 'default' }],
});

test.describe('Dropdown Interaction Visual Regression', () => {
  test('Default open render matches snapshot', async ({ page }) => {
    await page.goto('/iframe.html?id=navigation-dropdown--default&viewMode=story');
    await page.getByText('Actions').click();
    await expect(page.getByRole('menuitem', { name: /edit/i })).toBeVisible();
    await expect(page).toHaveScreenshot('dropdown-default-open.png');
  });

  test('Disabled items open render matches snapshot', async ({ page }) => {
    await page.goto('/iframe.html?id=navigation-dropdown--with-disabled-items&viewMode=story');
    await page.getByText('File').click();
    await expect(page.getByRole('menuitem', { name: /save as/i })).toBeVisible();
    await expect(page).toHaveScreenshot('dropdown-disabled-items-open.png');
  });

  test('Polymorphic trigger open render matches snapshot', async ({ page }) => {
    await page.goto('/iframe.html?id=navigation-dropdown--polymorphic-usage&viewMode=story');
    await page.getByRole('link', { name: /link trigger/i }).click();
    await expect(page.getByRole('menuitem', { name: /action 1/i })).toBeVisible();
    await expect(page).toHaveScreenshot('dropdown-polymorphic-open.png');
  });
});
