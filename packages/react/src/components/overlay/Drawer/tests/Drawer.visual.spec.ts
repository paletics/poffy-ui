import { test, expect } from '@playwright/test';
import { testVisualStories } from '@/components/e2e/visualSpecUtils';
import { expectNoHorizontalOverflow } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  accessibilityStory: 'accessibility-open',
  componentId: 'overlay-drawer',
  snapshotPrefix: 'drawer',
  title: 'Drawer',
  stories: [
    { name: 'Default Closed', story: 'default' },
    { name: 'Placements Closed', story: 'placements' },
  ],
});

test.describe('Drawer Interaction Visual Regression', () => {
  test('Default open render matches snapshot', async ({ page }) => {
    await page.goto('/iframe.html?id=overlay-drawer--default&viewMode=story');
    await page.getByRole('button', { name: /open right drawer/i }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page).toHaveScreenshot('drawer-default-open.png');
  });

  test('asChild open render matches snapshot', async ({ page }) => {
    await page.goto('/iframe.html?id=overlay-drawer--as-child&viewMode=story');
    await page.getByRole('button', { name: /open aschild drawer/i }).click();
    await expect(page.getByText(/custom aside/i)).toBeVisible();
    await expect(page).toHaveScreenshot('drawer-as-child-open.png');
  });

  test('extra-large side drawer stays inside a narrow viewport', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto('/iframe.html?id=overlay-drawer--extra-large-right&viewMode=story');
    await page.getByRole('button', { name: /open right drawer/i }).click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    const box = await dialog.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.x).toBeGreaterThanOrEqual(-1);
    expect(box!.x + box!.width).toBeLessThanOrEqual(321);
    await expectNoHorizontalOverflow(page);
  });

  test('full bottom drawer stays usable in a short viewport', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 320 });
    await page.goto('/iframe.html?id=overlay-drawer--full-bottom&viewMode=story');
    await page.getByRole('button', { name: /open bottom drawer/i }).click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect
      .poll(async () => {
        const box = await dialog.boundingBox();
        return box ? box.y + box.height : Number.POSITIVE_INFINITY;
      })
      .toBeLessThanOrEqual(321);
    await expect(page.getByRole('button', { name: 'Close' })).toBeVisible();
  });

  test('logical start drawer resolves to the right edge in RTL', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 568 });
    await page.goto('/iframe.html?id=overlay-drawer--rtl-logical-start&viewMode=story');

    const dialog = page.getByRole('dialog', { name: 'RTL logical start drawer' });
    await expect(dialog).toBeVisible();
    await expect
      .poll(() => dialog.evaluate((element) => getComputedStyle(element).transform))
      .toBe('none');
    const box = await dialog.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.x + box!.width).toBeGreaterThanOrEqual(389);
    expect(box!.x + box!.width).toBeLessThanOrEqual(391);
    await expectNoHorizontalOverflow(page);
  });
});
