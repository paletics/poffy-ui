import { expect, test } from '@playwright/test';
import { testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  componentId: 'display-markdownviewer',
  snapshotPrefix: 'markdown-viewer',
  title: 'MarkdownViewer',
  stories: [{ name: 'Default', story: 'default' }],
});

test('long prose and a logical blockquote stay inside a narrow RTL viewer', async ({ page }) => {
  await page.goto(
    '/iframe.html?id=display-markdownviewer--constrained-rtl-long-content&viewMode=story',
  );

  const viewer = page.getByLabel('مستند ماركداون ضيق');
  const quote = page.getByRole('blockquote');
  await expect(viewer).toBeVisible();
  expect(await viewer.evaluate((element) => element.scrollWidth <= element.clientWidth + 1)).toBe(
    true,
  );
  await expect(viewer).toHaveCSS('direction', 'rtl');
  expect(
    await quote.evaluate((element) =>
      Number.parseFloat(getComputedStyle(element).borderRightWidth),
    ),
  ).toBeGreaterThan(0);

  const codeRegion = page.getByRole('region', { name: 'TEXT block 1' });
  expect(
    await codeRegion.evaluate((element) => element.scrollWidth <= element.clientWidth + 1),
  ).toBe(true);
  await expect(codeRegion.locator('code')).toHaveCSS('white-space', 'pre-wrap');
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1,
    ),
  ).toBe(true);
});
