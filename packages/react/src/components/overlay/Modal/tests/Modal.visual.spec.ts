import { test, expect } from '@playwright/test';
import { testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  componentId: 'overlay-modal',
  snapshotPrefix: 'modal',
  title: 'Modal',
  stories: [
    { name: 'Default Closed', story: 'default' },
    { name: 'Sizes Closed', story: 'sizes' },
  ],
});

test.describe('Modal Interaction Visual Regression', () => {
  test('Default open render matches snapshot', async ({ page }) => {
    await page.goto('/iframe.html?id=overlay-modal--default&viewMode=story');
    await page.getByRole('button', { name: /open default modal/i }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page).toHaveScreenshot('modal-default-open.png');
  });

  test('asChild open render matches snapshot', async ({ page }) => {
    await page.goto('/iframe.html?id=overlay-modal--as-child&viewMode=story');
    await page.getByRole('button', { name: /open aschild modal/i }).click();
    await expect(page.getByText(/custom container/i)).toBeVisible();
    await expect(page).toHaveScreenshot('modal-as-child-open.png');
  });
});
