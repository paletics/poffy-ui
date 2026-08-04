import { expect, test } from '@playwright/test';
import {
  testStoriesDoNotOverflowOnMobile,
  testVisualStories,
} from '@/components/e2e/visualSpecUtils';

testVisualStories({
  componentId: 'display-jsonviewer',
  snapshotPrefix: 'json-viewer',
  title: 'JsonViewer',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'String value', story: 'string-value' },
    { name: 'Oversized value', story: 'oversized-value' },
    { name: 'Long line', story: 'long-line' },
    { name: 'Long line no wrap', story: 'long-line-no-wrap' },
  ],
});

testStoriesDoNotOverflowOnMobile({
  componentId: 'display-jsonviewer',
  title: 'JsonViewer',
  stories: [
    { name: 'Long line', story: 'long-line' },
    { name: 'Long line no wrap', story: 'long-line-no-wrap' },
  ],
});

test.describe('JsonViewer long-line behavior', () => {
  test('wraps a long JSON line inside the viewer on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/iframe.html?id=display-jsonviewer--long-line&viewMode=story');

    const region = page.getByRole('region', { name: 'Long JSON value' });
    await expect(region).toBeVisible();
    await expect(region.locator('code')).toHaveCSS('white-space', 'pre-wrap');
    expect(await region.evaluate((element) => element.scrollWidth <= element.clientWidth + 1)).toBe(
      true,
    );
  });

  test('keeps a long JSON line scrollable inside the viewer on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/iframe.html?id=display-jsonviewer--long-line-no-wrap&viewMode=story');

    const region = page.getByRole('region', { name: 'Long JSON value without wrapping' });
    await expect(region).toBeVisible();
    await expect(region.locator('code')).toHaveCSS('white-space', 'pre');
    expect(await region.evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(true);
  });
});
