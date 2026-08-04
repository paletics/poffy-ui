import {
  testStoriesDoNotOverflowOnMobile,
  testVisualStories,
} from '@/components/e2e/visualSpecUtils';
import { expect, test } from '@playwright/test';

testVisualStories({
  accessibilityStory: 'default',
  componentId: 'display-table',
  snapshotPrefix: 'table',
  title: 'Table',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'Striped', story: 'striped' },
    { name: 'Outline', story: 'outline' },
    { name: 'StripedVertical', story: 'striped-vertical' },
    { name: 'Borderless', story: 'borderless' },
    { name: 'FixedLayout', story: 'fixed-layout' },
    { name: 'DisplayEnhancements', story: 'display-enhancements' },
    { name: 'ComposedCaptionDetails', story: 'composed-caption-details' },
  ],
});

testStoriesDoNotOverflowOnMobile({
  componentId: 'display-table',
  title: 'Table',
  stories: [
    { name: 'Borderless', story: 'borderless' },
    { name: 'FixedLayout', story: 'fixed-layout' },
    { name: 'ColumnPresentation', story: 'column-presentation' },
  ],
});

test('a wide table scrolls locally without widening the page', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto('/iframe.html?id=display-table--scrollable-wide-table&viewMode=story');

  const scrollContainer = page.getByLabel('Wide account activity table');
  await expect(scrollContainer).toBeVisible();
  await expect(scrollContainer).toHaveAttribute('tabindex', '0');
  expect(
    await scrollContainer.evaluate((element) => element.scrollWidth > element.clientWidth),
  ).toBe(true);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1,
    ),
  ).toBe(true);

  await scrollContainer.focus();
  await expect(scrollContainer).toBeFocused();
  await expect(scrollContainer).toHaveCSS('outline-style', 'solid');
  const [containerBox, outline] = await Promise.all([
    scrollContainer.boundingBox(),
    scrollContainer.evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        offset: Number.parseFloat(style.outlineOffset),
        width: Number.parseFloat(style.outlineWidth),
      };
    }),
  ]);
  expect(containerBox).not.toBeNull();
  const focusClearance = outline.width + outline.offset;
  expect(containerBox!.x - focusClearance).toBeGreaterThanOrEqual(0);
  expect(containerBox!.y - focusClearance).toBeGreaterThanOrEqual(0);
  expect(containerBox!.x + containerBox!.width + focusClearance).toBeLessThanOrEqual(320);
  expect(containerBox!.y + containerBox!.height + focusClearance).toBeLessThanOrEqual(700);
  await expect(page).toHaveScreenshot('table-scroll-container-focus.png');

  await page.keyboard.press('ArrowRight');
  await expect
    .poll(() => scrollContainer.evaluate((element) => element.scrollLeft))
    .toBeGreaterThan(0);
});

test('sticky columns preserve position, truncation, and striped backgrounds', async ({ page }) => {
  await page.goto('/iframe.html?id=display-table--column-presentation&viewMode=story');

  const scrollContainer = page.getByRole('region', { name: 'Product inventory' });
  const stickyHeader = page.getByRole('columnheader', { name: 'Product' });
  const stickyCell = page.getByRole('cell', {
    name: 'Extremely long product name that remains in its own column',
  });
  const row = stickyCell.locator('..');
  await expect(stickyCell).toHaveAttribute('data-sticky', '');
  await expect(stickyCell).toHaveCSS('position', 'sticky');
  await expect(stickyCell).toHaveCSS('inset-inline-start', '0px');
  await expect(scrollContainer).toHaveScreenshot('table-column-presentation.png');
  const before = await stickyCell.boundingBox();
  expect(before).not.toBeNull();

  await scrollContainer.evaluate((element) => {
    element.scrollLeft = element.scrollWidth;
    element.dispatchEvent(new Event('scroll'));
  });
  const after = await stickyCell.boundingBox();
  expect(after).not.toBeNull();
  expect(Math.abs(after!.x - before!.x)).toBeLessThanOrEqual(1);
  await expect(stickyCell).toHaveCSS('text-overflow', 'ellipsis');

  const [rowBackground, cellBackground, firstHeaderBackground, secondHeaderBackground] =
    await Promise.all([
      row.evaluate((element) => getComputedStyle(element).backgroundColor),
      stickyCell.evaluate((element) => getComputedStyle(element).backgroundColor),
      stickyHeader.evaluate((element) => getComputedStyle(element).backgroundColor),
      page
        .getByRole('columnheader', { name: 'In stock' })
        .evaluate((element) => getComputedStyle(element).backgroundColor),
    ]);
  expect(cellBackground).toBe(rowBackground);
  expect(firstHeaderBackground).toBe(secondHeaderBackground);
});

test('row separators follow the block axis in vertical writing mode', async ({ page }) => {
  await page.goto('/iframe.html?id=display-table--vertical-writing-mode&viewMode=story');

  const firstRow = page.getByRole('row').first();
  const borders = await firstRow.evaluate((element) => {
    const styles = getComputedStyle(element);
    return {
      bottom: styles.borderBottomWidth,
      left: styles.borderLeftWidth,
    };
  });

  expect(borders.left).toBe('1px');
  expect(borders.bottom).toBe('0px');
});

test('size variants increase cell padding', async ({ page }) => {
  await page.goto('/iframe.html?id=display-table--sizes&viewMode=story');

  const paddings = await Promise.all(
    ['sm', 'md', 'lg'].map(async (size) => {
      const table = page.getByRole('table', { name: `${size} size table` });
      const cell = table.getByRole('cell');
      return Number.parseFloat(await cell.evaluate((element) => getComputedStyle(element).padding));
    }),
  );

  expect(paddings[0]).toBeLessThan(paddings[1]);
  expect(paddings[1]).toBeLessThan(paddings[2]);

  const captionSizes = await Promise.all(
    ['sm', 'md', 'lg'].map((size) =>
      page
        .getByText(`${size} size caption`)
        .evaluate((element) => Number.parseFloat(getComputedStyle(element).fontSize)),
    ),
  );
  expect(captionSizes[0]).toBeLessThan(captionSizes[1]);
  expect(captionSizes[1]).toBeLessThan(captionSizes[2]);
});

test('a long caption respects a 160px parent in a wide viewport', async ({ page }) => {
  await page.setViewportSize({ width: 1000, height: 700 });
  await page.goto('/iframe.html?id=display-table--constrained-long-caption&viewMode=story');

  const parent = page.getByTestId('constrained-caption-table');
  const table = page.getByRole('table', { name: 'Constrained caption table' });
  const caption = table.locator('caption');
  const [parentBox, tableBox, captionBox] = await Promise.all([
    parent.boundingBox(),
    table.boundingBox(),
    caption.boundingBox(),
  ]);

  expect(parentBox).not.toBeNull();
  expect(tableBox).not.toBeNull();
  expect(captionBox).not.toBeNull();
  expect(tableBox!.width).toBeLessThanOrEqual(parentBox!.width + 1);
  expect(captionBox!.width).toBeLessThanOrEqual(tableBox!.width + 1);
  expect(await caption.evaluate((element) => element.scrollWidth <= element.clientWidth + 1)).toBe(
    true,
  );
});

test('external caption details preserve the native table name', async ({ page }) => {
  await page.goto('/iframe.html?id=display-table--composed-caption-details&viewMode=story');

  const table = page.getByRole('table', { name: 'Inventory summary' });
  const trigger = page.getByRole('button', { name: 'Show inventory scope' });

  await expect(table).toHaveAccessibleName('Inventory summary');
  await trigger.click();
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByText(/Counts include active products/)).toBeVisible();
  await expect(table).toHaveAccessibleName('Inventory summary');
  await expect(table).toHaveAccessibleDescription(
    'Counts include active products in the Tokyo warehouse and exclude archived records.',
  );
});
