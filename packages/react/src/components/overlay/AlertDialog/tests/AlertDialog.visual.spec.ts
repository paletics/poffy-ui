import { expect, test } from '@playwright/test';
import {
  testStoriesDoNotOverflowOnMobile,
  testVisualStories,
} from '@/components/e2e/visualSpecUtils';

testVisualStories({
  accessibilityStory: 'destructive',
  componentId: 'overlay-alertdialog',
  snapshotPrefix: 'alert-dialog',
  title: 'AlertDialog',
  stories: [
    { name: 'Default Closed', story: 'default' },
    { name: 'Variants Closed', story: 'variants' },
    { name: 'Neutral Open', story: 'neutral-open' },
    { name: 'Warning Open', story: 'warning-open' },
    { name: 'Outline Large Open', story: 'outline-large' },
    { name: 'Scroll Outside Open', story: 'scroll-outside' },
  ],
});

testStoriesDoNotOverflowOnMobile({
  componentId: 'overlay-alertdialog',
  title: 'AlertDialog',
  stories: [{ name: 'LongActionLabels', story: 'long-action-labels' }],
});

test.describe('AlertDialog Interaction Visual Regression', () => {
  test('default open render matches snapshot', async ({ page }) => {
    await page.goto('/iframe.html?id=overlay-alertdialog--default&viewMode=story');
    await page.getByRole('button', { name: /delete project/i }).click();
    await expect(page.getByRole('alertdialog')).toBeVisible();
    await expect(page).toHaveScreenshot('alert-dialog-default-open.png');
  });

  test('long actions remain reachable in a short viewport', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 320 });
    await page.goto('/iframe.html?id=overlay-alertdialog--long-action-labels&viewMode=story');

    const dialog = page.getByRole('alertdialog');
    await expect(dialog).toBeVisible();
    const box = await dialog.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.y).toBeGreaterThanOrEqual(-1);
    expect(box!.y + box!.height).toBeLessThanOrEqual(321);
    await expect(page.getByRole('button', { name: /cancel and keep/i })).toBeVisible();
    await expect(
      page.getByRole('button', { name: /delete this account permanently/i }),
    ).toBeVisible();
  });
});
