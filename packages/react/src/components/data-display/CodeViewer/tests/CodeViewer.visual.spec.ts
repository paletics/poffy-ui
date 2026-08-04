import { expect, test } from '@playwright/test';
import { testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  componentId: 'display-codeviewer',
  snapshotPrefix: 'code-viewer',
  title: 'CodeViewer',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'Wrapping', story: 'wrapping' },
  ],
});

test('scrolls a focused no-wrap source viewer horizontally with the keyboard', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 240 });
  await page.goto('/iframe.html?id=display-codeviewer--wrapping&viewMode=story');

  const viewer = page.getByRole('region', { name: 'No wrap' });
  await expect(viewer).toBeVisible();
  expect(await viewer.evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(true);

  await viewer.focus();
  await expect(viewer).toBeFocused();
  await page.keyboard.press('ArrowRight');
  await expect.poll(() => viewer.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);
  await expect(page).toHaveScreenshot('code-viewer-keyboard-scroll.png');
});
