import { testVisualStories } from '@/components/e2e/visualSpecUtils';
import { expect, test } from '@playwright/test';

testVisualStories({
  accessibilityStory: 'default',
  componentId: 'a11y-visuallyhidden',
  snapshotPrefix: 'visually-hidden',
  title: 'VisuallyHidden',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'WithButton', story: 'with-button' },
    { name: 'AsDiv', story: 'as-div' },
  ],
});

test('reveals an asChild interactive control on keyboard focus', async ({ page }) => {
  await page.goto('/iframe.html?id=a11y-visuallyhidden--as-child-button&viewMode=story');

  const button = page.getByRole('button', { name: 'Skip to main content' });
  await button.focus();
  await expect(button).toBeFocused();
  await expect(button).toHaveCSS('position', 'static');
  await expect(button).toHaveCSS('overflow', 'visible');
});
