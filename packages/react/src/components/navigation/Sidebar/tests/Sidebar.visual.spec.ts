import { test, expect } from '@playwright/test';
import { testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  componentId: 'navigation-sidebar',
  snapshotPrefix: 'sidebar',
  title: 'Sidebar',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'Collapsed', story: 'collapsed' },
  ],
});

test.describe('Sidebar Interaction Visual Regression', () => {
  test('Default hover state matches snapshot', async ({ page }) => {
    await page.goto('/iframe.html?id=navigation-sidebar--default&viewMode=story');
    await page.getByText('Profile').hover();
    await expect(page).toHaveScreenshot('sidebar-item-hover.png');
  });

  test('Sidebar fits a constrained parent', async ({ page }) => {
    await page.goto('/iframe.html?id=navigation-sidebar--constrained-width&viewMode=story');
    const container = page.getByLabel('Constrained sidebar container');
    const sidebar = page.getByRole('complementary');
    const group = page.getByRole('group', {
      name: 'Navigationwithanunusuallylongunbrokenlocalizedheading',
    });
    const label = page.getByText('Navigationwithanunusuallylongunbrokenlocalizedheading', {
      exact: true,
    });
    const [containerBox, sidebarBox, labelBox] = await Promise.all([
      container.boundingBox(),
      sidebar.boundingBox(),
      label.boundingBox(),
    ]);

    expect(containerBox).not.toBeNull();
    expect(sidebarBox).not.toBeNull();
    expect(labelBox).not.toBeNull();
    expect(sidebarBox!.width).toBeLessThanOrEqual(containerBox!.width + 1);
    const content = group.locator('..');
    expect(
      await content.evaluate((element) => element.scrollWidth <= element.clientWidth + 1),
    ).toBe(true);
    expect(labelBox!.x).toBeGreaterThanOrEqual(sidebarBox!.x - 1);
    expect(labelBox!.x + labelBox!.width).toBeLessThanOrEqual(
      sidebarBox!.x + sidebarBox!.width + 1,
    );
    expect(labelBox!.height).toBeGreaterThan(24);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
      ),
    ).toBe(true);
  });

  test('edge scrollable items keep their external focus rings visible', async ({ page }) => {
    await page.setViewportSize({ width: 480, height: 360 });
    await page.goto('/iframe.html?id=navigation-sidebar--scrollable-items&viewMode=story');

    for (const project of [1, 16]) {
      const item = page.getByRole('link', { name: `Project ${project}`, exact: true });
      await item.focus();
      await expect(item).toBeFocused();
      await expect(item).toHaveCSS('outline-style', 'solid');
      const itemBox = await item.boundingBox();
      expect(itemBox).not.toBeNull();
      expect(itemBox!.height).toBeGreaterThanOrEqual(24);
      const focusBox = await item.evaluate((element) => {
        const style = getComputedStyle(element);
        const clearance =
          Number.parseFloat(style.outlineWidth) + Number.parseFloat(style.outlineOffset);
        let scrollport = element.parentElement;
        while (scrollport && getComputedStyle(scrollport).overflowY !== 'auto') {
          scrollport = scrollport.parentElement;
        }
        const target = element.getBoundingClientRect();
        const viewport = scrollport?.getBoundingClientRect();
        return viewport
          ? {
              scrolls: scrollport.scrollHeight > scrollport.clientHeight,
              top: target.top - clearance - viewport.top,
              bottom: viewport.bottom - target.bottom - clearance,
            }
          : null;
      });

      expect(focusBox).not.toBeNull();
      expect(focusBox!.scrolls).toBe(true);
      expect(focusBox!.top).toBeGreaterThanOrEqual(-1);
      expect(focusBox!.bottom).toBeGreaterThanOrEqual(-1);
    }
  });
});
