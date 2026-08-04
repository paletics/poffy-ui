import { expect, test } from '@playwright/test';
import { expectNoHorizontalOverflow, testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  componentId: 'inputs-button',
  snapshotPrefix: 'button',
  title: 'Button',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'Polymorphic', story: 'polymorphic' },
    { name: 'Disabled', story: 'disabled' },
  ],
});

test('localized label wraps inside a constrained parent', async ({ page }) => {
  await page.goto('/iframe.html?id=inputs-button--constrained-localized-label&viewMode=story');
  const button = page.getByRole('button');
  await expect(button).toBeVisible();
  await expectNoHorizontalOverflow(page);
  expect(await button.evaluate((node) => node.scrollWidth <= node.clientWidth + 1)).toBe(true);
});

test('logical icon slots follow LTR and RTL inline direction', async ({ page }) => {
  await page.goto('/iframe.html?id=inputs-button--logical-icon-placement&viewMode=story');

  const startLtr = await page.getByTestId('button-start-ltr').boundingBox();
  const endLtr = await page.getByTestId('button-end-ltr').boundingBox();
  const startRtl = await page.getByTestId('button-start-rtl').boundingBox();
  const endRtl = await page.getByTestId('button-end-rtl').boundingBox();

  expect(startLtr?.x).toBeLessThan(endLtr?.x ?? 0);
  expect(startRtl?.x).toBeGreaterThan(endRtl?.x ?? Number.POSITIVE_INFINITY);
});

test('native button keeps its focus ring visible', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/iframe.html?id=inputs-button--default&viewMode=story');
  const button = page.getByRole('button', { name: 'Poffy Button' });

  await button.focus();
  await expect(button).toBeFocused();
  await expect(button).toHaveCSS('outline-style', 'solid');
  await expect(page).toHaveScreenshot('button-native-focus.png');
});

test('polymorphic button keeps its focus ring visible', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/iframe.html?id=inputs-button--polymorphic&viewMode=story');
  const link = page.getByRole('link', { name: 'Go to Dashboard' });

  await link.focus();
  await expect(link).toBeFocused();
  await expect(link).toHaveCSS('outline-style', 'solid');
  await expect(page).toHaveScreenshot('button-polymorphic-focus.png');
});
