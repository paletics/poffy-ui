import AxeBuilder from '@axe-core/playwright';
import { test, expect } from '@playwright/test';

test.describe('TreeView Visual Regression & A11y', () => {
  test('Auto Construction - Default render matches snapshot', async ({ page }) => {
    await page.goto('/iframe.html?id=display-treeview--default&viewMode=story');
    await expect(page.getByRole('tree')).toBeVisible();
    await expect(page).toHaveScreenshot('tree-view-auto-default.png');
  });

  test('Auto Construction - Expanded state matches snapshot', async ({ page }) => {
    await page.goto('/iframe.html?id=display-treeview--default&viewMode=story');
    const trigger = page.getByRole('button', { name: /public/i });
    await trigger.waitFor({ state: 'visible' });

    await trigger.hover();
    await expect(page).toHaveScreenshot('tree-view-auto-hover.png');

    await trigger.click();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(page).toHaveScreenshot('tree-view-auto-expanded.png');
  });

  test('Nested tree items keep their focus ring inside the collapsing content', async ({
    page,
  }) => {
    await page.goto('/iframe.html?id=display-treeview--default&viewMode=story');
    const nestedItem = page.getByRole('treeitem', { name: 'Button.tsx' }).first();
    await nestedItem.focus();
    await expect(nestedItem).toBeFocused();
    await expect(page).toHaveScreenshot('tree-view-nested-item-focus.png');
  });

  test('Manual Parts Construction - Render matches snapshot', async ({ page }) => {
    await page.goto('/iframe.html?id=display-treeview--manual-parts-construction&viewMode=story');
    await expect(page.getByRole('tree')).toBeVisible();
    await expect(page).toHaveScreenshot('tree-view-manual-default.png');
  });

  test('With Checkboxes - Matches snapshot', async ({ page }) => {
    await page.goto('/iframe.html?id=display-treeview--with-checkboxes&viewMode=story');
    await expect(page.getByRole('tree')).toBeVisible();
    await expect(page).toHaveScreenshot('tree-view-checkbox-default.png');

    const firstCheckbox = page
      .getByRole('treeitem', { name: 'Work.pdf' })
      .locator('input[type="checkbox"]');
    await firstCheckbox.click({ force: true });
    await expect(page).toHaveScreenshot('tree-view-checkbox-partial.png');
  });

  test('clicking a hidden checkbox retains focus on its treeitem', async ({ page }) => {
    await page.goto('/iframe.html?id=display-treeview--with-checkboxes&viewMode=story');

    const item = page.getByRole('treeitem', { name: 'Work.pdf' });
    const checkbox = item.locator('input[type="checkbox"]');
    await checkbox.click({ force: true });

    await expect(item).toBeFocused();
    await expect(checkbox).not.toBeFocused();
  });

  test('Long labels truncate without a narrow viewport overflow', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/iframe.html?id=display-treeview--long-label&viewMode=story');
    const tree = page.getByRole('tree');
    await expect(tree).toBeVisible();
    await expect(tree).toHaveScreenshot('tree-view-long-label-mobile.png');
    await expect
      .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth))
      .toBe(true);
  });

  test('Deep RTL items use the tree scrollport when motion is disabled', async ({ page }) => {
    await page.goto(
      '/iframe.html?id=display-treeview--deep-constrained-reduced-motion&viewMode=story',
    );

    const tree = page.getByRole('tree', { name: 'Deep constrained tree' });
    const firstItem = page.getByRole('treeitem', { name: 'Level 1' });
    const leaf = page.getByRole('treeitem', { name: 'Deep leaf' });
    const leafTrigger = leaf.getByRole('button', { name: 'Deep leaf' });
    await expect(tree).toBeVisible();
    await firstItem.focus();
    await page.keyboard.press('End');
    await expect(leaf).toBeFocused();
    await expect(leaf).toBeVisible();

    await expect
      .poll(async () => {
        const [treeBox, leafBox] = await Promise.all([tree.boundingBox(), leaf.boundingBox()]);
        return Boolean(
          treeBox &&
          leafBox &&
          leafBox.x >= treeBox.x - 1 &&
          leafBox.x + leafBox.width <= treeBox.x + treeBox.width + 1,
        );
      })
      .toBe(true);
    expect(await tree.evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(true);
    await expect(tree).toHaveCSS('direction', 'rtl');
    await expect(leaf).toHaveCSS('outline-style', 'solid');
    const triggerBox = await leafTrigger.boundingBox();
    expect(triggerBox).not.toBeNull();
    expect(triggerBox!.width).toBeGreaterThanOrEqual(24);
    expect(triggerBox!.height).toBeGreaterThanOrEqual(24);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
      ),
    ).toBe(true);
  });

  test('should pass accessibility compliance', async ({ page }) => {
    await page.goto('/iframe.html?id=display-treeview--default&viewMode=story');
    await expect(page.getByRole('tree')).toBeVisible();
    await page.waitForTimeout(500);
    const results = await new AxeBuilder({ page })
      .include('#storybook-root')
      .exclude('iframe')
      .disableRules(['landmark-one-main', 'page-has-heading-one', 'region'])
      .analyze();
    expect(results.violations).toEqual([]);
  });
});
