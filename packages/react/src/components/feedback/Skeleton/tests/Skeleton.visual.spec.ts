import {
  testStoriesDoNotOverflowOnMobile,
  testVisualStories,
} from '@/components/e2e/visualSpecUtils';
import { expect, test } from '@playwright/test';

testVisualStories({
  accessibilityStory: 'default',
  componentId: 'feedback-skeleton',
  snapshotPrefix: 'skeleton',
  title: 'Skeleton',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'Circle', story: 'circle' },
    { name: 'RectNoAnimation', story: 'rect-no-animation' },
    { name: 'Shimmer', story: 'shimmer', screenshotOptions: { animations: 'disabled' } },
    { name: 'DefaultDimensions', story: 'default-dimensions' },
    { name: 'MotionDisabled', story: 'motion-disabled' },
    { name: 'ArticleLoading', story: 'article-loading' },
    { name: 'Intents', story: 'intents' },
  ],
});

testStoriesDoNotOverflowOnMobile({
  componentId: 'feedback-skeleton',
  title: 'Skeleton',
  stories: [
    { name: 'ArticleLoading', story: 'article-loading' },
    { name: 'DefaultDimensions', story: 'default-dimensions' },
  ],
});

test('default text skeleton paints a visible loading surface', async ({ page }) => {
  await page.goto('/iframe.html?id=feedback-skeleton--default&viewMode=story');
  const skeleton = page.locator('#storybook-root [aria-hidden="true"]').first();
  await expect(skeleton).toBeVisible();

  const surface = await skeleton.evaluate((element) => {
    const { height, width } = element.getBoundingClientRect();
    const style = window.getComputedStyle(element);
    const pageBackground = window.getComputedStyle(document.body).backgroundColor;
    const parseColor = (color: string) => color.match(/\d+(?:\.\d+)?/g)?.map(Number) ?? [];
    const colorDistance = parseColor(style.backgroundColor).reduce(
      (total, channel, index) =>
        total + Math.abs(channel - (parseColor(pageBackground)[index] ?? 0)),
      0,
    );
    return {
      backgroundColor: style.backgroundColor,
      colorDistance,
      height,
      opacity: Number(style.opacity),
      width,
    };
  });

  expect(surface.width).toBeGreaterThan(0);
  expect(surface.height).toBeGreaterThan(0);
  expect(surface.opacity).toBeGreaterThan(0);
  expect(surface.backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
  expect(surface.colorDistance).toBeGreaterThan(12);
  await expect(skeleton).toHaveScreenshot('skeleton-default-surface.png', {
    animations: 'disabled',
  });
});

test('shimmer and motion-disabled text surfaces remain visible', async ({ page }) => {
  await page.goto('/iframe.html?id=feedback-skeleton--shimmer&viewMode=story');
  await expect(page.getByTestId('shimmer-skeleton')).toHaveScreenshot(
    'skeleton-shimmer-surface.png',
    {
      animations: 'disabled',
    },
  );

  await page.goto('/iframe.html?id=feedback-skeleton--motion-disabled&viewMode=story');
  await expect(page.getByTestId('motion-disabled-skeletons')).toHaveScreenshot(
    'skeleton-motion-disabled-surfaces.png',
  );
});

test('circle stays square when its requested width exceeds its parent', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto('/iframe.html?id=feedback-skeleton--constrained-circle&viewMode=story');

  const parent = page.getByTestId('constrained-circle-parent');
  const skeleton = page.getByTestId('constrained-circle');
  const dimensions = await skeleton.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    return { height: rect.height, width: rect.width };
  });

  expect(dimensions.height).toBe(dimensions.width);
  expect(dimensions.width).toBeLessThanOrEqual(
    await parent.evaluate((element) => element.clientWidth),
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1,
    ),
  ).toBe(true);
});
