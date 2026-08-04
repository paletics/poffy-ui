import {
  testStoriesDoNotOverflowOnMobile,
  testVisualStories,
} from '@/components/e2e/visualSpecUtils';
import { expect, test } from '@playwright/test';

testVisualStories({
  accessibilityStory: 'basic',
  componentId: 'display-reference',
  snapshotPrefix: 'reference',
  title: 'Reference',
  stories: [
    { name: 'Basic', story: 'basic' },
    { name: 'WithDescription', story: 'with-description' },
    { name: 'List', story: 'list' },
    { name: 'ConstrainedLongContent', story: 'constrained-long-content' },
  ],
});

testStoriesDoNotOverflowOnMobile({
  componentId: 'display-reference',
  title: 'Reference',
  stories: [
    { name: 'ConstrainedLongContent', story: 'constrained-long-content' },
    { name: 'WrappedLongContent', story: 'wrapped-long-content' },
  ],
});

test('wrapped reference stays within its constrained container', async ({ page }) => {
  await page.goto('/iframe.html?id=display-reference--wrapped-long-content&viewMode=story');

  const reference = page.getByRole('link', {
    name: /A deliberately long reference label/,
  });
  await expect(reference).toBeVisible();
  expect(
    await reference.evaluate((element) => element.scrollWidth <= element.clientWidth + 1),
  ).toBe(true);
  await expect(reference).not.toHaveAttribute('title');
});
