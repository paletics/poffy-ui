import { expect, test } from '@playwright/test';
import { testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  accessibilityStory: 'default',
  componentId: 'inputs-iconbutton',
  snapshotPrefix: 'icon-button',
  title: 'IconButton',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'Variants', story: 'variants' },
    { name: 'Disabled', story: 'disabled' },
    { name: 'Loading', story: 'loading' },
    { name: 'Shapes', story: 'shapes' },
    { name: 'AsChild', story: 'as-child' },
  ],
});

test('every icon button size meets the minimum target size', async ({ page }) => {
  await page.goto('/iframe.html?id=inputs-iconbutton--default&viewMode=story');
  for (const button of await page.getByRole('button').all()) {
    const box = await button.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThanOrEqual(24);
    expect(box!.height).toBeGreaterThanOrEqual(24);
  }
});

test('polymorphic icon button keeps its focus ring visible', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/iframe.html?id=inputs-iconbutton--as-child&viewMode=story');
  const link = page.getByRole('link', { name: 'Open editor' });

  await link.focus();
  await expect(link).toBeFocused();
  await expect(link).toHaveCSS('outline-style', 'solid');
  await expect(page).toHaveScreenshot('icon-button-as-child-focus.png');
});
