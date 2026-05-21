import { test, expect } from '@playwright/test';
import { testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  componentId: 'navigation-pagination',
  snapshotPrefix: 'pagination',
  title: 'Pagination',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'Many Pages', story: 'many-pages' },
    { name: 'Small', story: 'small' },
  ],
});

test.describe('Pagination Interaction Visual Regression', () => {
  test('Next page interaction matches snapshot', async ({ page }) => {
    await page.goto('/iframe.html?id=navigation-pagination--default&viewMode=story');
    await page.getByRole('link', { name: /go to page 2/i }).click();
    await expect(page.locator('[aria-current="page"]')).toHaveText('2');
    await expect(page).toHaveScreenshot('pagination-page-2-active.png');
  });
});
