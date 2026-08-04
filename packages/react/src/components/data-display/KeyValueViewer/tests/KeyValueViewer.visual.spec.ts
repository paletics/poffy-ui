import { expect, test } from '@playwright/test';
import {
  expectNoHorizontalOverflow,
  testStoriesDoNotOverflowOnMobile,
  testVisualStories,
} from '@/components/e2e/visualSpecUtils';

testVisualStories({
  componentId: 'display-keyvalueviewer',
  snapshotPrefix: 'key-value-viewer',
  title: 'KeyValueViewer',
  stories: [{ name: 'Default', story: 'default' }],
});

testStoriesDoNotOverflowOnMobile({
  componentId: 'display-keyvalueviewer',
  title: 'KeyValueViewer',
  stories: [{ name: 'Constrained widths', story: 'constrained-widths' }],
});

test('constrained widths story does not overflow on tablet', async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 900 });
  await page.goto('/iframe.html?id=display-keyvalueviewer--constrained-widths&viewMode=story');
  await expect(page.getByLabel('Wide key value container')).toBeVisible();
  await expectNoHorizontalOverflow(page);
});

test('key-value columns reflow from two columns to stacked terms and values', async ({ page }) => {
  await page.goto('/iframe.html?id=display-keyvalueviewer--constrained-widths&viewMode=story');

  const wide = page.getByLabel('Wide key value container');
  const medium = page.getByLabel('Medium key value container');
  const narrow = page.getByLabel('Narrow key value container');
  const wideItems = wide.locator('.poffy-key-value-viewer__item');
  const mediumList = medium.locator('.poffy-key-value-viewer__list');
  const mediumItems = medium.locator('.poffy-key-value-viewer__item');
  const narrowItem = narrow.locator('.poffy-key-value-viewer__item').first();

  await expect(wide).toBeVisible();
  await expect(medium).toBeVisible();
  await expect(wideItems.nth(0)).toHaveCSS('border-top-width', '0px');
  await expect(wideItems.nth(1)).toHaveCSS('border-top-width', '0px');
  await expect(wideItems.nth(2)).toHaveCSS('border-top-width', '1px');
  await expect
    .poll(() => mediumList.evaluate((element) => getComputedStyle(element).gridTemplateColumns))
    .not.toContain(' ');
  await expect(mediumItems.nth(0)).toHaveCSS('border-top-width', '0px');
  await expect(mediumItems.nth(1)).toHaveCSS('border-top-width', '1px');
  await expect
    .poll(() => narrowItem.evaluate((element) => getComputedStyle(element).gridTemplateColumns))
    .not.toContain(' ');
  expect(await narrow.evaluate((element) => element.scrollWidth <= element.clientWidth + 1)).toBe(
    true,
  );
  await expectNoHorizontalOverflow(page);
});

test('shrink-to-fit metadata keeps a stable intrinsic width', async ({ page }) => {
  await page.goto('/iframe.html?id=display-keyvalueviewer--shrink-to-fit&viewMode=story');

  const host = page.getByTestId('key-value-shrink-host');
  const viewer = page.getByRole('figure', { name: 'Shrink-to-fit metadata' });
  await expect(viewer).toBeVisible();

  const hostBox = (await host.boundingBox())!;
  const viewerBox = (await viewer.boundingBox())!;
  expect(viewerBox.width).toBeGreaterThanOrEqual(250);
  expect(viewerBox.width).toBeLessThanOrEqual(258);
  expect(hostBox.width).toBeGreaterThanOrEqual(viewerBox.width - 1);
  expect(await viewer.evaluate((element) => element.scrollWidth <= element.clientWidth + 1)).toBe(
    true,
  );
  await expectNoHorizontalOverflow(page);
});
