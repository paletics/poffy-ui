import { expect, test } from '@playwright/test';
import {
  testStoriesDoNotOverflowOnMobile,
  testVisualStories,
} from '@/components/e2e/visualSpecUtils';

const stories = [
  { name: 'Default', story: 'default' },
  { name: 'Block', story: 'block' },
  { name: 'InlineExamples', story: 'inline-examples' },
  {
    name: 'BlockExamples',
    screenshotOptions: { maxDiffPixelRatio: 0.03 },
    story: 'block-examples',
  },
  { name: 'MultiLine', story: 'multi-line' },
];

testVisualStories({
  accessibilityStory: 'syntax-highlighting',
  componentId: 'display-code',
  snapshotPrefix: 'code',
  title: 'Code',
  stories,
});

testStoriesDoNotOverflowOnMobile({
  componentId: 'display-code',
  title: 'Code',
  stories: [
    { name: 'MultiLine', story: 'multi-line' },
    { name: 'SyntaxHighlighting', story: 'syntax-highlighting' },
    { name: 'AllLanguages', story: 'all-languages' },
    { name: 'Composition', story: 'composition' },
  ],
});

test.describe('Code Copy Interaction', () => {
  test('copy action focus ring stays visible at the code surface edge', async ({ page }) => {
    await page.goto('/iframe.html?id=display-code--copyable&viewMode=story');
    const copyButton = page.getByRole('button', { name: /copy to clipboard/i });

    await copyButton.focus();
    await expect(copyButton).toBeFocused();
    await expect(page).toHaveScreenshot('code-copyable-copy-button-focus.png');
  });

  test('CopyWithCallback falls back when Clipboard API write is denied', async ({ page }) => {
    const consoleErrors: string[] = [];

    page.on('console', (message) => {
      if (message.type() === 'error') {
        consoleErrors.push(message.text());
      }
    });

    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        value: {
          writeText: () =>
            Promise.reject(new DOMException('Write permission denied.', 'NotAllowedError')),
        },
      });

      document.execCommand = () => true;
    });

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/iframe.html?id=display-code--copy-with-callback&viewMode=story');
    await page.getByRole('button', { name: /copy to clipboard/i }).click();

    await expect(page.getByText('Copied 1 times', { exact: true })).toBeVisible();
    expect(consoleErrors).toEqual([]);
  });
});

test('inline long tokens wrap inside narrow LTR and RTL parents', async ({ page }) => {
  await page.goto('/iframe.html?id=display-code--constrained-inline-long-token&viewMode=story');

  for (const name of ['Constrained inline code LTR', 'Constrained inline code RTL']) {
    const parent = page.getByLabel(name);
    const code = parent.locator('code');
    await expect(code).toBeVisible();
    expect(await parent.evaluate((element) => element.scrollWidth <= element.clientWidth + 1)).toBe(
      true,
    );
    await expect(code).toHaveCSS('overflow-wrap', 'anywhere');
    expect((await code.boundingBox())!.height).toBeGreaterThan(24);
  }
});
