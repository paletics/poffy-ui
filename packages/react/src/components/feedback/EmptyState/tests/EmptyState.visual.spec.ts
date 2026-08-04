import { testVisualStories } from '@/components/e2e/visualSpecUtils';
import { expect, test } from '@playwright/test';

testVisualStories({
  accessibilityStory: 'default',
  componentId: 'feedback-emptystate',
  snapshotPrefix: 'empty-state',
  title: 'EmptyState',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'Sizes', story: 'sizes' },
    { name: 'Appearances', story: 'appearances' },
    { name: 'WithActions', story: 'with-actions' },
    { name: 'NoIcon', story: 'no-icon' },
    { name: 'ConstrainedLongContent', story: 'constrained-long-content' },
  ],
});

test('long empty-state content and actions stay within a narrow parent', async ({ page }) => {
  await page.goto('/iframe.html?id=feedback-emptystate--constrained-long-content&viewMode=story');

  const parent = page.getByLabel('Constrained empty state');
  await expect(parent).toBeVisible();
  expect(await parent.evaluate((node) => node.scrollWidth <= node.clientWidth + 1)).toBe(true);

  const actions = parent.getByRole('button');
  await expect(actions).toHaveCount(2);
  const [first, second] = await actions.evaluateAll((nodes) =>
    nodes.map((node) => node.getBoundingClientRect().top),
  );
  expect(second).toBeGreaterThan(first ?? 0);
});
