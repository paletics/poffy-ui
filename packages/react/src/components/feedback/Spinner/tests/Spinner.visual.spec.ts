import {
  testStoriesDoNotOverflowOnMobile,
  testVisualStories,
} from '@/components/e2e/visualSpecUtils';
import { expect, test } from '@playwright/test';

testVisualStories({
  accessibilityStory: 'default',
  componentId: 'feedback-spinner',
  snapshotPrefix: 'spinner',
  title: 'Spinner',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'NoAnimation', story: 'no-animation' },
    { name: 'Dash', story: 'dash' },
    { name: 'Sizes', story: 'sizes' },
    { name: 'Intents', story: 'intents' },
    { name: 'CSSAnimations', story: 'css-animations' },
    {
      name: 'MotionAnimations',
      story: 'motion-animations',
      screenshotOptions: { animations: 'disabled' },
    },
    { name: 'SilverRatio', story: 'silver-ratio', screenshotOptions: { animations: 'disabled' } },
    { name: 'MotionDisabled', story: 'motion-disabled' },
  ],
});

test('dash renders a partial arc and motion alternatives mount their layers', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/iframe.html?id=feedback-spinner--dash&viewMode=story');
  const dashIndicator = page.getByTestId('dash-spinner').locator('circle').nth(1);
  await expect(dashIndicator).toBeVisible();

  await expect.poll(() => dashIndicator.getAttribute('stroke-dasharray')).not.toBeNull();
  const dashArray = await dashIndicator.getAttribute('stroke-dasharray');
  const dashValues = dashArray?.match(/[\d.]+/g)?.map(Number) ?? [];
  expect(dashValues).toHaveLength(2);
  expect(dashValues[0]).not.toBe(dashValues[1]);

  await page.goto('/iframe.html?id=feedback-spinner--motion-animations&viewMode=story');
  await expect
    .poll(() =>
      page
        .locator('#storybook-root svg')
        .evaluateAll((svgs) => svgs.map((svg) => svg.querySelectorAll('circle').length)),
    )
    .toEqual([4, 2, 3, 4]);
});

test('all animation modes fit their containing block without changing SVG geometry', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/iframe.html?id=feedback-spinner--preferred-maximum&viewMode=story');

  const cells = page.getByTestId('spinner-constrained-cell');
  const spinners = page.getByRole('status');
  await expect(cells).toHaveCount(10);
  await expect(spinners).toHaveCount(11);

  await expect(spinners.first().locator('svg')).toHaveAttribute('width', '300');
  await expect(spinners.first().locator('svg')).toHaveAttribute('height', '300');
  await expect(spinners.first().locator('svg')).toHaveAttribute('viewBox', '0 0 300 300');

  const constrainedMeasurements = await cells.evaluateAll((elements) =>
    elements.map((cell) => {
      const spinner = cell.querySelector('[role="status"]');
      const svg = spinner?.querySelector('svg');
      if (!spinner || !svg) throw new Error('Expected constrained spinner markup');
      const spinnerRect = spinner.getBoundingClientRect();
      const svgRect = svg.getBoundingClientRect();
      return {
        cellClientWidth: cell.clientWidth,
        cellScrollWidth: cell.scrollWidth,
        spinnerHeight: spinnerRect.height,
        spinnerWidth: spinnerRect.width,
        svgHeight: svgRect.height,
        svgWidth: svgRect.width,
      };
    }),
  );

  expect(constrainedMeasurements).toEqual(
    Array.from({ length: 10 }, () => ({
      cellClientWidth: 160,
      cellScrollWidth: 160,
      spinnerHeight: 160,
      spinnerWidth: 160,
      svgHeight: 160,
      svgWidth: 160,
    })),
  );

  const wideSpinner = spinners.last();
  expect(await wideSpinner.evaluate((element) => element.getBoundingClientRect().width)).toBe(300);
});

testStoriesDoNotOverflowOnMobile({
  componentId: 'feedback-spinner',
  title: 'Spinner',
  stories: [
    { name: 'CSSAnimations', story: 'css-animations' },
    { name: 'MotionAnimations', story: 'motion-animations' },
    { name: 'PreferredMaximum', story: 'preferred-maximum' },
    { name: 'SilverRatio', story: 'silver-ratio' },
  ],
});
