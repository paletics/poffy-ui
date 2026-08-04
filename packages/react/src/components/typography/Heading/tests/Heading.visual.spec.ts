import { testVisualStories } from '@/components/e2e/visualSpecUtils';
import { expect, test } from '@playwright/test';

testVisualStories({
  accessibilityStory: 'default',
  componentId: 'display-heading',
  snapshotPrefix: 'heading',
  title: 'Heading',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'AsChild', story: 'as-child' },
    { name: 'Levels', story: 'levels' },
    { name: 'Weights', story: 'weights' },
    { name: 'TypeScale', story: 'type-scale' },
  ],
});

test('long typography tokens wrap inside a 160px parent', async ({ page }) => {
  await page.goto('/iframe.html?id=display-heading--constrained-long-token&viewMode=story');

  const container = page.getByLabel('Constrained typography');
  await expect(container).toBeVisible();
  expect(await container.evaluate((node) => node.scrollWidth <= node.clientWidth + 1)).toBe(true);
});
