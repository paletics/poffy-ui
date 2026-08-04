import { expect, test } from '@playwright/test';
import { testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  accessibilityStory: 'default',
  componentId: 'media-image',
  snapshotPrefix: 'image',
  title: 'Image',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'WithFallbackUrl', story: 'with-fallback-url' },
    { name: 'WithFallbackElement', story: 'with-fallback-element' },
    { name: 'AspectRatioVideo', story: 'aspect-ratio-video' },
    { name: 'Circular', story: 'circular' },
  ],
});

test('AspectRatio keeps the same dimensions when a React fallback replaces the image', async ({
  page,
}) => {
  await page.goto('/iframe.html?id=media-image--stable-fallback-frame&viewMode=story');

  const frame = page.getByLabel('Stable image frame');
  const image = page.getByRole('img', { name: 'Framed preview' });
  await expect(image).toBeVisible();
  const [frameBefore, imageBefore] = await Promise.all([frame.boundingBox(), image.boundingBox()]);

  await page.getByRole('button', { name: 'Break image source' }).click();
  await expect(page.getByText('Preview unavailable')).toBeVisible();
  const fallback = page.getByText('Preview unavailable');
  const [frameAfter, fallbackAfter] = await Promise.all([
    frame.boundingBox(),
    fallback.boundingBox(),
  ]);

  expect(frameBefore).not.toBeNull();
  expect(imageBefore).not.toBeNull();
  expect(frameAfter).toEqual(frameBefore);
  expect(fallbackAfter).toEqual(imageBefore);
});
