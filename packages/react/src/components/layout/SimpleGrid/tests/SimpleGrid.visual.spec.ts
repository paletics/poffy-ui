import {
  testStoriesDoNotOverflowOnMobile,
  testVisualStories,
} from '@/components/e2e/visualSpecUtils';
import { expect, test } from '@playwright/test';

testVisualStories({
  accessibilityStory: 'default',
  componentId: 'layout-simplegrid',
  snapshotPrefix: 'simple-grid',
  title: 'SimpleGrid',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'GapVariations', story: 'gap-variations' },
    { name: 'Responsive', story: 'responsive' },
    { name: 'MinChildWidth', story: 'min-child-width' },
    { name: 'SemanticList', story: 'semantic-list' },
  ],
});

testStoriesDoNotOverflowOnMobile({
  componentId: 'layout-simplegrid',
  title: 'SimpleGrid',
  stories: [{ name: 'MinChildWidth', story: 'min-child-width' }],
});

test('minChildWidth stays within a narrower parent', async ({ page }) => {
  await page.setViewportSize({ width: 180, height: 568 });
  await page.goto('/iframe.html?id=layout-simplegrid--min-child-width&viewMode=story');

  const grid = page.getByLabel('Constrained responsive grid');
  await expect(grid).toBeVisible();
  const fitsParent = await grid.evaluate((node) => node.scrollWidth <= node.clientWidth + 1);

  expect(fitsParent).toBe(true);
});
