import { test, expect } from '@playwright/test';
import { testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  componentId: 'navigation-tabs',
  snapshotPrefix: 'tabs',
  title: 'Tabs',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'Appearances', story: 'appearances' },
    { name: 'Pop Indicator', story: 'pop-indicator' },
    { name: 'Vertical', story: 'vertical' },
  ],
});

test.describe('Tabs Interaction Visual Regression', () => {
  test('Selected tab interaction matches snapshot', async ({ page }) => {
    await page.goto('/iframe.html?id=navigation-tabs--default&viewMode=story');
    await page.getByRole('tab', { name: /tab 2/i }).click();
    await expect(page.getByText('Content 2')).toBeVisible();
    await expect(page).toHaveScreenshot('tabs-tab-2-selected.png');
  });

  test('Keyboard navigation keeps a clipped tab within the local scroll area', async ({ page }) => {
    await page.goto('/iframe.html?id=navigation-tabs--constrained-width&viewMode=story');
    const tabList = page.getByRole('tablist');
    const lastTab = page.getByRole('tab', { name: 'Integrations' });

    await page.getByRole('tab', { name: 'Overview' }).focus();
    await page.keyboard.press('End');

    await expect(lastTab).toBeFocused();
    await expect
      .poll(async () => {
        const [listBox, tabBox] = await Promise.all([tabList.boundingBox(), lastTab.boundingBox()]);
        return Boolean(
          listBox &&
          tabBox &&
          tabBox.x >= listBox.x &&
          tabBox.x + tabBox.width <= listBox.x + listBox.width + 1,
        );
      })
      .toBe(true);
    await expect(page).toHaveScreenshot('tabs-constrained-last-tab-focus.png');
  });

  test('Vertical tabs wrap a long RTL label inside a constrained parent', async ({ page }) => {
    await page.goto(
      '/iframe.html?id=navigation-tabs--vertical-constrained-long-label&viewMode=story',
    );

    const container = page.getByLabel('Constrained vertical tabs example');
    const tabList = page.getByRole('tablist', { name: 'Constrained vertical tabs' });
    const firstTab = page.getByRole('tab', {
      name: 'Overviewwithanunusuallylongunbrokenlocalizedlabel',
    });
    const lastTab = page.getByRole('tab', { name: 'Settings' });
    const selectedPanel = page.getByRole('tabpanel', {
      name: 'Overviewwithanunusuallylongunbrokenlocalizedlabel',
    });

    await firstTab.focus();
    await page.keyboard.press('End');
    await expect(lastTab).toBeFocused();

    const [containerBox, listBox, firstBox, lastBox, panelBox] = await Promise.all([
      container.boundingBox(),
      tabList.boundingBox(),
      firstTab.boundingBox(),
      lastTab.boundingBox(),
      selectedPanel.boundingBox(),
    ]);
    expect(containerBox).not.toBeNull();
    expect(listBox).not.toBeNull();
    expect(firstBox).not.toBeNull();
    expect(lastBox).not.toBeNull();
    expect(panelBox).not.toBeNull();
    expect(listBox!.x).toBeGreaterThanOrEqual(containerBox!.x - 1);
    expect(listBox!.x + listBox!.width).toBeLessThanOrEqual(
      containerBox!.x + containerBox!.width + 1,
    );
    expect(firstBox!.x).toBeGreaterThanOrEqual(listBox!.x - 1);
    expect(firstBox!.x + firstBox!.width).toBeLessThanOrEqual(listBox!.x + listBox!.width + 1);
    expect(firstBox!.height).toBeGreaterThanOrEqual(24);
    expect(lastBox!.height).toBeGreaterThanOrEqual(24);
    expect(listBox!.width).toBeLessThanOrEqual(containerBox!.width / 2 + 1);
    expect(panelBox!.width).toBeGreaterThanOrEqual(24);
    expect(panelBox!.x).toBeGreaterThanOrEqual(containerBox!.x - 1);
    expect(panelBox!.x + panelBox!.width).toBeLessThanOrEqual(
      containerBox!.x + containerBox!.width + 1,
    );
    await expect(selectedPanel).toContainText('Overview content');
    await expect(tabList).toHaveCSS('direction', 'rtl');
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
      ),
    ).toBe(true);
  });

  test('Vertical line and enclosed tabs join at the logical inline edge', async ({ page }) => {
    await page.goto('/iframe.html?id=navigation-tabs--vertical&viewMode=story');

    const tabLists = page.getByRole('tablist');
    const lineList = tabLists.nth(0);
    const lineSelectedTab = page.getByRole('tab', { name: 'Overview' }).nth(0);
    const lineIndicator = lineSelectedTab.locator('[aria-hidden="true"]');
    const lineGeometry = await Promise.all([
      lineList.boundingBox(),
      lineIndicator.boundingBox(),
      lineList.evaluate((node) => {
        const styles = getComputedStyle(node);
        return {
          borderBlockEndWidth: styles.borderBlockEndWidth,
          borderInlineEndWidth: styles.borderInlineEndWidth,
        };
      }),
    ]);
    const [lineListBox, lineIndicatorBox, lineBorders] = lineGeometry;
    expect(lineListBox).not.toBeNull();
    expect(lineIndicatorBox).not.toBeNull();
    expect(lineBorders).toEqual({ borderBlockEndWidth: '0px', borderInlineEndWidth: '1px' });
    expect(lineIndicatorBox!.width).toBeCloseTo(2, 0);
    expect(
      Math.abs(lineIndicatorBox!.x + lineIndicatorBox!.width - lineListBox!.x - lineListBox!.width),
    ).toBeLessThanOrEqual(1);

    const enclosedSelectedTab = page.getByRole('tab', { name: 'Overview' }).nth(1);
    const enclosedBorders = await enclosedSelectedTab.evaluate((node) => {
      const styles = getComputedStyle(node);
      return {
        backgroundColor: styles.backgroundColor,
        borderBlockEndColor: styles.borderBlockEndColor,
        borderInlineEndColor: styles.borderInlineEndColor,
        borderInlineEndWidth: styles.borderInlineEndWidth,
      };
    });
    expect(enclosedBorders.borderInlineEndWidth).toBe('1px');
    expect(enclosedBorders.borderInlineEndColor).toBe(enclosedBorders.backgroundColor);
    expect(enclosedBorders.borderBlockEndColor).not.toBe(enclosedBorders.backgroundColor);
  });
});
