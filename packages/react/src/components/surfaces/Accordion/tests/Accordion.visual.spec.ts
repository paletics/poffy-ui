import { test, expect } from '@playwright/test';
import { testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  componentId: 'display-accordion',
  snapshotPrefix: 'accordion',
  title: 'Accordion',
  stories: [
    { name: 'Default Closed', story: 'default' },
    { name: 'Outlined', story: 'outlined' },
    { name: 'With Disabled', story: 'with-disabled' },
    { name: 'Constrained Width', story: 'constrained-width' },
    { name: 'Focusable Content', story: 'focusable-content' },
  ],
});

test.describe('Accordion Interaction Visual Regression', () => {
  test('Default open render matches snapshot', async ({ page }) => {
    await page.goto('/iframe.html?id=display-accordion--default&viewMode=story');
    await page.getByRole('button', { name: /is it accessible/i }).click();
    await expect(page.getByText(/wai-aria design pattern/i)).toBeVisible();
    await expect(page).toHaveScreenshot('accordion-default-open.png');
  });

  test('Outlined trigger keeps its focus ring inside the clipped surface', async ({ page }) => {
    await page.goto('/iframe.html?id=display-accordion--outlined&viewMode=story');
    const trigger = page.getByRole('button').first();
    await trigger.focus();
    await expect(trigger).toBeFocused();
    await expect(page).toHaveScreenshot('accordion-outlined-focus.png');
  });

  test('expanded content exposes focus rings after the height transition', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/iframe.html?id=display-accordion--focusable-content&viewMode=story');

    for (const appearance of ['soft', 'outline', 'ghost']) {
      const root = page.getByTestId(`focus-accordion-${appearance}`);
      const link = root.getByRole('link', { name: `Focusable ${appearance} destination` });
      const region = root.getByRole('region');
      await expect
        .poll(() => region.evaluate((element) => getComputedStyle(element).overflow))
        .toBe('visible');
      await link.focus();
      await expect(link).toBeFocused();
      await expect(link).toHaveCSS('outline-style', 'solid');

      if (appearance !== 'ghost') {
        const [rootBox, regionBox, linkBox] = await Promise.all([
          root.boundingBox(),
          region.boundingBox(),
          link.boundingBox(),
        ]);
        expect(rootBox).not.toBeNull();
        expect(regionBox).not.toBeNull();
        expect(linkBox).not.toBeNull();
        expect(linkBox!.x - rootBox!.x).toBeGreaterThanOrEqual(4);
        expect(rootBox!.x + rootBox!.width - (linkBox!.x + linkBox!.width)).toBeGreaterThanOrEqual(
          4,
        );
        expect(linkBox!.y - regionBox!.y).toBeGreaterThanOrEqual(4);
        expect(
          regionBox!.y + regionBox!.height - (linkBox!.y + linkBox!.height),
        ).toBeGreaterThanOrEqual(4);
      }
    }
  });
});
