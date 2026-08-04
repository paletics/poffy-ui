import { test, expect } from '@playwright/test';
import { expectNoHorizontalOverflow, testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  accessibilityStory: 'accessibility-open',
  componentId: 'overlay-popover',
  snapshotPrefix: 'popover',
  title: 'Popover',
  stories: [
    { name: 'Default Closed', story: 'default' },
    { name: 'Placements Closed', story: 'placements' },
  ],
});

test.describe('Popover Interaction Visual Regression', () => {
  test('managed content animates entry and exit when motion is enabled', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/iframe.html?id=overlay-popover--default&viewMode=story');

    await page.getByRole('button', { name: /click me/i }).click();
    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible();
    await page.waitForTimeout(20);
    await expect
      .poll(() => dialog.evaluate((element) => Number(getComputedStyle(element).opacity)))
      .toBeLessThan(1);
    await expect
      .poll(() => dialog.evaluate((element) => Number(getComputedStyle(element).opacity)))
      .toBe(1);

    await page.keyboard.press('Escape');
    await page.waitForTimeout(20);
    await expect(dialog).toBeAttached();
    await expect
      .poll(() => dialog.evaluate((element) => Number(getComputedStyle(element).opacity)))
      .toBeLessThan(1);
    await expect(dialog).toHaveCount(0);
  });

  test('managed content preserves logical forward and reverse Tab order', async ({ page }) => {
    await page.goto('/iframe.html?id=overlay-popover--managed-focus-order&viewMode=story');

    const before = page.getByRole('button', { name: 'Before popover' });
    const trigger = page.getByRole('button', { name: 'Open managed popover' });
    const first = page.getByRole('button', { name: 'First action' });
    const last = page.getByRole('button', { name: 'Last action' });
    const after = page.getByRole('button', { name: 'After popover' });

    await trigger.focus();
    await page.keyboard.press('Enter');
    await expect(first).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(last).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(after).toBeFocused();
    await expect(first).toBeHidden();

    await trigger.focus();
    await page.keyboard.press('Enter');
    await expect(first).toBeFocused();
    await page.keyboard.press('Shift+Tab');
    await expect(trigger).toBeFocused();
    await expect(first).toBeVisible();
    await page.keyboard.press('Shift+Tab');
    await expect(before).toBeFocused();
    await expect(first).toBeHidden();

    await trigger.focus();
    await page.keyboard.press('Enter');
    await expect(first).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(last).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(trigger).toBeFocused();
    await expect(first).toBeHidden();
    expect(await page.locator('[data-floating-ui-focus-guard]').count()).toBe(0);

    await page.keyboard.press('Enter');
    await expect(first).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(trigger).toBeFocused();
    await expect(first).toBeHidden();
    expect(await page.locator('[data-floating-ui-focus-guard]').count()).toBe(0);
  });

  test('unmanaged content preserves native external Tab order', async ({ page }) => {
    await page.goto('/iframe.html?id=overlay-popover--unmanaged-focus-order&viewMode=story');

    const before = page.getByRole('button', { name: 'Before unmanaged popover' });
    const trigger = page.getByRole('button', { name: 'Open unmanaged popover' });
    const after = page.getByRole('button', { name: 'After unmanaged popover' });
    const dialog = page.getByRole('dialog', { name: 'Unmanaged information' });

    await trigger.focus();
    await page.keyboard.press('Enter');
    await expect(dialog).toBeVisible();
    await page.keyboard.press('Tab');
    await expect(after).toBeFocused();
    await expect(dialog).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await trigger.focus();
    await page.keyboard.press('Enter');
    await page.keyboard.press('Shift+Tab');
    await expect(before).toBeFocused();
    await expect(dialog).toBeVisible();
  });

  test('Default open render matches snapshot', async ({ page }) => {
    await page.goto('/iframe.html?id=overlay-popover--default&viewMode=story');
    await page.getByRole('button', { name: /click me/i }).click();
    await expect(page.getByText(/popover title/i)).toBeVisible();
    await expect(page).toHaveScreenshot('popover-default-open.png');
  });

  test('No arrow open render matches snapshot', async ({ page }) => {
    await page.goto('/iframe.html?id=overlay-popover--no-arrow&viewMode=story');
    await page.getByRole('button', { name: /click me/i }).click();
    await expect(page.getByText(/popover title/i)).toBeVisible();
    await expect(page).toHaveScreenshot('popover-no-arrow-open.png');
  });

  test('content-owned surfaces keep Popover chrome out of the child layout', async ({ page }) => {
    await page.goto('/iframe.html?id=overlay-popover--content-owned-surface&viewMode=story');
    await page.getByRole('button', { name: 'Open content-owned surface' }).click();

    const content = page.getByRole('dialog', { name: 'Content-owned surface' });
    await expect(content).toBeVisible();
    await expect(content).toHaveAttribute('data-surface', 'none');
    await expect(content).toHaveCSS('padding', '0px');
    await expect(content).toHaveCSS('border-top-width', '0px');
    await expect(content).toHaveCSS('box-shadow', 'none');
    expect(await content.locator('svg').count()).toBe(0);
  });

  test('Gallery stories do not overflow on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });

    for (const story of ['placements', 'brands', 'theme-override']) {
      await page.goto(`/iframe.html?id=overlay-popover--${story}&viewMode=story`);
      await expect(page.getByRole('button').first()).toBeVisible();
      await expectNoHorizontalOverflow(page);
    }
  });

  test('Open content is constrained by a narrow and short viewport', async ({ page }) => {
    await page.setViewportSize({ width: 280, height: 180 });
    await page.goto('/iframe.html?id=overlay-popover--default&viewMode=story');
    await page.getByRole('button', { name: /click me/i }).click();

    const content = page.getByRole('dialog');
    await expect(content).toBeVisible();
    await content.evaluate(async (element) => {
      await Promise.all(
        element.getAnimations({ subtree: true }).map((animation) => animation.finished),
      );
    });
    const box = await content.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeLessThanOrEqual(280);
    expect(box!.height).toBeLessThanOrEqual(180);
    expect(
      await content.evaluate((element) =>
        getComputedStyle(element).getPropertyValue('--floating-fallback-padding').trim(),
      ),
    ).toBe('8px');
    const zeroAvailability = await content.evaluate((element) => {
      element.style.setProperty('--floating-available-width', '0px');
      element.style.setProperty('--floating-available-height', '0px');
      const styles = getComputedStyle(element);
      return { maxHeight: styles.maxHeight, maxWidth: styles.maxWidth };
    });
    expect(zeroAvailability).toEqual({ maxHeight: '0px', maxWidth: '0px' });
    await expectNoHorizontalOverflow(page);
  });

  test('RTL close control uses the inline end edge in a narrow viewport', async ({ page }) => {
    await page.setViewportSize({ width: 240, height: 220 });
    await page.goto('/iframe.html?id=overlay-popover--narrow-viewport&viewMode=story');
    await page.getByRole('button', { name: 'Open' }).click();

    const content = page.getByRole('dialog');
    const close = page.getByRole('button', { name: 'Close compact popover' });
    const title = page.getByRole('heading', { name: /compact popover title/i });
    await expect(content).toBeVisible();
    await expect(close).toBeVisible();
    await content.evaluate(async (element) => {
      await Promise.all(
        element.getAnimations({ subtree: true }).map((animation) => animation.finished),
      );
    });
    const contentBox = await content.boundingBox();
    const closeBox = await close.boundingBox();
    expect(contentBox).not.toBeNull();
    expect(closeBox).not.toBeNull();
    expect(closeBox!.x).toBeGreaterThanOrEqual(contentBox!.x);
    expect(closeBox!.x + closeBox!.width).toBeLessThanOrEqual(contentBox!.x + contentBox!.width);
    expect(closeBox!.x - contentBox!.x).toBeLessThan(contentBox!.width / 2);
    expect(closeBox!.width).toBeGreaterThanOrEqual(24);
    expect(closeBox!.height).toBeGreaterThanOrEqual(24);
    expect(
      await title.evaluate((element, closeRect) => {
        const range = element.ownerDocument.createRange();
        range.selectNodeContents(element);
        return [...range.getClientRects()].every(
          (rect) =>
            !(
              rect.right > closeRect.left &&
              rect.left < closeRect.right &&
              rect.bottom > closeRect.top &&
              rect.top < closeRect.bottom
            ),
        );
      }, closeBox!),
    ).toBe(true);
    await close.focus();
    await expect(close).toBeFocused();
    await expectNoHorizontalOverflow(page);
  });
});
