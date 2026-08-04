import { test, expect } from '@playwright/test';
import { testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  accessibilityStory: 'accessibility-open',
  componentId: 'overlay-modal',
  snapshotPrefix: 'modal',
  title: 'Modal',
  stories: [
    { name: 'Default Closed', story: 'default' },
    { name: 'Sizes Closed', story: 'sizes' },
  ],
});

test.describe('Modal Interaction Visual Regression', () => {
  test('Default open render matches snapshot', async ({ page }) => {
    await page.goto('/iframe.html?id=overlay-modal--default&viewMode=story');
    await page.getByRole('button', { name: /open default modal/i }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page).toHaveScreenshot('modal-default-open.png');
  });

  test('asChild open render matches snapshot', async ({ page }) => {
    await page.goto('/iframe.html?id=overlay-modal--as-child&viewMode=story');
    await page.getByRole('button', { name: /open aschild modal/i }).click();
    await expect(page.getByText(/custom container/i)).toBeVisible();
    await expect(page).toHaveScreenshot('modal-as-child-open.png');
  });

  test('inside-scrolling modal stays usable in a short viewport', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 320 });
    await page.goto('/iframe.html?id=overlay-modal--default&viewMode=story');
    await page.getByRole('button', { name: /open default modal/i }).click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    const box = await dialog.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.y).toBeGreaterThanOrEqual(-1);
    expect(box!.y + box!.height).toBeLessThanOrEqual(321);
    await expect(page.getByRole('button', { name: 'Close' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Confirm' })).toBeVisible();
  });

  test('scrolling body reserves space for a focused descendant ring', async ({ page }) => {
    await page.goto('/iframe.html?id=overlay-modal--default&viewMode=story');
    await page.getByRole('button', { name: /open default modal/i }).click();

    const bodyContent = page.getByText(/this is the body content of the modal/i);
    const body = bodyContent.locator('..');
    await expect(body).toHaveCSS('scroll-padding-block', '4px');
  });

  test('message modal places its copy in the padded scroll body', async ({ page }) => {
    await page.goto('/iframe.html?id=overlay-modal--message&viewMode=story');

    const copy = page.getByText(/the project will be archived/i);
    await expect(copy).toBeVisible();
    const body = copy.locator('..');
    const paddingInlineStart = await body.evaluate((element) =>
      Number.parseFloat(getComputedStyle(element).paddingInlineStart),
    );
    expect(paddingInlineStart).toBeGreaterThan(0);
    await expect(body).toHaveCSS('scroll-padding-block', '4px');
  });

  test('full modal tracks the available viewport', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 320 });
    await page.goto('/iframe.html?id=overlay-modal--full-viewport&viewMode=story');
    await page.getByRole('button', { name: /open full modal/i }).click();

    const box = await page.getByRole('dialog').boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeLessThanOrEqual(391);
    expect(box!.height).toBeLessThanOrEqual(321);
  });
});
