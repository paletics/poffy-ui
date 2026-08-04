import { expect, test } from '@playwright/test';
import { testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  accessibilityStory: 'default',
  componentId: 'inputs-copybutton',
  snapshotPrefix: 'copy-button',
  title: 'CopyButton',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'WithCallback', story: 'with-callback' },
  ],
});

test('copy action keeps its focus ring visible', async ({ page }) => {
  await page.goto('/iframe.html?id=inputs-copybutton--default&viewMode=story');
  const copyButton = page.getByRole('button', { name: /copy to clipboard/i });

  await copyButton.focus();
  await expect(copyButton).toBeFocused();
  await expect(page).toHaveScreenshot('copy-button-focus.png');
});
