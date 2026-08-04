import {
  testStoriesDoNotOverflowOnMobile,
  testVisualStories,
} from '@/components/e2e/visualSpecUtils';
import { expect, test } from '@playwright/test';

testVisualStories({
  accessibilityStory: 'default',
  componentId: 'inputs-closebutton',
  snapshotPrefix: 'close-button',
  title: 'CloseButton',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'Sizes', story: 'sizes' },
    { name: 'Appearances', story: 'appearances' },
    { name: 'Disabled', story: 'disabled' },
    { name: 'Shapes', story: 'shapes' },
    { name: 'AsChild', story: 'as-child' },
  ],
});

test('every close button size meets the minimum target size', async ({ page }) => {
  await page.goto('/iframe.html?id=inputs-closebutton--sizes&viewMode=story');
  for (const button of await page.getByRole('button').all()) {
    const box = await button.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThanOrEqual(24);
    expect(box!.height).toBeGreaterThanOrEqual(24);
  }
});

test('polymorphic close button keeps its focus ring visible', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/iframe.html?id=inputs-closebutton--as-child&viewMode=story');
  const button = page.getByRole('button', { name: 'Close details' });

  await button.focus();
  await expect(button).toBeFocused();
  await expect(button).toHaveCSS('outline-style', 'solid');
  await expect(page).toHaveScreenshot('close-button-as-child-focus.png');
});

testStoriesDoNotOverflowOnMobile({
  componentId: 'inputs-closebutton',
  title: 'CloseButton',
  stories: [{ name: 'InModalHeader', story: 'in-modal-header' }],
});
