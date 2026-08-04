import { testVisualStories } from '@/components/e2e/visualSpecUtils';
import { expect, test } from '@playwright/test';

testVisualStories({
  accessibilityStory: 'default',
  componentId: 'animations-collapsetransition',
  snapshotPrefix: 'collapse-transition',
  title: 'CollapseTransition',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'HeightOnly', story: 'height-only' },
    { name: 'ScaleY', story: 'scale-y' },
    { name: 'KeepMounted', story: 'keep-mounted' },
  ],
});

test('opening content does not clip an immediately focused child', async ({ page }) => {
  await page.goto('/iframe.html?id=animations-collapsetransition--focused-opening&viewMode=story');

  await page.getByRole('button', { name: 'Open focusable region' }).click();

  const nestedAction = page.getByRole('button', { name: 'Focusable nested action' });
  const transition = page.getByTestId('focusable-collapse');
  await expect(nestedAction).toBeFocused();
  await expect(nestedAction).toHaveCSS('outline-style', 'solid');
  await expect(transition).toHaveCSS('overflow', 'visible');
  await expect(page).toHaveScreenshot('collapse-transition-focused-opening.png');
});
