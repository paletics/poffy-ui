import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { expectNoHorizontalOverflow } from '@/components/e2e/visualSpecUtils';

test.describe('TimePicker Visual Regression', () => {
  test('Default component matches snapshot', async ({ page }) => {
    await page.goto('/iframe.html?id=inputs-timepicker--default&viewMode=story');
    const root = page.getByRole('group');

    await expect(root).toBeVisible();
    await expect(root).toHaveScreenshot('time-picker-default-component.png');
  });

  test('default segments retain inline text padding', async ({ page }) => {
    await page.goto('/iframe.html?id=inputs-timepicker--default&viewMode=story');
    const fields = page.getByRole('spinbutton');

    await expect(fields).toHaveCount(2);
    for (const field of await fields.all()) {
      const padding = await field.evaluate((element) => {
        const style = window.getComputedStyle(element);
        return {
          inlineEnd: Number.parseFloat(style.paddingInlineEnd),
          inlineStart: Number.parseFloat(style.paddingInlineStart),
        };
      });
      expect(padding.inlineStart).toBeGreaterThan(0);
      expect(padding.inlineEnd).toBeGreaterThan(0);
    }
  });

  test('Sizes story matches snapshot', async ({ page }) => {
    await page.goto('/iframe.html?id=inputs-timepicker--sizes&viewMode=story');
    await expect(page.getByRole('spinbutton', { name: 'Hours' }).first()).toBeVisible();
    await expect(page).toHaveScreenshot('time-picker-sizes.png');
  });

  for (const story of ['appearances', 'clock-input', 'wheel-input', 'error-state']) {
    test(`${story} matches snapshot`, async ({ page }) => {
      await page.goto(`/iframe.html?id=inputs-timepicker--${story}&viewMode=story`);
      await expect(page.getByRole('group').first()).toBeVisible();
      await expect(page).toHaveScreenshot(`time-picker-${story}.png`);
    });
  }

  test('12-hour mode matches snapshot', async ({ page }) => {
    await page.goto('/iframe.html?id=inputs-timepicker--twelve-hour&viewMode=story');
    const root = page.getByRole('group');

    await expect(root).toBeVisible();
    await expect(root).toHaveScreenshot('time-picker-twelve-hour-component.png');
  });

  test('Seconds story matches snapshot', async ({ page }) => {
    await page.goto('/iframe.html?id=inputs-timepicker--with-seconds&viewMode=story');
    const root = page.getByRole('group');

    await expect(root).toBeVisible();
    await expect(root).toHaveScreenshot('time-picker-seconds-component.png');
  });

  test('seconds story shrinks its segments before requiring local overflow on mobile', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/iframe.html?id=inputs-timepicker--with-seconds&viewMode=story');
    const root = page.getByRole('group');

    await expect(root).toBeVisible();
    await expect(page.getByRole('spinbutton', { name: 'Seconds' })).toBeVisible();
    expect(await root.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
    await expectNoHorizontalOverflow(page);
  });

  test('clock header focus ring remains visible inside the time picker', async ({ page }) => {
    await page.goto('/iframe.html?id=inputs-timepicker--clock-input&viewMode=story');
    const hourControl = page.getByRole('button', { name: /hours 09/i });
    await hourControl.focus();
    await expect(hourControl).toBeFocused();
    await expect(page.getByRole('group').first()).toHaveScreenshot(
      'time-picker-clock-header-focus.png',
    );
  });

  test('full segments use local scrolling in a narrow parent', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/iframe.html?id=inputs-timepicker--constrained-full-segments&viewMode=story');

    await expect(page.getByRole('spinbutton', { name: 'Seconds' })).toBeVisible();

    const container = page.getByLabel('Constrained time container');
    const group = page.getByRole('group', { name: 'Constrained time' });
    const [containerBox, groupBox, usesLocalScrolling] = await Promise.all([
      container.boundingBox(),
      group.boundingBox(),
      group.evaluate((element) => element.scrollWidth > element.clientWidth),
    ]);

    expect(containerBox).not.toBeNull();
    expect(groupBox).not.toBeNull();
    expect(groupBox!.x).toBeGreaterThanOrEqual(containerBox!.x - 1);
    expect(groupBox!.x + groupBox!.width).toBeLessThanOrEqual(
      containerBox!.x + containerBox!.width + 1,
    );
    expect(usesLocalScrolling).toBe(true);
    const seconds = page.getByRole('spinbutton', { name: 'Seconds' });
    await seconds.focus();
    await expect(seconds).toBeFocused();
    await expect(page).toHaveScreenshot('time-picker-constrained-segment-focus.png');
  });

  test('segment widths depend on the parent instead of the viewport', async ({ page }) => {
    const measureSegments = async (viewportWidth: number) => {
      await page.setViewportSize({ width: viewportWidth, height: 844 });
      await page.goto(
        '/iframe.html?id=inputs-timepicker--constrained-full-segments&viewMode=story',
      );
      const group = page.getByRole('group', { name: 'Constrained time' });
      await expect(group).toBeVisible();
      return group
        .getByRole('spinbutton')
        .evaluateAll((nodes) => nodes.map((node) => node.getBoundingClientRect().width));
    };

    const narrowViewportWidths = await measureSegments(390);
    const wideViewportWidths = await measureSegments(1200);

    expect(wideViewportWidths).toHaveLength(3);
    wideViewportWidths.forEach((width, index) => {
      expect(Math.abs(width - narrowViewportWidths[index]!)).toBeLessThanOrEqual(1);
    });
  });

  test('should pass accessibility compliance', async ({ page }) => {
    await page.goto('/iframe.html?id=inputs-timepicker--default&viewMode=story');
    await expect(page.getByRole('group')).toBeVisible();
    const results = await new AxeBuilder({ page }).include('[role="group"]').analyze();
    expect(results.violations).toEqual([]);
  });
});
