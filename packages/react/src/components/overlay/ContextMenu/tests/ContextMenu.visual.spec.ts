import { test, expect } from '@playwright/test';
import { testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  componentId: 'overlay-contextmenu',
  snapshotPrefix: 'context-menu',
  title: 'ContextMenu',
  stories: [
    { name: 'Default Closed', story: 'default' },
    { name: 'Brands Closed', story: 'brands' },
  ],
});

test.describe('ContextMenu Interaction Visual Regression', () => {
  test('Open menu matches snapshot', async ({ page }) => {
    await page.goto('/iframe.html?id=overlay-contextmenu--default&viewMode=story');
    await page.getByText(/right click/i).click({ button: 'right' });
    await expect(page.getByRole('menuitem', { name: /edit/i })).toBeVisible();
    await expect(page).toHaveScreenshot('context-menu-open.png');
  });

  test('With icons open menu matches snapshot', async ({ page }) => {
    await page.goto('/iframe.html?id=overlay-contextmenu--with-icons&viewMode=story');
    await page.getByText(/right click \(icons\)/i).click({ button: 'right' });
    await expect(page.getByRole('menuitem', { name: /copy/i })).toBeVisible();
    await expect(page).toHaveScreenshot('context-menu-with-icons-open.png');
  });
});
