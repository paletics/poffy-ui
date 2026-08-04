import { testVisualStories } from '@/components/e2e/visualSpecUtils';
import { expect, test } from '@playwright/test';

testVisualStories({
  accessibilityStory: 'default',
  componentId: 'display-tag',
  snapshotPrefix: 'tag',
  title: 'Tag',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'Sizes', story: 'sizes' },
    { name: 'Appearances', story: 'appearances' },
    { name: 'WithCloseButton', story: 'with-close-button' },
  ],
});

test('a long dismissible tag stays within a narrow parent', async ({ page }) => {
  await page.goto('/iframe.html?id=display-tag--constrained-long-label&viewMode=story');

  const parent = page.getByLabel('Constrained tag');
  const close = page.getByRole('button', { name: 'Remove filter' });
  await expect(close).toBeVisible();
  expect(await parent.evaluate((node) => node.scrollWidth <= node.clientWidth + 1)).toBe(true);
  expect((await close.boundingBox())?.width).toBeGreaterThan(0);
});

test('dismissible size boundaries preserve containment and 24px close targets', async ({
  page,
}) => {
  await page.goto('/iframe.html?id=display-tag--constrained-dismissible-sizes&viewMode=story');

  const cases = [
    { name: 'Small constrained tag', width: 48, close: 'Remove small tag' },
    { name: 'Medium constrained tag', width: 64, close: 'Remove medium tag' },
    { name: 'Large constrained tag', width: 80, close: 'Remove large tag' },
    { name: 'Medium constrained tag RTL', width: 64, close: 'Remove RTL tag' },
  ];

  for (const testCase of cases) {
    const parent = page.getByLabel(testCase.name, { exact: true });
    const root = parent.locator('.poffy-tag__root');
    const close = page.getByRole('button', { name: testCase.close });

    await expect(root).toBeVisible();
    expect((await root.boundingBox())!.width).toBeLessThanOrEqual(testCase.width);
    expect(await parent.evaluate((element) => element.scrollWidth <= element.clientWidth + 1)).toBe(
      true,
    );
    expect((await close.boundingBox())!.width).toBeGreaterThanOrEqual(24);
    expect((await close.boundingBox())!.height).toBeGreaterThanOrEqual(24);
  }

  await expect(page.getByLabel('Medium constrained tag RTL', { exact: true })).toHaveCSS(
    'direction',
    'rtl',
  );
});
