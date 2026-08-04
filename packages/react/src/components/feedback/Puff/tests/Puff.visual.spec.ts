import {
  testStoriesDoNotOverflowOnMobile,
  testVisualStories,
} from '@/components/e2e/visualSpecUtils';
import { expect, test } from '@playwright/test';

testVisualStories({
  accessibilityStory: 'default',
  componentId: 'feedback-puff',
  snapshotPrefix: 'puff',
  title: 'Puff',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'Gallery', story: 'gallery' },
    { name: 'UseCases', story: 'use-cases' },
    { name: 'VisualMatrix', story: 'visual-matrix' },
    { name: 'TopLeftVisible', story: 'top-left-visible' },
    { name: 'BottomRightVisible', story: 'bottom-right-visible' },
    { name: 'NoMotionVisible', story: 'no-motion-visible' },
    { name: 'Positions', story: 'positions' },
    { name: 'TopLeft', story: 'top-left' },
  ],
});

testStoriesDoNotOverflowOnMobile({
  componentId: 'feedback-puff',
  title: 'Puff',
  stories: [{ name: 'Gallery', story: 'gallery' }],
});

test('gallery resolves its Grid auto-fit columns without overflow', async ({ page }) => {
  await page.setViewportSize({ width: 200, height: 700 });
  await page.goto('/iframe.html?id=feedback-puff--gallery&viewMode=story');

  const gallery = page.getByLabel('Puff appearance gallery');
  await expect(gallery).toBeVisible();
  const metrics = await gallery.evaluate((element) => ({
    columns: getComputedStyle(element).gridTemplateColumns,
    fits: element.scrollWidth <= element.clientWidth + 1,
  }));

  expect(metrics.columns).not.toBe('none');
  expect(metrics.fits).toBe(true);
});

for (const example of ['structured', 'simple'] as const) {
  test(`large ${example} puff fits a narrow viewport`, async ({ page }) => {
    await page.setViewportSize({ width: 200, height: 500 });
    await page.goto('/iframe.html?id=feedback-puff--narrow-viewport&viewMode=story');
    await page.getByRole('button', { name: `Show ${example} puff` }).click();

    const puff = page.getByLabel(
      example === 'simple' ? 'Simple narrow puff' : 'Structured narrow puff',
    );
    await expect(puff).toBeVisible();
    const box = await puff.boundingBox();

    expect(box).not.toBeNull();
    expect((box?.x ?? 0) + (box?.width ?? 0)).toBeLessThanOrEqual(200);
    expect(box?.x ?? 0).toBeGreaterThanOrEqual(0);
    expect(box?.y ?? 0).toBeGreaterThanOrEqual(0);
    const viewport = await puff.evaluate((element) => {
      let scrollport = element.parentElement;
      while (scrollport && getComputedStyle(scrollport).overflowY !== 'auto') {
        scrollport = scrollport.parentElement;
      }
      const rect = scrollport?.getBoundingClientRect();
      return rect
        ? {
            bottom: rect.bottom,
            clientHeight: scrollport.clientHeight,
            scrollHeight: scrollport.scrollHeight,
            top: rect.top,
          }
        : null;
    });
    expect(viewport).not.toBeNull();
    expect(viewport!.top).toBeGreaterThanOrEqual(0);
    expect(viewport!.bottom).toBeLessThanOrEqual(500);
    if (example === 'structured') {
      expect(viewport!.scrollHeight).toBeGreaterThan(viewport!.clientHeight);
    }
    await expect(page).toHaveScreenshot(`puff-narrow-${example}.png`);
  });
}

test('stacked puff actions keep complete focus rings inside both scroll viewport anchors', async ({
  page,
}) => {
  await page.setViewportSize({ width: 480, height: 360 });

  for (const story of ['scrollable-actions', 'scrollable-actions-bottom']) {
    await page.goto(`/iframe.html?id=feedback-puff--${story}&viewMode=story`);

    for (const item of [1, 12]) {
      const action = page.getByRole('button', { name: `Review item ${item}`, exact: true });
      await action.focus();
      await expect(action).toBeFocused();
      await expect(action).toHaveCSS('outline-style', 'solid');
      const focusBox = await action.evaluate((element) => {
        const style = getComputedStyle(element);
        const parseCssNumber = (value: string | undefined) => {
          const parsed = Number.parseFloat(value ?? '');
          return Number.isNaN(parsed) ? 0 : parsed;
        };
        const clearance = parseCssNumber(style.outlineWidth) + parseCssNumber(style.outlineOffset);
        let scrollport = element.parentElement;
        while (scrollport && getComputedStyle(scrollport).overflowY !== 'auto') {
          scrollport = scrollport.parentElement;
        }
        const target = element.getBoundingClientRect();
        const viewport = scrollport?.getBoundingClientRect();
        const scrollportStyle = scrollport ? getComputedStyle(scrollport) : undefined;
        return viewport
          ? {
              scrolls: scrollport.scrollHeight > scrollport.clientHeight,
              paddingInlineStart: parseCssNumber(scrollportStyle?.paddingInlineStart),
              paddingInlineEnd: parseCssNumber(scrollportStyle?.paddingInlineEnd),
              scrollPaddingInlineStart: parseCssNumber(scrollportStyle?.scrollPaddingInlineStart),
              scrollPaddingInlineEnd: parseCssNumber(scrollportStyle?.scrollPaddingInlineEnd),
              top: target.top - clearance - viewport.top,
              bottom: viewport.bottom - target.bottom - clearance,
              left: target.left - clearance - viewport.left,
              right: viewport.right - target.right - clearance,
            }
          : null;
      });

      expect(focusBox).not.toBeNull();
      expect(focusBox!.scrolls).toBe(true);
      expect(focusBox!.top).toBeGreaterThanOrEqual(-1);
      expect(focusBox!.bottom).toBeGreaterThanOrEqual(-1);
      expect(focusBox!.paddingInlineStart).toBeGreaterThanOrEqual(4);
      expect(focusBox!.paddingInlineEnd).toBeGreaterThanOrEqual(4);
      expect(focusBox!.scrollPaddingInlineStart).toBeGreaterThanOrEqual(4);
      expect(focusBox!.scrollPaddingInlineEnd).toBeGreaterThanOrEqual(4);
      expect(focusBox!.left).toBeGreaterThanOrEqual(-1);
      expect(focusBox!.right).toBeGreaterThanOrEqual(-1);
    }
  }
});
