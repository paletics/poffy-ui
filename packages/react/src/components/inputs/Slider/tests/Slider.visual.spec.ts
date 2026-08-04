import { test, expect } from '@playwright/test';
import { expectNoHorizontalOverflow, testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  componentId: 'inputs-slider',
  snapshotPrefix: 'slider',
  title: 'Slider',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'Controlled', story: 'controlled' },
  ],
});

test.describe('Slider responsive behavior', () => {
  test('constrained RTL slider keeps its target and long label contained', async ({ page }) => {
    await page.setViewportSize({ width: 240, height: 320 });
    await page.goto('/iframe.html?id=inputs-slider--constrained-long-label-rtl&viewMode=story');

    const slider = page.getByRole('slider');
    await expect(slider).toBeVisible();
    const metrics = await slider.evaluate((element) => {
      const root = element.parentElement;
      if (!root) throw new Error('Expected slider label root');
      const inputRect = element.getBoundingClientRect();
      const rootRect = root.getBoundingClientRect();
      return {
        direction: getComputedStyle(element).direction,
        inputHeight: inputRect.height,
        inputInside: inputRect.left >= rootRect.left && inputRect.right <= rootRect.right,
        rootScrollWidth: root.scrollWidth,
        rootClientWidth: root.clientWidth,
      };
    });

    expect(metrics.direction).toBe('rtl');
    expect(metrics.inputHeight).toBeGreaterThanOrEqual(24);
    expect(metrics.inputInside).toBe(true);
    expect(metrics.rootScrollWidth).toBeLessThanOrEqual(metrics.rootClientWidth);
    await expectNoHorizontalOverflow(page);
  });
});
