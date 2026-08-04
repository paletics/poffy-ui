import {
  expectNoHorizontalOverflow,
  testStoriesDoNotOverflowOnMobile,
  testVisualStories,
} from '@/components/e2e/visualSpecUtils';
import { expect, test } from '@playwright/test';

testVisualStories({
  accessibilityStory: 'default',
  componentId: 'inputs-buttongroup',
  snapshotPrefix: 'button-group',
  title: 'ButtonGroup',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'Vertical', story: 'vertical' },
    { name: 'Spacing', story: 'spacing' },
    { name: 'Connected', story: 'connected' },
    { name: 'AsChildConnected', story: 'as-child-connected' },
    { name: 'VerticalConnected', story: 'vertical-connected' },
  ],
});

test('wrapping groups keep whole buttons and long labels inside the parent', async ({ page }) => {
  await page.goto('/iframe.html?id=inputs-buttongroup--constrained-wrapping&viewMode=story');

  const container = page.getByLabel('Constrained wrapping container');
  const group = page.getByRole('group', { name: 'Constrained actions' });
  const primary = group.getByRole('button', { name: 'A deliberately long primary action' });
  const cancel = group.getByRole('button', { name: 'Cancel' });
  const [containerBox, groupBox, primaryBox, cancelBox] = await Promise.all([
    container.boundingBox(),
    group.boundingBox(),
    primary.boundingBox(),
    cancel.boundingBox(),
  ]);

  expect(containerBox).not.toBeNull();
  expect(groupBox).not.toBeNull();
  expect(primaryBox).not.toBeNull();
  expect(cancelBox).not.toBeNull();
  expect(groupBox!.width).toBeLessThanOrEqual(containerBox!.width + 1);
  expect(primaryBox!.width).toBeLessThanOrEqual(containerBox!.width + 1);
  expect(await primary.evaluate((node) => node.scrollWidth <= node.clientWidth)).toBe(true);
  expect(cancelBox!.y).toBeGreaterThanOrEqual(primaryBox!.y + primaryBox!.height - 1);
  await expectNoHorizontalOverflow(page);
});

test('connected full-width groups shrink and preserve RTL logical order', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 844 });
  await page.goto('/iframe.html?id=inputs-buttongroup--narrow-connected-rtl&viewMode=story');

  await expectNoHorizontalOverflow(page);
  const groups = page.getByRole('group');
  await expect(groups).toHaveCount(2);
  const horizontalButtons = groups.first().getByRole('button');
  await expect(horizontalButtons).toHaveCount(3);

  const first = await horizontalButtons.nth(0).boundingBox();
  const second = await horizontalButtons.nth(1).boundingBox();
  expect(first?.x).toBeGreaterThan(second?.x ?? Number.POSITIVE_INFINITY);
  for (const button of await horizontalButtons.all()) {
    expect(await button.evaluate((node) => node.scrollWidth <= node.clientWidth)).toBe(true);
  }
});

test('connected horizontal group keeps edge focus rings above shared borders', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/iframe.html?id=inputs-buttongroup--as-child-connected&viewMode=story');
  const group = page.getByRole('group');
  const first = group.getByRole('button', { name: 'Cut' });
  const last = group.getByRole('button', { name: 'Paste' });

  await first.focus();
  await expect(first).toBeFocused();
  await expect(first).toHaveCSS('outline-style', 'solid');
  await expect(group.evaluate((element) => element.tagName)).resolves.toBe('SECTION');
  await expect(page).toHaveScreenshot('button-group-as-child-connected-first-focus.png');

  await last.focus();
  await expect(last).toBeFocused();
  await expect(last).toHaveCSS('outline-style', 'solid');
  await expect(page).toHaveScreenshot('button-group-as-child-connected-last-focus.png');
});

test('connected vertical group keeps edge focus rings above shared borders', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/iframe.html?id=inputs-buttongroup--vertical-connected&viewMode=story');
  const group = page.getByRole('group');
  const first = group.getByRole('button', { name: 'Option 1' });
  const last = group.getByRole('button', { name: 'Option 3' });

  await first.focus();
  await expect(first).toBeFocused();
  await expect(first).toHaveCSS('outline-style', 'solid');
  await expect(page).toHaveScreenshot('button-group-vertical-connected-first-focus.png');

  await last.focus();
  await expect(last).toBeFocused();
  await expect(last).toHaveCSS('outline-style', 'solid');
  await expect(page).toHaveScreenshot('button-group-vertical-connected-last-focus.png');
});

testStoriesDoNotOverflowOnMobile({
  componentId: 'inputs-buttongroup',
  title: 'ButtonGroup',
  stories: [
    { name: 'Playground', story: 'playground' },
    { name: 'Toolbar', story: 'toolbar' },
    { name: 'Pagination', story: 'pagination' },
  ],
});
