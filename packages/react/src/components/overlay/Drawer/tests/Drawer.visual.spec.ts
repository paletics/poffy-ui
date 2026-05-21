import { test, expect } from '@playwright/test';
import { testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  componentId: 'overlay-drawer',
  snapshotPrefix: 'drawer',
  title: 'Drawer',
  stories: [
    { name: 'Default Closed', story: 'default' },
    { name: 'Placements Closed', story: 'placements' },
  ],
});

test.describe('Drawer Interaction Visual Regression', () => {
  test('Default open render matches snapshot', async ({ page }) => {
    await page.goto('/iframe.html?id=overlay-drawer--default&viewMode=story');
    await page.getByRole('button', { name: /open right drawer/i }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page).toHaveScreenshot('drawer-default-open.png');
  });

  test('asChild open render matches snapshot', async ({ page }) => {
    await page.goto('/iframe.html?id=overlay-drawer--as-child&viewMode=story');
    await page.getByRole('button', { name: /open aschild drawer/i }).click();
    await expect(page.getByText(/custom aside/i)).toBeVisible();
    await expect(page).toHaveScreenshot('drawer-as-child-open.png');
  });
});
