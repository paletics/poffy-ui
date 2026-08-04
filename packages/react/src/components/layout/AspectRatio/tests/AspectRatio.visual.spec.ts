import {
  testStoriesDoNotOverflowOnMobile,
  testVisualStories,
} from '@/components/e2e/visualSpecUtils';
import { expect, test } from '@playwright/test';

testVisualStories({
  accessibilityStory: 'default',
  componentId: 'layout-aspectratio',
  snapshotPrefix: 'aspect-ratio',
  title: 'AspectRatio',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'Video4x3', story: 'video-4-x-3' },
    { name: 'UltraWide21x9', story: 'ultra-wide-21-x-9' },
    { name: 'Square1x1', story: 'square-1-x-1' },
    { name: 'ImageCover', story: 'image-cover' },
  ],
});

test('focused child is not clipped by the aspect-ratio frame', async ({ page }) => {
  await page.goto('/iframe.html?id=layout-aspectratio--focusable-content&viewMode=story');

  const button = page.getByRole('button', { name: /focusable content/i });
  await button.focus();

  await expect(button).toBeFocused();
  await expect(button).toHaveCSS('outline-style', 'solid');
  await expect(button.locator('..')).toHaveCSS('overflow', 'visible');
  await expect(page).toHaveScreenshot('aspect-ratio-focusable-content-focus.png');
});

testStoriesDoNotOverflowOnMobile({
  componentId: 'layout-aspectratio',
  title: 'AspectRatio',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'Video4x3', story: 'video-4-x-3' },
    { name: 'UltraWide21x9', story: 'ultra-wide-21-x-9' },
    { name: 'Square1x1', story: 'square-1-x-1' },
    { name: 'ImageCover', story: 'image-cover' },
    { name: 'MultipleRatios', story: 'multiple-ratios' },
  ],
});
