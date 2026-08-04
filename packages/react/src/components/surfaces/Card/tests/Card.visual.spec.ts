import { expect, test } from '@playwright/test';
import { testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  componentId: 'display-card',
  snapshotPrefix: 'card',
  title: 'Card',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'Variants', story: 'variants' },
    { name: 'Appearances', story: 'appearances' },
  ],
});

test('long header, body, and footer text stay inside a narrow card', async ({ page }) => {
  await page.goto('/iframe.html?id=display-card--constrained-long-chrome&viewMode=story');

  const card = page.getByLabel('Constrained long-content card');
  await expect(card).toBeVisible();
  expect(await card.evaluate((element) => element.scrollWidth <= element.clientWidth + 1)).toBe(
    true,
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1,
    ),
  ).toBe(true);
});

test('edge-aligned card action keeps its focus ring visible', async ({ page }) => {
  await page.goto('/iframe.html?id=display-card--focusable-content&viewMode=story');

  const button = page.getByRole('button', { name: 'Focusable card action' });
  await button.focus();

  await expect(button).toBeFocused();
  await expect(button).toHaveCSS('outline-style', 'solid');
  await expect(button.locator('..')).toHaveCSS('overflow', 'visible');
  await expect(page).toHaveScreenshot('card-focusable-content-focus.png');
});
