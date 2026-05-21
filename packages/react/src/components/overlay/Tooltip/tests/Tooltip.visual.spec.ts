import { test, expect } from '@playwright/test';
import { testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  componentId: 'overlay-tooltip',
  snapshotPrefix: 'tooltip',
  title: 'Tooltip',
  stories: [
    { name: 'Default Closed', story: 'default' },
    { name: 'Brands Closed', story: 'brands' },
  ],
});

test.describe('Tooltip Interaction Visual Regression', () => {
  test('Hover tooltip matches snapshot', async ({ page }) => {
    await page.goto('/iframe.html?id=overlay-tooltip--interaction&viewMode=story');
    await page.getByRole('button', { name: /hover target/i }).hover();
    await expect(page.getByRole('tooltip')).toBeVisible();
    await expect(page).toHaveScreenshot('tooltip-hover-open.png');
  });

  test('Custom content hover matches snapshot', async ({ page }) => {
    await page.goto('/iframe.html?id=overlay-tooltip--custom-content&viewMode=story');
    await page.getByRole('button', { name: /hover for magic/i }).hover();
    await expect(page.getByRole('tooltip')).toBeVisible();
    await expect(page).toHaveScreenshot('tooltip-custom-content-open.png');
  });
});
