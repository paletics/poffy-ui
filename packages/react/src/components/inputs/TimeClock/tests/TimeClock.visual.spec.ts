import { expect, test } from '@playwright/test';
import { testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  accessibilityStory: 'default',
  componentId: 'inputs-timeclock',
  snapshotPrefix: 'time-clock',
  title: 'TimeClock',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'Sizes', story: 'sizes' },
    { name: 'Controlled', story: 'controlled' },
    { name: 'TwelveHour', story: 'twelve-hour' },
    { name: 'SteppedMinutes', story: 'stepped-minutes' },
  ],
});

test('clock dial scrolls locally while its header stays visible', async ({ page }) => {
  await page.goto('/iframe.html?id=inputs-timeclock--narrow-container&viewMode=story');

  const container = page.getByLabel('Constrained time clock container');
  const clock = page.getByRole('group', { name: 'Constrained clock' });
  const viewport = page.locator('[data-time-clock-dial-viewport]');
  const rightmostHour = page.getByRole('radio', { name: '03' });
  await expect(rightmostHour).toBeVisible();

  expect(await viewport.evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(
    true,
  );
  expect(
    await container.evaluate((element) => element.scrollWidth <= element.clientWidth + 1),
  ).toBe(true);

  const hourControl = clock.locator('[data-time-clock-control="hour"]');
  const headerBoxBefore = await hourControl.boundingBox();
  await rightmostHour.focus();
  await expect.poll(() => viewport.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);
  const headerBoxAfter = await hourControl.boundingBox();
  expect(headerBoxBefore).toEqual(headerBoxAfter);
});

test('outer clock option focus ring stays within the constrained dial viewport', async ({
  page,
}) => {
  await page.goto('/iframe.html?id=inputs-timeclock--narrow-container&viewMode=story');

  const viewport = page.locator('[data-time-clock-dial-viewport]');
  const topHour = page.getByRole('radio', { name: '12' });
  await topHour.focus();

  await expect(topHour).toBeFocused();
  await expect(viewport).toHaveScreenshot('time-clock-constrained-outer-option-focus.png');
});

test('24-hour rings keep every option at least 24px', async ({ page }) => {
  await page.goto('/iframe.html?id=inputs-timeclock--sizes&viewMode=story');

  const hourOptions = page.locator('[data-time-clock-option^="hour-"]');
  await expect(hourOptions.first()).toBeVisible();
  const sizes = await hourOptions.evaluateAll((options) =>
    options.map((option) => {
      const rect = option.getBoundingClientRect();
      return { height: rect.height, width: rect.width };
    }),
  );

  expect(sizes).toHaveLength(72);
  for (const size of sizes) {
    // Chromium can report a 24px token a few millionths below its CSS value.
    expect(size.width).toBeGreaterThanOrEqual(23.99);
    expect(size.height).toBeGreaterThanOrEqual(23.99);
  }
});

test('24-hour hours use distinct inner and outer rings', async ({ page }) => {
  await page.goto('/iframe.html?id=inputs-timeclock--default&viewMode=story');

  await expect(page.getByRole('radio', { name: '00' })).toHaveAttribute('data-ring', 'inner');
  await expect(page.getByRole('radio', { name: '12' })).toHaveAttribute('data-ring', 'outer');
  await expect(page.getByRole('radio', { name: '23' })).toHaveAttribute('data-ring', 'inner');
  await expect(page.getByRole('group', { name: 'AM/PM' })).toHaveCount(0);
});

test('localized meridiem controls reflow inside 40, 80, and 120 pixel parents', async ({
  page,
}) => {
  await page.goto(
    '/iframe.html?id=inputs-timeclock--constrained-localized-meridiem&viewMode=story',
  );

  for (const width of [40, 80, 120] as const) {
    const parent = page.getByTestId(`time-clock-meridiem-${width}`);
    const meridiem = page.getByRole('group', { name: `${width} pixel meridiem` });
    const buttons = meridiem.getByRole('button');
    await expect(buttons).toHaveCount(2);
    await expect(meridiem.getByRole('button', { name: 'AnteMeridiemLocalization' })).toHaveCount(1);
    await expect(meridiem.getByRole('button', { name: 'PostMeridiemLocalization' })).toHaveCount(1);
    await expect(buttons.first()).toHaveCSS('text-overflow', 'ellipsis');
    await expect(buttons.first()).toHaveCSS('white-space', 'nowrap');

    const geometry = await parent.evaluate((element) => {
      const parentBox = element.getBoundingClientRect();
      const controls = Array.from(
        element.querySelectorAll<HTMLElement>('[data-time-clock-control^="meridiem-"]'),
      ).map((control) => {
        const box = control.getBoundingClientRect();
        return {
          blockSize: box.height,
          inlineEnd: box.right,
          inlineStart: box.left,
        };
      });
      return {
        clientWidth: element.clientWidth,
        controls,
        parentEnd: parentBox.right,
        parentStart: parentBox.left,
        scrollWidth: element.scrollWidth,
      };
    });

    expect(geometry.clientWidth).toBe(width);
    expect(geometry.scrollWidth).toBeLessThanOrEqual(geometry.clientWidth + 1);
    for (const control of geometry.controls) {
      expect(control.blockSize).toBeGreaterThanOrEqual(24);
      expect(control.blockSize).toBeLessThanOrEqual(33);
      expect(control.inlineStart).toBeGreaterThanOrEqual(geometry.parentStart - 1);
      expect(control.inlineEnd).toBeLessThanOrEqual(geometry.parentEnd + 1);
    }
  }

  const rtlPm = page.getByTestId('time-clock-meridiem-80').getByRole('button', {
    name: 'PostMeridiemLocalization',
  });
  await rtlPm.focus();
  await expect(rtlPm).toBeFocused();
  await rtlPm.press('Space');
  await expect(rtlPm).toHaveAttribute('aria-pressed', 'true');
});
