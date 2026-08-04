import { test, expect } from '@playwright/test';
import { expectNoHorizontalOverflow, testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  componentId: 'overlay-tooltip',
  snapshotPrefix: 'tooltip',
  title: 'Tooltip',
  stories: [
    { name: 'Default Closed', story: 'default' },
    { name: 'Brands Closed', story: 'brands' },
  ],
});

test.describe('Tooltip Interaction Visual Regression', () => {
  test('Hover tooltip matches snapshot', async ({ page }) => {
    await page.goto('/iframe.html?id=overlay-tooltip--interaction&viewMode=story');
    await page.getByRole('button', { name: /hover target/i }).hover();
    const tooltip = page.getByRole('tooltip');
    await expect(tooltip).toBeVisible();
    expect(
      await tooltip.evaluate((element) => {
        const styles = getComputedStyle(element);
        return { maxHeight: styles.maxHeight, overflowY: styles.overflowY };
      }),
    ).toEqual(expect.objectContaining({ overflowY: 'auto' }));
    await expect(page).toHaveScreenshot('tooltip-hover-open.png');
  });

  test('Custom content hover matches snapshot', async ({ page }) => {
    await page.goto('/iframe.html?id=overlay-tooltip--custom-content&viewMode=story');
    await page.getByRole('button', { name: /hover for magic/i }).hover();
    await expect(page.getByRole('tooltip')).toBeVisible();
    await expect(page).toHaveScreenshot('tooltip-custom-content-open.png');
  });

  test('Brands story does not overflow on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/iframe.html?id=overlay-tooltip--brands&viewMode=story');

    await expect(page.getByRole('button', { name: /pome/i }).first()).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });

  test('long content stays reachable in a short viewport', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 180 });
    await page.goto('/iframe.html?id=overlay-tooltip--long-content-short-viewport&viewMode=story');

    const tooltip = page.getByRole('tooltip');
    await expect(tooltip).toBeVisible();
    const metrics = await tooltip.evaluate((element) => {
      const box = element.getBoundingClientRect();
      return {
        bottom: box.bottom,
        clientHeight: element.clientHeight,
        overflowY: getComputedStyle(element).overflowY,
        scrollHeight: element.scrollHeight,
        top: box.top,
      };
    });
    expect(metrics.top).toBeGreaterThanOrEqual(0);
    expect(metrics.bottom).toBeLessThanOrEqual(180);
    expect(metrics.overflowY).toBe('auto');
    expect(metrics.scrollHeight).toBeGreaterThan(metrics.clientHeight);

    const trigger = page.getByRole('button', { name: 'Long tooltip target' });
    await trigger.focus();
    await expect(tooltip).toHaveAttribute('tabindex', '-1');
    await trigger.press('PageDown');
    await expect(trigger).toBeFocused();
    await expect.poll(() => tooltip.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);

    await trigger.press('Home');
    await expect.poll(() => tooltip.evaluate((element) => element.scrollTop)).toBe(0);
    await tooltip.hover();
    const previousScrollTop = await tooltip.evaluate((element) => element.scrollTop);
    await page.mouse.wheel(0, 10_000);
    await expect
      .poll(() => tooltip.evaluate((element) => element.scrollTop))
      .toBeGreaterThan(previousScrollTop);
    await expect
      .poll(() =>
        tooltip.evaluate(
          (element) => element.scrollTop + element.clientHeight >= element.scrollHeight - 1,
        ),
      )
      .toBe(true);
    await expectNoHorizontalOverflow(page);
  });
});
