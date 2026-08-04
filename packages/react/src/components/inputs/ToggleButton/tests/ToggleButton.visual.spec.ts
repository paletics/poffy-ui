import {
  expectNoHorizontalOverflow,
  testStoriesDoNotOverflowOnMobile,
  testVisualStories,
} from '@/components/e2e/visualSpecUtils';
import { expect, test } from '@playwright/test';

testVisualStories({
  componentId: 'inputs-togglebutton',
  snapshotPrefix: 'toggle-button',
  title: 'ToggleButton',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'Sizes', story: 'sizes' },
    { name: 'Variants', story: 'variants' },
    { name: 'Disabled', story: 'disabled' },
    { name: 'Controlled', story: 'controlled' },
  ],
});

test('narrow long labels wrap while every toggle keeps the minimum target', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto('/iframe.html?id=inputs-togglebutton--narrow-long-content&viewMode=story');

  const buttons = page.getByRole('button');
  await expect(buttons).toHaveCount(6);
  for (const button of await buttons.all()) {
    const box = await button.boundingBox();
    expect(box?.width).toBeGreaterThanOrEqual(24);
    expect(box?.height).toBeGreaterThanOrEqual(24);
    expect(await button.evaluate((node) => node.scrollWidth <= node.clientWidth)).toBe(true);
  }
  await expectNoHorizontalOverflow(page);
});

test('logical icon slots follow LTR and RTL inline direction', async ({ page }) => {
  await page.goto('/iframe.html?id=inputs-togglebutton--logical-icon-placement&viewMode=story');

  const startLtr = await page.getByTestId('toggle-start-ltr').boundingBox();
  const endLtr = await page.getByTestId('toggle-end-ltr').boundingBox();
  const startRtl = await page.getByTestId('toggle-start-rtl').boundingBox();
  const endRtl = await page.getByTestId('toggle-end-rtl').boundingBox();

  expect(startLtr?.x).toBeLessThan(endLtr?.x ?? 0);
  expect(startRtl?.x).toBeGreaterThan(endRtl?.x ?? Number.POSITIVE_INFINITY);
});

testStoriesDoNotOverflowOnMobile({
  componentId: 'inputs-togglebutton',
  title: 'ToggleButton',
  stories: [{ name: 'Sizes', story: 'sizes' }],
});
