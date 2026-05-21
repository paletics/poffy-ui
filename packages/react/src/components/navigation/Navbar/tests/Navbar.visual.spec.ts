import { test, expect } from '@playwright/test';
import { testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  componentId: 'navigation-navbar',
  snapshotPrefix: 'navbar',
  title: 'Navbar',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'Sticky', story: 'sticky' },
  ],
});

test.describe('Navbar Interaction Visual Regression', () => {
  test('Default hover state matches snapshot', async ({ page }) => {
    await page.goto('/iframe.html?id=navigation-navbar--default&viewMode=story');
    await page.getByRole('link', { name: /features/i }).hover();
    await expect(page).toHaveScreenshot('navbar-link-hover.png');
  });
});
