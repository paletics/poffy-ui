import {
  testStoriesDoNotOverflowOnMobile,
  testVisualStories,
} from '@/components/e2e/visualSpecUtils';
import { expect, test } from '@playwright/test';

testVisualStories({
  accessibilityStory: 'default',
  componentId: 'display-avatar',
  snapshotPrefix: 'avatar',
  title: 'Avatar',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'Sizes', story: 'sizes' },
    { name: 'Shapes', story: 'shapes' },
    { name: 'AsChild', story: 'as-child' },
    { name: 'Fallback', story: 'fallback' },
    { name: 'BrokenImage', story: 'broken-image' },
  ],
});

testStoriesDoNotOverflowOnMobile({
  componentId: 'display-avatar',
  title: 'Avatar',
  stories: [
    { name: 'Sizes', story: 'sizes' },
    { name: 'AsChild', story: 'as-child' },
  ],
});

test('asChild avatar keeps its focus ring inside the cropped avatar', async ({ page }) => {
  await page.goto('/iframe.html?id=display-avatar--as-child&viewMode=story');

  const avatar = page.getByRole('link', { name: 'Mika Sato profile' });
  await avatar.focus();

  await expect(avatar).toBeFocused();
  await expect(avatar).toHaveCSS('outline-style', 'solid');
  await expect(avatar).toHaveCSS('outline-offset', '-2px');
  await expect(page).toHaveScreenshot('avatar-as-child-focus.png');
});
