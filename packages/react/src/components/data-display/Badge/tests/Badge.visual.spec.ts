import {
  testStoriesDoNotOverflowOnMobile,
  testVisualStories,
} from '@/components/e2e/visualSpecUtils';
import { expect, test } from '@playwright/test';

testVisualStories({
  accessibilityStory: 'default',
  componentId: 'display-badge',
  snapshotPrefix: 'badge',
  title: 'Badge',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'Sizes', story: 'sizes' },
    { name: 'Intents', story: 'intents' },
    { name: 'Appearances', story: 'appearances' },
    { name: 'Shapes', story: 'shapes' },
    { name: 'Placements', story: 'placements' },
    { name: 'Standalone', story: 'standalone' },
    { name: 'AsChild', story: 'as-child' },
  ],
});

testStoriesDoNotOverflowOnMobile({
  componentId: 'display-badge',
  title: 'Badge',
  stories: [{ name: 'Placements', story: 'placements' }],
});

test('applies intent and appearance compound styles', async ({ page }) => {
  await page.goto('/iframe.html?id=display-badge--appearances&viewMode=story');

  const [solid, soft, outline] = await Promise.all(
    ['Solid', 'Soft', 'Outline'].map((name) =>
      page.getByText(name, { exact: true }).evaluate((element) => {
        const style = getComputedStyle(element);
        return {
          backgroundColor: style.backgroundColor,
          borderColor: style.borderColor,
          color: style.color,
        };
      }),
    ),
  );

  expect(solid.backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
  expect(soft.backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
  expect(outline.backgroundColor).toBe('rgba(0, 0, 0, 0)');
  expect(outline.borderColor).not.toBe('rgba(0, 0, 0, 0)');
  expect(new Set([solid.color, soft.color, outline.color]).size).toBeGreaterThan(1);
});

test('keeps an asChild button focus ring above its anchored indicator', async ({ page }) => {
  await page.goto('/iframe.html?id=display-badge--as-child&viewMode=story');

  const button = page.getByRole('button', { name: 'Button' });
  const indicator = page.locator('[data-badge-indicator]');
  await button.focus();

  await expect(button).toBeFocused();
  await expect(button).toHaveCSS('outline-style', 'solid');
  await expect(indicator).toHaveCSS('z-index', 'auto');
  await expect(page).toHaveScreenshot('badge-as-child-focus.png');
});

test('standalone long content truncates inside narrow LTR and RTL parents', async ({ page }) => {
  await page.goto(
    '/iframe.html?id=display-badge--constrained-standalone-long-content&viewMode=story',
  );

  for (const name of ['Constrained standalone badge LTR', 'Constrained standalone badge RTL']) {
    const parent = page.getByLabel(name);
    const root = parent.locator('[data-standalone]').first();
    const content = parent.locator('[data-badge-standalone-content]');

    await expect(root).toBeVisible();
    expect((await root.boundingBox())!.width).toBeLessThanOrEqual(64);
    expect(await parent.evaluate((element) => element.scrollWidth <= element.clientWidth + 1)).toBe(
      true,
    );
    await expect(content).toHaveCSS('overflow', 'hidden');
    await expect(content).toHaveCSS('text-overflow', 'ellipsis');
    await expect(content).toHaveCSS('white-space', 'nowrap');
  }
});
