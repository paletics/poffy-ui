import { test, expect } from '@playwright/test';
import { testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  componentId: 'overlay-popover',
  snapshotPrefix: 'popover',
  title: 'Popover',
  stories: [
    { name: 'Default Closed', story: 'default' },
    { name: 'Placements Closed', story: 'placements' },
  ],
});

test.describe('Popover Interaction Visual Regression', () => {
  test('Default open render matches snapshot', async ({ page }) => {
    await page.goto('/iframe.html?id=overlay-popover--default&viewMode=story');
    await page.getByRole('button', { name: /click me/i }).click();
    await expect(page.getByText(/popover title/i)).toBeVisible();
    await expect(page).toHaveScreenshot('popover-default-open.png');
  });

  test('No arrow open render matches snapshot', async ({ page }) => {
    await page.goto('/iframe.html?id=overlay-popover--no-arrow&viewMode=story');
    await page.getByRole('button', { name: /click me/i }).click();
    await expect(page.getByText(/popover title/i)).toBeVisible();
    await expect(page).toHaveScreenshot('popover-no-arrow-open.png');
  });
});
