import {
  testStoriesDoNotOverflowOnMobile,
  testVisualStories,
} from '@/components/e2e/visualSpecUtils';
import { expect, test } from '@playwright/test';

testVisualStories({
  accessibilityStory: 'default',
  componentId: 'media-picture',
  snapshotPrefix: 'picture',
  title: 'Picture',
  stories: [{ name: 'Default', story: 'default' }],
});

testStoriesDoNotOverflowOnMobile({
  componentId: 'media-picture',
  title: 'Picture',
  stories: [{ name: 'WideFallback', story: 'wide-fallback' }],
});

test('sizing fill consumes the AspectRatio frame and constrains object-fit', async ({ page }) => {
  await page.goto('/iframe.html?id=media-picture--stable-aspect-ratio-frame&viewMode=story');

  const frame = page.getByLabel('Stable picture frame');
  const image = page.getByRole('img', { name: 'Framed art direction' });
  await expect(image).toBeVisible();
  const [frameBox, imageBox] = await Promise.all([frame.boundingBox(), image.boundingBox()]);

  expect(frameBox).not.toBeNull();
  expect(imageBox).toEqual(frameBox);
  await expect(image).toHaveCSS('object-fit', 'cover');
});
