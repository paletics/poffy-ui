import { test, expect } from '@playwright/test';
import { testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  componentId: 'navigation-tabs',
  snapshotPrefix: 'tabs',
  title: 'Tabs',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'Appearances', story: 'appearances' },
    { name: 'Pop Indicator', story: 'pop-indicator' },
  ],
});

test.describe('Tabs Interaction Visual Regression', () => {
  test('Selected tab interaction matches snapshot', async ({ page }) => {
    await page.goto('/iframe.html?id=navigation-tabs--default&viewMode=story');
    await page.getByRole('tab', { name: /tab 2/i }).click();
    await expect(page.getByText('Content 2')).toBeVisible();
    await expect(page).toHaveScreenshot('tabs-tab-2-selected.png');
  });
});
