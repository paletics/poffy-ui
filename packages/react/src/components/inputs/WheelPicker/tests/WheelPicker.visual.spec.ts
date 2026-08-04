import { expect, test } from '@playwright/test';
import { testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  componentId: 'inputs-wheelpicker',
  snapshotPrefix: 'wheel-picker',
  title: 'WheelPicker',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'Sizes', story: 'sizes' },
    { name: 'Controlled', story: 'controlled' },
  ],
});

test('multiple columns use local scrolling and reveal the focused column', async ({ page }) => {
  await page.goto('/iframe.html?id=inputs-wheelpicker--narrow-container&viewMode=story');

  const container = page.getByLabel('Constrained wheel picker container');
  const picker = page.getByRole('group', { name: 'Constrained duration' });
  const columns = picker.getByRole('listbox');
  await expect(columns).toHaveCount(3);

  expect(await picker.evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(true);
  expect(
    await container.evaluate((element) => element.scrollWidth <= element.clientWidth + 1),
  ).toBe(true);

  const firstColumn = columns.first();
  const lastColumn = columns.last();
  const focusClearance = await lastColumn.evaluate((element) => {
    const style = getComputedStyle(element);
    return Number.parseFloat(style.outlineWidth) + Number.parseFloat(style.outlineOffset);
  });

  await lastColumn.focus();
  await expect.poll(() => picker.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);
  const [pickerBox, columnBox] = await Promise.all([
    picker.boundingBox(),
    lastColumn.boundingBox(),
  ]);
  expect(pickerBox).not.toBeNull();
  expect(columnBox).not.toBeNull();
  expect(columnBox!.x + columnBox!.width).toBeLessThanOrEqual(
    pickerBox!.x + pickerBox!.width - focusClearance + 1,
  );

  await firstColumn.focus();
  await expect.poll(() => picker.evaluate((element) => element.scrollLeft)).toBe(0);
  const firstColumnBox = await firstColumn.boundingBox();
  expect(firstColumnBox).not.toBeNull();
  expect(firstColumnBox!.x).toBeGreaterThanOrEqual(pickerBox!.x + focusClearance - 1);
});

test('keeps the selected option centered across runtime size changes', async ({ page }) => {
  await page.goto('/iframe.html?id=inputs-wheelpicker--runtime-size-change&viewMode=story');

  const listbox = page.getByRole('listbox', { name: 'Minute' });
  const selectedOption = listbox.getByRole('option', { selected: true });
  const selectedValue = page.getByLabel('Runtime selected value');
  const expectCentered = async () => {
    await expect
      .poll(async () => {
        const [listboxBox, optionBox] = await Promise.all([
          listbox.boundingBox(),
          selectedOption.boundingBox(),
        ]);
        if (!listboxBox || !optionBox) return Number.POSITIVE_INFINITY;
        return Math.abs(
          optionBox.y + optionBox.height / 2 - (listboxBox.y + listboxBox.height / 2),
        );
      })
      .toBeLessThan(1);
  };

  await expect(selectedValue).toHaveText('45');
  await expectCentered();
  await page.getByRole('button', { name: 'Toggle size' }).click();
  await expectCentered();
  await expect(selectedValue).toHaveText('45');
  await page.getByRole('button', { name: 'Toggle size' }).click();
  await expectCentered();
  await expect(selectedValue).toHaveText('45');
});
