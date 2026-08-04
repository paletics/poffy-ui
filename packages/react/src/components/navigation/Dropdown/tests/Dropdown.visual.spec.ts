import { test, expect } from '@playwright/test';
import { expectNoHorizontalOverflow, testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  componentId: 'navigation-dropdown',
  snapshotPrefix: 'dropdown',
  title: 'Dropdown',
  stories: [{ name: 'Default Closed', story: 'default' }],
});

test.describe('Dropdown Interaction Visual Regression', () => {
  test('Default open render matches snapshot', async ({ page }) => {
    await page.goto('/iframe.html?id=navigation-dropdown--default&viewMode=story');
    await page.getByText('Actions').click();
    await expect(page.getByRole('menuitem', { name: /edit/i })).toBeVisible();
    await expect(page).toHaveScreenshot('dropdown-default-open.png');
  });

  test('Disabled items open render matches snapshot', async ({ page }) => {
    await page.goto('/iframe.html?id=navigation-dropdown--with-disabled-items&viewMode=story');
    await page.getByText('File').click();
    await expect(page.getByRole('menuitem', { name: /save as/i })).toBeVisible();
    await expect(page).toHaveScreenshot('dropdown-disabled-items-open.png');
  });

  test('keyboard-focused menu item has an indicator distinct from hover', async ({ page }) => {
    await page.goto('/iframe.html?id=navigation-dropdown--default&viewMode=story');
    const trigger = page.getByRole('button', { name: 'Actions' });
    await trigger.focus();
    await page.keyboard.press('ArrowDown');

    const item = page.getByRole('menuitem', { name: 'Edit' });
    await expect(item).toBeVisible();
    await expect(item).toBeFocused();
    expect(await item.evaluate((element) => getComputedStyle(element).boxShadow)).toContain(
      'inset',
    );
  });

  test('Tab and Shift+Tab leave a portalled menu in logical document order', async ({ page }) => {
    await page.goto('/iframe.html?id=navigation-dropdown--tab-order&viewMode=story');

    const trigger = page.getByRole('button', { name: 'Tab order menu' });
    await trigger.focus();
    await page.keyboard.press('ArrowDown');
    await expect(page.getByRole('menuitem', { name: 'First action' })).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'After dropdown' })).toBeFocused();
    await expect(page.getByRole('menu')).toBeHidden();

    await trigger.focus();
    await page.keyboard.press('ArrowDown');
    await expect(page.getByRole('menuitem', { name: 'First action' })).toBeFocused();
    await page.keyboard.press('Shift+Tab');
    await expect(page.getByRole('button', { name: 'Before dropdown' })).toBeFocused();
    await expect(page.getByRole('menu')).toBeHidden();
  });

  test('Tab still leaves logically when the open trigger becomes untabbable', async ({ page }) => {
    await page.goto('/iframe.html?id=navigation-dropdown--tab-order&viewMode=story');

    const trigger = page.getByRole('button', { name: 'Tab order menu' });
    await trigger.focus();
    await page.keyboard.press('ArrowDown');
    await expect(page.getByRole('menuitem', { name: 'First action' })).toBeFocused();
    await trigger.evaluate((element) => {
      element.tabIndex = -1;
    });

    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'After dropdown' })).toBeFocused();
    await expect(page.getByRole('menu')).toBeHidden();
  });

  test('an all-disabled menu in a custom portal keeps logical Tab order', async ({ page }) => {
    await page.goto(
      '/iframe.html?id=navigation-dropdown--all-disabled-portal-tab-order&viewMode=story',
    );

    const trigger = page.getByRole('button', { name: 'All disabled menu' });
    const menu = page.getByRole('menu');
    await trigger.focus();
    await page.keyboard.press('ArrowDown');
    await expect(menu).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'After disabled menu' })).toBeFocused();
    await expect(menu).toBeHidden();

    await trigger.focus();
    await page.keyboard.press('ArrowDown');
    await expect(menu).toBeFocused();
    await page.keyboard.press('Shift+Tab');
    await expect(page.getByRole('button', { name: 'Before disabled menu' })).toBeFocused();
    await expect(menu).toBeHidden();
  });

  test('Tab does not restore an untabbable trigger when no adjacent stop exists', async ({
    page,
  }) => {
    await page.goto('/iframe.html?id=navigation-dropdown--tab-order&viewMode=story');

    const trigger = page.getByRole('button', { name: 'Tab order menu' });
    const before = page.getByRole('button', { name: 'Before dropdown' });
    const after = page.getByRole('button', { name: 'After dropdown' });
    await before.evaluate((element) => {
      element.setAttribute('disabled', '');
    });
    await after.evaluate((element) => {
      element.setAttribute('disabled', '');
    });
    await trigger.evaluate((element) => {
      element.tabIndex = -1;
    });

    await trigger.focus();
    await page.keyboard.press('ArrowDown');
    await expect(page.getByRole('menuitem', { name: 'First action' })).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(page.getByRole('menu')).toBeHidden();
    await expect(trigger).not.toBeFocused();

    await trigger.focus();
    await page.keyboard.press('ArrowDown');
    await expect(page.getByRole('menuitem', { name: 'First action' })).toBeFocused();
    await page.keyboard.press('Shift+Tab');
    await expect(page.getByRole('menu')).toBeHidden();
    await expect(trigger).not.toBeFocused();
  });

  test('Polymorphic trigger open render matches snapshot', async ({ page }) => {
    await page.goto('/iframe.html?id=navigation-dropdown--polymorphic-usage&viewMode=story');
    const trigger = page.getByRole('button', { name: /link trigger/i });
    await expect(trigger).toHaveJSProperty('tagName', 'A');
    await expect(trigger).not.toHaveAttribute('href');
    await trigger.click();
    await expect(page.getByRole('menuitem', { name: /action 1/i })).toBeVisible();
    await expect(page).toHaveScreenshot('dropdown-polymorphic-open.png');
  });

  test('link-like custom triggers fall back while forwarding custom buttons remain delegated', async ({
    page,
  }) => {
    await page.goto('/iframe.html?id=navigation-dropdown--trigger-host-contracts&viewMode=story');

    const fallback = page.getByRole('button', { name: 'Router host fallback' });
    const customButton = page.getByRole('button', { name: 'Forwarding custom button' });
    await expect(fallback).toHaveJSProperty('tagName', 'BUTTON');
    await expect(page.getByRole('link', { name: 'Router host fallback' })).toHaveCount(0);
    await expect(customButton).toHaveJSProperty('tagName', 'BUTTON');

    await fallback.focus();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('menuitem', { name: 'Fallback action' })).toBeFocused();
    await page.keyboard.press('Escape');

    await customButton.focus();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('menuitem', { name: 'Custom action' })).toBeFocused();
  });

  test('Open menu is constrained by a narrow and short viewport', async ({ page }) => {
    await page.setViewportSize({ width: 180, height: 160 });
    await page.goto('/iframe.html?id=navigation-dropdown--default&viewMode=story');
    await page.getByText('Actions').click();

    const menu = page.getByRole('menu');
    await expect(menu).toBeVisible();
    expect(
      await menu.evaluate((element) =>
        getComputedStyle(element).getPropertyValue('--floating-fallback-padding').trim(),
      ),
    ).toBe('8px');
    await expectNoHorizontalOverflow(page);
    const box = await menu.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeLessThanOrEqual(180);
    expect(box!.height).toBeLessThanOrEqual(160);
  });

  test('Semantic list menu resets native list spacing in a narrow viewport', async ({ page }) => {
    await page.setViewportSize({ width: 180, height: 200 });
    await page.goto(
      '/iframe.html?id=navigation-dropdown--semantic-list-constrained&viewMode=story',
    );
    await page.getByRole('button', { name: 'Semantic actions' }).click();

    const menu = page.getByRole('menu');
    const item = page.getByRole('menuitem', { name: 'Rename a long project title' });
    await expect(item).toHaveJSProperty('tagName', 'LI');
    await expect(menu).toHaveCSS('margin', '0px');
    await expect(menu).toHaveCSS('padding-left', '0px');
    await expect(menu).toHaveCSS('list-style-type', 'none');
    await expectNoHorizontalOverflow(page);
    await expect(page).toHaveScreenshot('dropdown-semantic-list-constrained.png');
  });

  test('Long RTL trigger stays inside a constrained parent', async ({ page }) => {
    await page.goto('/iframe.html?id=navigation-dropdown--constrained-long-trigger&viewMode=story');

    const container = page.getByLabel('Constrained dropdown trigger');
    const trigger = page.getByRole('button', {
      name: 'Triggerwithanunusuallylongunbrokenlocalizedlabel',
    });
    await trigger.focus();
    await expect(trigger).toBeFocused();
    await expect(trigger).toHaveCSS('direction', 'rtl');

    const [containerBox, triggerBox] = await Promise.all([
      container.boundingBox(),
      trigger.boundingBox(),
    ]);
    expect(containerBox).not.toBeNull();
    expect(triggerBox).not.toBeNull();
    expect(triggerBox!.x).toBeGreaterThanOrEqual(containerBox!.x - 1);
    expect(triggerBox!.x + triggerBox!.width).toBeLessThanOrEqual(
      containerBox!.x + containerBox!.width + 1,
    );
    expect(triggerBox!.height).toBeGreaterThanOrEqual(24);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
      ),
    ).toBe(true);

    await container.evaluate((element) => {
      element.style.width = '16px';
    });
    const [boundaryContainerBox, boundaryTriggerBox] = await Promise.all([
      container.boundingBox(),
      trigger.boundingBox(),
    ]);
    expect(boundaryContainerBox).not.toBeNull();
    expect(boundaryTriggerBox).not.toBeNull();
    expect(boundaryContainerBox!.width).toBe(16);
    expect(boundaryTriggerBox!.width).toBeGreaterThanOrEqual(24);

    await trigger.click();
    await expect(page.getByRole('menu')).toBeVisible();
  });
});
