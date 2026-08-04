import { testVisualStories } from '@/components/e2e/visualSpecUtils';
import { expect, test } from '@playwright/test';

testVisualStories({
  accessibilityStory: 'default',
  componentId: 'display-text',
  snapshotPrefix: 'text',
  title: 'Text',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'Variants', story: 'variants' },
    { name: 'AsChild', story: 'as-child' },
    { name: 'Weights', story: 'weights' },
    { name: 'Alignments', story: 'alignments' },
  ],
});

test('RTL defaults to logical start while logical and physical alignments remain distinct', async ({
  page,
}) => {
  await page.goto(
    '/iframe.html?id=display-text--rtl-logical-and-physical-alignments&viewMode=story',
  );

  for (const [testId, expected] of [
    ['rtl-default', 'start'],
    ['rtl-start', 'start'],
    ['rtl-end', 'end'],
    ['rtl-left', 'left'],
    ['rtl-right', 'right'],
  ] as const) {
    const text = page.getByTestId(testId);
    await expect(text).toHaveCSS('direction', 'rtl');
    await expect(text).toHaveCSS('text-align', expected);
  }
});
