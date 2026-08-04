import {
  testStoriesDoNotOverflowOnMobile,
  testVisualStories,
} from '@/components/e2e/visualSpecUtils';
import { expect, test } from '@playwright/test';

testVisualStories({
  accessibilityStory: 'default',
  componentId: 'display-stat',
  snapshotPrefix: 'stat',
  title: 'Stat',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'WithIndicators', story: 'with-indicators' },
    { name: 'Sizes', story: 'sizes' },
  ],
});

testStoriesDoNotOverflowOnMobile({
  componentId: 'display-stat',
  title: 'Stat',
  stories: [
    { name: 'WithIndicators', story: 'with-indicators' },
    { name: 'Sizes', story: 'sizes' },
  ],
});

test('long unbroken content wraps inside a constrained stat', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto('/iframe.html?id=display-stat--constrained-long-content&viewMode=story');

  const parent = page.getByTestId('constrained-stat-parent');
  const stat = page.getByTestId('constrained-stat');
  expect(await stat.evaluate((element) => element.scrollWidth <= element.clientWidth + 1)).toBe(
    true,
  );
  expect(await parent.evaluate((element) => element.scrollWidth <= element.clientWidth + 1)).toBe(
    true,
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1,
    ),
  ).toBe(true);
});
