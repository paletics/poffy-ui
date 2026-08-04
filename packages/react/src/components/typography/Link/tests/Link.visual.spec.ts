import { testVisualStories } from '@/components/e2e/visualSpecUtils';
import { expect, test } from '@playwright/test';

testVisualStories({
  accessibilityStory: 'default',
  componentId: 'display-link',
  snapshotPrefix: 'link',
  title: 'Link',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'Variants', story: 'variants' },
    { name: 'Color Schemes', story: 'color-schemes' },
    { name: 'External', story: 'external' },
    { name: 'AsChild', story: 'as-child' },
  ],
});

test('applies every public color scheme', async ({ page }) => {
  await page.goto('/iframe.html?id=display-link--color-schemes&viewMode=story');

  const colors = await Promise.all(
    ['Brand link', 'Danger link', 'Success link', 'Neutral link'].map((name) =>
      page.getByRole('link', { name }).evaluate((element) => getComputedStyle(element).color),
    ),
  );

  expect(new Set(colors.slice(0, 3)).size).toBe(3);
  expect(colors[3]).toBe(
    await page
      .getByRole('link', { name: 'Neutral link' })
      .locator('..')
      .evaluate((element) => getComputedStyle(element).color),
  );
});
