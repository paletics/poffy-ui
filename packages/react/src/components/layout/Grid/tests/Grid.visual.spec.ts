import { expect, test } from '@playwright/test';
import { testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  accessibilityStory: 'default',
  componentId: 'layout-grid',
  snapshotPrefix: 'grid',
  title: 'Grid',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'SilverRatioLeft', story: 'silver-ratio-left' },
    { name: 'SilverRatioRight', story: 'silver-ratio-right' },
    { name: 'GoldenRatioLeft', story: 'golden-ratio-left' },
    { name: 'GoldenRatioRight', story: 'golden-ratio-right' },
  ],
});

test('minChildWidth stays within a narrower parent', async ({ page }) => {
  await page.goto('/iframe.html?id=layout-grid--constrained-auto-fit&viewMode=story');

  const grid = page.getByLabel('Constrained auto-fit grid');
  await expect(grid).toBeVisible();
  const fitsParent = await grid.evaluate((node) => node.scrollWidth <= node.clientWidth + 1);

  expect(fitsParent).toBe(true);
});

test('nested layouts shrink around long tokens in narrow parents', async ({ page }) => {
  await page.goto('/iframe.html?id=layout-grid--nested-constrained-long-token&viewMode=story');

  const layouts = page.getByLabel('Constrained nested layouts');
  const ratioGrid = page.getByLabel('Constrained ratio grid');
  const simpleGrid = page.getByLabel('Constrained simple grid');
  await expect(layouts).toBeVisible();

  for (const container of [layouts, ratioGrid, simpleGrid]) {
    expect(await container.evaluate((node) => node.scrollWidth <= node.clientWidth + 1)).toBe(true);
  }
});

test('physical and logical ratio tracks follow their LTR and RTL contracts', async ({ page }) => {
  await page.goto('/iframe.html?id=layout-grid--direction-contracts&viewMode=story');

  const getPhysicalTracks = async (label: string) => {
    const grid = page.getByLabel(label, { exact: true });
    const first = grid.getByText('First', { exact: true });
    const second = grid.getByText('Second', { exact: true });
    await expect(first).toBeVisible();
    const [firstBox, secondBox] = await Promise.all([first.boundingBox(), second.boundingBox()]);
    expect(firstBox).not.toBeNull();
    expect(secondBox).not.toBeNull();
    const boxes = [
      { name: 'first', width: firstBox!.width, x: firstBox!.x },
      { name: 'second', width: secondBox!.width, x: secondBox!.x },
    ].sort((a, b) => a.x - b.x);
    return { left: boxes[0]!, right: boxes[1]! };
  };

  for (const label of [
    'Silver physical left LTR',
    'Silver physical left inherited RTL',
    'Silver physical left asChild RTL',
  ]) {
    const tracks = await getPhysicalTracks(label);
    expect(tracks.left.width).toBeGreaterThan(tracks.right.width);
  }

  for (const label of [
    'Silver physical right LTR',
    'Silver physical right inherited RTL',
    'Golden physical right inherited RTL',
  ]) {
    const tracks = await getPhysicalTracks(label);
    expect(tracks.right.width).toBeGreaterThan(tracks.left.width);
  }

  const logicalStartLtr = await getPhysicalTracks('Silver logical start LTR');
  expect(logicalStartLtr.left.name).toBe('first');
  expect(logicalStartLtr.left.width).toBeGreaterThan(logicalStartLtr.right.width);

  const logicalStartRtl = await getPhysicalTracks('Silver logical start inherited RTL');
  expect(logicalStartRtl.right.name).toBe('first');
  expect(logicalStartRtl.right.width).toBeGreaterThan(logicalStartRtl.left.width);

  const logicalEndLtr = await getPhysicalTracks('Silver logical end LTR');
  expect(logicalEndLtr.right.width).toBeGreaterThan(logicalEndLtr.left.width);

  const logicalEndRtl = await getPhysicalTracks('Silver logical end inherited RTL');
  expect(logicalEndRtl.left.width).toBeGreaterThan(logicalEndRtl.right.width);
});
