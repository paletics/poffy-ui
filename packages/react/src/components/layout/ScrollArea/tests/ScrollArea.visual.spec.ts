import { testVisualStories } from '@/components/e2e/visualSpecUtils';
import { expect, test } from '@playwright/test';

testVisualStories({
  accessibilityStory: 'default',
  componentId: 'layout-scrollarea',
  snapshotPrefix: 'scroll-area',
  title: 'ScrollArea',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'Horizontal', story: 'horizontal' },
    { name: 'Both', story: 'both' },
    { name: 'SmallScrollbar', story: 'small-scrollbar' },
    { name: 'LargeScrollbar', story: 'large-scrollbar' },
    { name: 'EdgeAligned', story: 'edge-aligned' },
  ],
});

test('size variants produce distinct thumb widths', async ({ page }) => {
  const widths: number[] = [];
  for (const story of ['small-scrollbar', 'default', 'large-scrollbar']) {
    await page.goto(`/iframe.html?id=layout-scrollarea--${story}&viewMode=story`);
    const thumb = page.locator('[data-orientation="vertical"][aria-hidden="true"] > div');
    await expect(thumb).toBeAttached();
    widths.push(await thumb.evaluate((element) => element.getBoundingClientRect().width));
  }

  expect(widths).toEqual([4, 6, 10]);
});

test('a hidden non-overflowing track does not block content interaction', async ({ page }) => {
  await page.goto('/iframe.html?id=layout-scrollarea--no-overflow-interaction&viewMode=story');

  const button = page.getByRole('button', { name: 'Right edge action' });
  const box = await button.boundingBox();
  expect(box).not.toBeNull();
  const targetIsButton = await page.evaluate(
    ({ x, y }) => document.elementFromPoint(x, y)?.closest('button')?.textContent,
    { x: box!.x + box!.width - 2, y: box!.y + box!.height / 2 },
  );

  expect(targetIsButton).toContain('Right edge action');
});

test('the overflowing viewport keeps its focus ring inside the clipped root', async ({ page }) => {
  await page.goto('/iframe.html?id=layout-scrollarea--default&viewMode=story');
  const viewport = page.getByRole('region', { name: 'Scrollable items' });
  await viewport.focus();
  await expect(viewport).toBeFocused();
  await expect(page).toHaveScreenshot('scroll-area-focus.png');
});

test('an overflowing track exposes only the expanded thumb hit target', async ({ page }) => {
  await page.goto('/iframe.html?id=layout-scrollarea--default&viewMode=story');

  const track = page.locator('[data-orientation="vertical"][aria-hidden="true"]');
  const hitTargets = await track.evaluate((element) => {
    const thumb = element.firstElementChild;
    if (!(thumb instanceof HTMLElement)) throw new Error('Expected a scrollbar thumb');
    const trackBox = element.getBoundingClientRect();
    const thumbBox = thumb.getBoundingClientRect();
    const crossAxisEdge = trackBox.left + 2;
    const thumbTarget = document.elementFromPoint(
      crossAxisEdge,
      thumbBox.top + thumbBox.height / 2,
    );
    const trackOnlyTarget = document.elementFromPoint(
      crossAxisEdge,
      Math.min(trackBox.bottom - 2, thumbBox.bottom + 30),
    );
    return {
      thumb: thumbTarget === thumb ? true : thumb.contains(thumbTarget),
      track: trackOnlyTarget === element,
    };
  });

  expect(hitTargets).toEqual({ thumb: true, track: false });
});

test('thumbs align to logical edges while their hit targets expand inward', async ({ page }) => {
  await page.goto('/iframe.html?id=layout-scrollarea--edge-aligned&viewMode=story');

  for (const { testId, edge } of [
    { testId: 'edge-scroll-ltr', edge: 'right' },
    { testId: 'edge-scroll-rtl', edge: 'left' },
  ] as const) {
    const root = page.getByTestId(testId);
    const track = root.locator('[data-orientation="vertical"][aria-hidden="true"]');
    const thumb = track.locator(':scope > div');
    await expect(track).toHaveAttribute('data-visible', '');

    const result = await root.evaluate((element, expectedEdge) => {
      const trackElement = element.querySelector<HTMLElement>(
        '[data-orientation="vertical"][aria-hidden="true"]',
      );
      const thumbElement = trackElement?.firstElementChild;
      if (!(trackElement instanceof HTMLElement) || !(thumbElement instanceof HTMLElement)) {
        throw new Error('Expected a vertical scrollbar and thumb');
      }
      const rootBox = element.getBoundingClientRect();
      const trackBox = trackElement.getBoundingClientRect();
      const thumbBox = thumbElement.getBoundingClientRect();
      const y = thumbBox.top + thumbBox.height / 2;
      const visualEdgeX = expectedEdge === 'right' ? rootBox.right - 1 : rootBox.left + 1;
      const inwardX = expectedEdge === 'right' ? trackBox.left + 1 : trackBox.right - 1;
      return {
        aligned:
          expectedEdge === 'right'
            ? Math.abs(thumbBox.right - rootBox.right)
            : Math.abs(thumbBox.left - rootBox.left),
        inwardHit: document.elementFromPoint(inwardX, y) === thumbElement,
        visualHit: document.elementFromPoint(visualEdgeX, y) === thumbElement,
      };
    }, edge);

    expect(result.aligned).toBeLessThanOrEqual(1);
    expect(result.inwardHit).toBe(true);
    expect(result.visualHit).toBe(true);
    await expect(thumb).toBeVisible();
  }

  const horizontalRoot = page.getByTestId('edge-scroll-horizontal');
  const horizontalThumb = horizontalRoot.locator(
    '[data-orientation="horizontal"][aria-hidden="true"] > div',
  );
  const [rootBox, thumbBox] = await Promise.all([
    horizontalRoot.boundingBox(),
    horizontalThumb.boundingBox(),
  ]);
  expect(rootBox).not.toBeNull();
  expect(thumbBox).not.toBeNull();
  expect(
    Math.abs(thumbBox!.y + thumbBox!.height - (rootBox!.y + rootBox!.height)),
  ).toBeLessThanOrEqual(1);

  const rtlHorizontalRoot = page.getByTestId('edge-scroll-horizontal-rtl');
  const rtlHorizontalTrack = rtlHorizontalRoot.locator(
    '[data-orientation="horizontal"][aria-hidden="true"]',
  );
  const rtlHorizontalThumb = rtlHorizontalTrack.locator(':scope > div');
  await expect(rtlHorizontalTrack).toHaveCSS('direction', 'ltr');
  const initialThumbBox = await rtlHorizontalThumb.boundingBox();
  expect(initialThumbBox).not.toBeNull();
  const trackBox = await rtlHorizontalTrack.boundingBox();
  expect(trackBox).not.toBeNull();
  expect(initialThumbBox!.x).toBeGreaterThanOrEqual(trackBox!.x - 1);
  expect(initialThumbBox!.x + initialThumbBox!.width).toBeLessThanOrEqual(
    trackBox!.x + trackBox!.width + 1,
  );

  await rtlHorizontalRoot.getByRole('region').evaluate((element) => {
    element.scrollLeft = -element.scrollWidth;
    element.dispatchEvent(new Event('scroll'));
  });
  await expect
    .poll(async () => (await rtlHorizontalThumb.boundingBox())?.x)
    .not.toBe(initialThumbBox!.x);
  const scrolledThumbBox = await rtlHorizontalThumb.boundingBox();
  expect(scrolledThumbBox).not.toBeNull();
  expect(scrolledThumbBox!.x).toBeGreaterThanOrEqual(trackBox!.x - 1);
  expect(scrolledThumbBox!.x + scrolledThumbBox!.width).toBeLessThanOrEqual(
    trackBox!.x + trackBox!.width + 1,
  );
});
