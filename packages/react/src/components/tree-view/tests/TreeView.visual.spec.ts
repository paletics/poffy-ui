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

  test('Manual Parts Construction - Render matches snapshot', async ({ page }) => {
    await page.goto('/iframe.html?id=display-treeview--manual-parts-construction&viewMode=story');
    await expect(page.getByRole('tree')).toBeVisible();
    await expect(page).toHaveScreenshot('tree-view-manual-default.png');
  });

  test('With Checkboxes - Matches snapshot', async ({ page }) => {
    await page.goto('/iframe.html?id=display-treeview--with-checkboxes&viewMode=story');
    await expect(page.getByRole('tree')).toBeVisible();
    await expect(page).toHaveScreenshot('tree-view-checkbox-default.png');

    const firstCheckbox = page.getByRole('checkbox', { name: 'Select Work.pdf' });
    await firstCheckbox.click({ force: true });
    await expect(page).toHaveScreenshot('tree-view-checkbox-partial.png');
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
