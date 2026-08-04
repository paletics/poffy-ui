import {
  testStoriesDoNotOverflowOnMobile,
  testVisualStories,
} from '@/components/e2e/visualSpecUtils';
import { expect, test } from '@playwright/test';

testVisualStories({
  componentId: 'inputs-datetimepicker',
  snapshotPrefix: 'date-time-picker',
  title: 'DateTimePicker',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'Controlled', story: 'controlled' },
  ],
});

testStoriesDoNotOverflowOnMobile({
  componentId: 'inputs-datetimepicker',
  title: 'DateTimePicker',
  stories: [{ name: 'TwelveHourWithSeconds', story: 'twelve-hour-with-seconds' }],
});

test('date and time fields fit a parent narrower than the former date minimum', async ({
  page,
}) => {
  await page.goto('/iframe.html?id=inputs-datetimepicker--narrow-container&viewMode=story');

  const container = page.getByLabel('Constrained date-time container');
  const date = page.getByRole('button', { name: 'Constrained appointment date' });
  await expect(date).toBeVisible();

  const [containerBox, dateBox] = await Promise.all([container.boundingBox(), date.boundingBox()]);
  expect(containerBox).not.toBeNull();
  expect(dateBox).not.toBeNull();
  expect(dateBox!.x + dateBox!.width).toBeLessThanOrEqual(
    containerBox!.x + containerBox!.width + 1,
  );
  expect(
    await container.evaluate((element) => element.scrollWidth <= element.clientWidth + 1),
  ).toBe(true);
});

test('calendar tab exit continues into the time controls', async ({ page }) => {
  await page.goto('/iframe.html?id=inputs-datetimepicker--default&viewMode=story');

  const date = page.getByRole('button', { name: 'Date' });
  await date.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('button', { name: /Tuesday, April 14, 2026/i })).toBeFocused();

  await page.keyboard.press('Tab');
  await expect(page.getByRole('spinbutton', { name: 'Hours' })).toBeFocused();
  await expect(page.getByRole('dialog', { name: 'Calendar' })).toBeHidden();
});

for (const [name, viewport] of Object.entries({
  Desktop: { width: 1280, height: 900 },
  Tablet: { width: 768, height: 900 },
  Mobile: { width: 390, height: 844 },
})) {
  test(`${name} calendar popover remains within the viewport`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto('/iframe.html?id=inputs-datetimepicker--default&viewMode=story');
    await page.getByRole('button', { name: 'Date' }).click();

    const calendar = page.getByRole('dialog', { name: 'Calendar' });
    await expect(calendar).toBeVisible();
    const bounds = await calendar.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      return { bottom: rect.bottom, left: rect.left, right: rect.right, top: rect.top };
    });
    expect(bounds.left).toBeGreaterThanOrEqual(0);
    expect(bounds.top).toBeGreaterThanOrEqual(0);
    expect(bounds.right).toBeLessThanOrEqual(viewport.width);
    expect(bounds.bottom).toBeLessThanOrEqual(viewport.height);
  });
}
