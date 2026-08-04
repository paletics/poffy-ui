import { testVisualStories } from '@/components/e2e/visualSpecUtils';
import { expect, test } from '@playwright/test';

testVisualStories({
  componentId: 'surfaces-collapsible',
  snapshotPrefix: 'collapsible',
  title: 'Collapsible',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'Open', story: 'open' },
    { name: 'Appearances', story: 'appearances' },
    { name: 'States', story: 'states' },
    { name: 'FocusableContent', story: 'focusable-content' },
  ],
});

test('Collapsible trigger keeps its focus ring inside the clipped surface', async ({ page }) => {
  await page.goto('/iframe.html?id=surfaces-collapsible--default&viewMode=story');
  const trigger = page.getByRole('button').first();
  await trigger.focus();
  await expect(trigger).toBeFocused();
  await expect(page).toHaveScreenshot('collapsible-focus.png');
});

test('expanded content exposes focus rings after the height transition', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/iframe.html?id=surfaces-collapsible--focusable-content&viewMode=story');

  for (const appearance of ['soft', 'outline', 'ghost']) {
    const root = page.getByTestId(`focus-collapsible-${appearance}`);
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
      expect(rootBox!.x + rootBox!.width - (linkBox!.x + linkBox!.width)).toBeGreaterThanOrEqual(4);
      expect(linkBox!.y - regionBox!.y).toBeGreaterThanOrEqual(4);
      expect(
        regionBox!.y + regionBox!.height - (linkBox!.y + linkBox!.height),
      ).toBeGreaterThanOrEqual(4);
    }
  }
});
