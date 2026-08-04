import { expect, test } from '@playwright/test';
import { testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  accessibilityStory: 'playground',
  componentId: 'display-kbd',
  snapshotPrefix: 'kbd',
  title: 'Kbd',
  stories: [{ name: 'Sizes', story: 'sizes' }],
});

test('long keyboard input supports truncation and wrapping without page overflow', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 600 });
  await page.goto('/iframe.html?id=display-kbd--constrained-long-content&viewMode=story');

  const examples = page.getByLabel('Constrained keyboard inputs');
  const truncated = examples.locator('kbd').nth(0);
  const wrapped = examples.locator('kbd').nth(1);
  const truncatedLabel = truncated.locator('[data-kbd-label]');
  const wrappedLabel = wrapped.locator('[data-kbd-label]');

  await expect(truncated).toBeVisible();
  await expect(wrapped).toBeVisible();
  expect(
    await truncatedLabel.evaluate((element) => element.scrollWidth > element.clientWidth),
  ).toBe(true);
  expect(
    await wrappedLabel.evaluate((element) => element.scrollWidth <= element.clientWidth + 1),
  ).toBe(true);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1,
    ),
  ).toBe(true);
  await expect(truncated).not.toHaveAttribute('title');
  await expect(wrapped).not.toHaveAttribute('title');
});
