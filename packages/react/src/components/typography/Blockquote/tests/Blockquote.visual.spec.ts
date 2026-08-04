import { expect, test } from '@playwright/test';
import {
  testStoriesDoNotOverflowOnMobile,
  testVisualStories,
} from '@/components/e2e/visualSpecUtils';

testVisualStories({
  accessibilityStory: 'playground',
  componentId: 'display-blockquote',
  snapshotPrefix: 'blockquote',
  title: 'Blockquote',
  stories: [{ name: 'Tones', story: 'tones' }],
});

testStoriesDoNotOverflowOnMobile({
  componentId: 'display-blockquote',
  title: 'Blockquote',
  stories: [{ name: 'LongUnbrokenText', story: 'long-unbroken-text' }],
});

test('RTL quote uses the inline-start border without overflowing', async ({ page }) => {
  await page.goto('/iframe.html?id=display-blockquote--rtl-constrained&viewMode=story');

  const quote = page.getByLabel('RTL constrained quote');
  await expect(quote).toBeVisible();
  expect(await quote.evaluate((node) => node.scrollWidth <= node.clientWidth + 1)).toBe(true);
  expect(await quote.evaluate((node) => getComputedStyle(node).borderRightWidth)).toBe('4px');
});
