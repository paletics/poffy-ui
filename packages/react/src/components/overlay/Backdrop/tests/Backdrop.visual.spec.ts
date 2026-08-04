import { testVisualStories } from '@/components/e2e/visualSpecUtils';
import { expect, test } from '@playwright/test';

testVisualStories({
  componentId: 'overlay-backdrop',
  snapshotPrefix: 'backdrop',
  title: 'Backdrop',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'Custom Style', story: 'custom-style' },
  ],
});

test('scroll lock follows the backdrop owner document', async ({ page }) => {
  await page.goto('/iframe.html?id=overlay-backdrop--iframe-scroll-lock&viewMode=story');
  const parentOverflow = await page.evaluate(() => document.body.style.overflow);

  await page.getByRole('button', { name: 'Open iframe backdrop' }).click();
  const frame = page.frameLocator('iframe[title="Backdrop owner document"]');
  await expect(frame.getByTestId('iframe-backdrop')).toBeVisible();
  expect(await frame.locator('body').evaluate((element) => element.style.overflow)).toBe('hidden');
  expect(await page.evaluate(() => document.body.style.overflow)).toBe(parentOverflow);

  await page.getByRole('button', { name: 'Close iframe backdrop' }).click();
  expect(await frame.locator('body').evaluate((element) => element.style.overflow)).toBe('');
});
