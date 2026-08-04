import {
  expectNoHorizontalOverflow,
  testStoriesDoNotOverflowOnMobile,
  testVisualStories,
} from '@/components/e2e/visualSpecUtils';
import { expect, test } from '@playwright/test';

const stories = [
  { name: 'Unified', story: 'unified' },
  { name: 'Split', story: 'split' },
  { name: 'CaptionDisclosure', story: 'caption-disclosure' },
];

testVisualStories({
  accessibilityStory: 'unified',
  componentId: 'display-diffviewer',
  snapshotPrefix: 'diff-viewer',
  title: 'DiffViewer',
  stories,
});

testStoriesDoNotOverflowOnMobile({
  componentId: 'display-diffviewer',
  title: 'DiffViewer',
  stories: [{ name: 'Default', story: 'default' }, ...stories],
});

test('scrolls a focused split diff horizontally with the keyboard', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 400 });
  await page.goto('/iframe.html?id=display-diffviewer--split&viewMode=story');

  const diff = page.getByRole('table');
  await expect(diff).toBeVisible();
  expect(await diff.evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(true);

  await diff.focus();
  await expect(diff).toBeFocused();
  await page.keyboard.press('ArrowRight');
  await expect.poll(() => diff.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);
  await expect(page).toHaveScreenshot('diff-viewer-split-keyboard-scroll.png');
});

test('a long caption respects a 160px parent while the preformatted body remains scrollable', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1000, height: 500 });
  await page.goto('/iframe.html?id=display-diffviewer--constrained-long-caption&viewMode=story');

  const parent = page.getByTestId('constrained-caption-diff');
  const diff = page.getByRole('table', { name: 'Constrained caption diff' });
  const caption = parent.locator('figcaption');
  const [parentBox, captionBox] = await Promise.all([parent.boundingBox(), caption.boundingBox()]);

  expect(parentBox).not.toBeNull();
  expect(captionBox).not.toBeNull();
  expect(captionBox!.width).toBeLessThanOrEqual(parentBox!.width + 1);
  expect(await caption.evaluate((element) => element.scrollWidth <= element.clientWidth + 1)).toBe(
    true,
  );
  expect(await diff.evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(true);
});

test('caption disclosure keeps the diff name stable and reflows enlarged text', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto('/iframe.html?id=display-diffviewer--caption-disclosure&viewMode=story');
  await page.locator('html').evaluate((element) => {
    element.style.fontSize = '200%';
  });

  const parent = page.getByTestId('caption-disclosure-diff');
  const diff = page.getByRole('table', { name: 'Configuration change' });
  const summary = page.locator('summary');
  const details = page.locator('details');

  await expect(details).not.toHaveAttribute('open');
  await summary.focus();
  await summary.press('Enter');
  await expect(details).toHaveAttribute('open');
  await expect(diff).toHaveAccessibleName('Configuration change');
  await expect(page.getByText(/Generated files are excluded/)).toBeVisible();
  await expectNoHorizontalOverflow(page);

  const geometry = await parent.evaluate((element) => {
    const disclosure = element.querySelector('details');
    return {
      clientWidth: element.clientWidth,
      disclosureScrollWidth: disclosure?.scrollWidth ?? 0,
      disclosureWidth: disclosure?.clientWidth ?? 0,
      scrollWidth: element.scrollWidth,
    };
  });
  expect(geometry.scrollWidth).toBeLessThanOrEqual(geometry.clientWidth + 1);
  expect(geometry.disclosureScrollWidth).toBeLessThanOrEqual(geometry.disclosureWidth + 1);
});

test('caption disclosure retains a visible keyboard affordance in forced colors', async ({
  page,
}) => {
  await page.emulateMedia({ forcedColors: 'active', reducedMotion: 'reduce' });
  await page.goto('/iframe.html?id=display-diffviewer--caption-disclosure&viewMode=story');

  const summary = page.locator('summary');
  await summary.focus();
  await expect(summary).toBeFocused();
  await expect(summary).not.toHaveCSS('outline-style', 'none');
  await summary.press('Space');
  await expect(page.locator('details')).toHaveAttribute('open');
  await expect(page.getByRole('table')).toHaveAccessibleName('Configuration change');
});
