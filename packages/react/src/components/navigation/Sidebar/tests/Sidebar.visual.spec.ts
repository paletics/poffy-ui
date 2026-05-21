import { test, expect } from '@playwright/test';
import { testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  componentId: 'navigation-sidebar',
  snapshotPrefix: 'sidebar',
  title: 'Sidebar',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'Collapsed', story: 'collapsed' },
  ],
});

test.describe('Sidebar Interaction Visual Regression', () => {
  test('Default hover state matches snapshot', async ({ page }) => {
    await page.goto('/iframe.html?id=navigation-sidebar--default&viewMode=story');
    await page.getByText('Profile').hover();
    await expect(page).toHaveScreenshot('sidebar-item-hover.png');
  });
});
