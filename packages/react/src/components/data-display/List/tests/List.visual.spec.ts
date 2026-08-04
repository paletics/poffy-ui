import { expect, test } from '@playwright/test';
import { testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  accessibilityStory: 'default',
  componentId: 'display-list',
  snapshotPrefix: 'list',
  title: 'List',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'WithIcons', story: 'with-icons' },
    { name: 'AsChild', story: 'as-child' },
    { name: 'Ordered', story: 'ordered' },
  ],
});

test('ordered markers and long labels stay inside a narrow RTL list', async ({ page }) => {
  await page.goto('/iframe.html?id=display-list--constrained-rtl-long-content&viewMode=story');

  const list = page.getByLabel('قائمة ضيقة بمحتوى طويل');
  await expect(list).toBeVisible();
  expect(await list.evaluate((element) => element.scrollWidth <= element.clientWidth + 1)).toBe(
    true,
  );
  expect(
    await list.evaluate((element) =>
      Number.parseFloat(getComputedStyle(element).paddingInlineStart),
    ),
  ).toBeGreaterThan(0);
  await expect(list).toHaveCSS('direction', 'rtl');
});
