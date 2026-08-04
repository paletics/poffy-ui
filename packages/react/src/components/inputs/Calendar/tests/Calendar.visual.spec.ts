import { expect, test } from '@playwright/test';
import { testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  componentId: 'inputs-calendar',
  snapshotPrefix: 'calendar',
  title: 'Calendar',
  stories: [{ name: 'Default', story: 'default' }],
});

test('keeps a medium calendar inside a narrow parent', async ({ page }) => {
  await page.goto('/iframe.html?id=inputs-calendar--constrained-width&viewMode=story');

  const container = page.getByLabel('Constrained calendar container');
  const calendar = page.getByRole('grid').locator('..');
  const title = page.getByText('April 2026', { exact: true });
  const today = page.getByRole('button', { name: 'Go to today' });

  await expect(container).toBeVisible();
  const geometry = await Promise.all([
    container.boundingBox(),
    calendar.boundingBox(),
    title.boundingBox(),
    today.boundingBox(),
    calendar.evaluate((element) => ({
      clientWidth: element.clientWidth,
      scrollWidth: element.scrollWidth,
    })),
    container.evaluate((element) => ({
      clientWidth: element.clientWidth,
      scrollWidth: element.scrollWidth,
    })),
    page
      .getByRole('grid')
      .getByRole('button')
      .evaluateAll((elements) => elements.map((element) => element.getBoundingClientRect())),
  ]);
  const [containerBox, calendarBox, titleBox, todayBox, calendarScroll, containerScroll, dayBoxes] =
    geometry;

  expect(containerBox).not.toBeNull();
  expect(calendarBox).not.toBeNull();
  expect(titleBox).not.toBeNull();
  expect(todayBox).not.toBeNull();
  expect(calendarBox!.width).toBeLessThanOrEqual(containerBox!.width + 1);
  expect(calendarScroll.scrollWidth).toBeLessThanOrEqual(calendarScroll.clientWidth + 1);
  expect(containerScroll.scrollWidth).toBeLessThanOrEqual(containerScroll.clientWidth + 1);
  expect(
    titleBox!.x < todayBox!.x + todayBox!.width &&
      titleBox!.x + titleBox!.width > todayBox!.x &&
      titleBox!.y < todayBox!.y + todayBox!.height &&
      titleBox!.y + titleBox!.height > todayBox!.y,
  ).toBe(false);
  expect(dayBoxes.every(({ width, height }) => width >= 23.99 && height >= 23.99)).toBe(true);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1,
    ),
  ).toBe(true);
  await expect(page).toHaveScreenshot('calendar-constrained-width.png');
});

test('keeps edge day and navigation focus rings visible in a narrow calendar', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/iframe.html?id=inputs-calendar--constrained-width&viewMode=story');
  const firstColumnDay = page.getByRole('button', { name: 'Sunday, April 5, 2026' });
  const edgeDay = page.getByRole('button', { name: 'Saturday, April 4, 2026' });
  const nextMonth = page.getByRole('button', { name: 'Next month' });

  await firstColumnDay.focus();
  await expect(firstColumnDay).toBeFocused();
  await expect(firstColumnDay).toHaveCSS('outline-style', 'solid');
  await expect(page).toHaveScreenshot('calendar-constrained-first-column-day-focus.png');

  await edgeDay.focus();
  await expect(edgeDay).toBeFocused();
  await expect(edgeDay).toHaveCSS('outline-style', 'solid');
  await expect(page).toHaveScreenshot('calendar-constrained-edge-day-focus.png');

  await nextMonth.focus();
  await expect(nextMonth).toBeFocused();
  await expect(nextMonth).toHaveCSS('outline-style', 'solid');
  await expect(page).toHaveScreenshot('calendar-constrained-next-month-focus.png');
});

test('scrolls a focused navigation control into an ultra-narrow calendar', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/iframe.html?id=inputs-calendar--ultra-narrow-focus&viewMode=story');
  const calendar = page.getByRole('group');
  const previousMonth = page.getByRole('button', { name: 'Previous month' });
  const nextMonth = page.getByRole('button', { name: 'Next month' });

  await previousMonth.focus();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await expect(nextMonth).toBeFocused();

  const [scrollLeft, calendarBox, nextMonthBox] = await Promise.all([
    calendar.evaluate((element) => element.scrollLeft),
    calendar.boundingBox(),
    nextMonth.boundingBox(),
  ]);
  expect(scrollLeft).toBeGreaterThan(0);
  expect(calendarBox).not.toBeNull();
  expect(nextMonthBox).not.toBeNull();
  expect(nextMonthBox!.x + nextMonthBox!.width).toBeLessThanOrEqual(
    calendarBox!.x + calendarBox!.width + 1,
  );
  await expect(page).toHaveScreenshot('calendar-ultra-narrow-next-month-focus.png');
});

test('keeps small day targets at least 24px', async ({ page }) => {
  await page.goto('/iframe.html?id=inputs-calendar--small-targets&viewMode=story');

  const dayButtons = page.getByRole('grid').getByRole('button');
  await expect(dayButtons.first()).toBeVisible();

  const boxes = await dayButtons.evaluateAll((elements) =>
    elements.map((element) => element.getBoundingClientRect()),
  );
  expect(boxes.every(({ width, height }) => width >= 23.99 && height >= 23.99)).toBe(true);
});

test('mirrors range endpoint halves in RTL', async ({ page }) => {
  await page.goto('/iframe.html?id=inputs-calendar--rtl-range&viewMode=story');

  const rangeStart = page.locator('td[data-range-start]');
  const rangeEnd = page.locator('td[data-range-end]');
  await expect(rangeStart).toBeVisible();

  const [startStyle, endStyle] = await Promise.all([
    rangeStart.evaluate((element) => {
      const style = getComputedStyle(element, '::before');
      return { left: style.left, right: style.right };
    }),
    rangeEnd.evaluate((element) => {
      const style = getComputedStyle(element, '::before');
      return { left: style.left, right: style.right };
    }),
  ]);
  expect(Number.parseFloat(startStyle.left)).toBeLessThan(Number.parseFloat(startStyle.right));
  expect(Number.parseFloat(endStyle.left)).toBeGreaterThan(Number.parseFloat(endStyle.right));
});
