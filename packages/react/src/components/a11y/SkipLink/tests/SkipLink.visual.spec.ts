import { expect, test } from '@playwright/test';

test.describe('SkipLink', () => {
  test('reveals a fixed link for keyboard focus and uses a fragment destination', async ({ page }) => {
    await page.goto('/iframe.html?id=a11y-skiplink--default&viewMode=story');

    const link = page.getByRole('link', { name: 'Skip to main content' });
    await expect(link).toBeVisible();
    await page.keyboard.press('Tab');
    await expect(link).toBeFocused();
    await expect(link).toHaveCSS('position', 'fixed');
    await expect(link).toHaveCSS('overflow', 'visible');

    await link.press('Enter');
    await expect(page).toHaveURL(/#main-content$/);
  });
});
