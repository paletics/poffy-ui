import { test, expect } from '@playwright/test';
import { expectNoHorizontalOverflow, testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  componentId: 'overlay-contextmenu',
  snapshotPrefix: 'context-menu',
  title: 'ContextMenu',
  stories: [
    { name: 'Default Closed', story: 'default' },
    { name: 'Brands Closed', story: 'brands' },
  ],
});

test.describe('ContextMenu Interaction Visual Regression', () => {
  test('animates entry and exit when motion is enabled', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/iframe.html?id=overlay-contextmenu--default&viewMode=story');

    await page.getByText(/right click/i).click({ button: 'right' });
    const menu = page.locator('[role="menu"]');
    await expect(menu).toBeVisible();
    await page.waitForTimeout(20);
    await expect
      .poll(async () => menu.evaluate((element) => Number(getComputedStyle(element).opacity)))
      .toBeLessThan(1);
    await expect
      .poll(async () => menu.evaluate((element) => Number(getComputedStyle(element).opacity)))
      .toBe(1);

    await page.mouse.click(4, 4);
    await page.waitForTimeout(20);
    await expect(menu).toBeAttached();
    await expect
      .poll(async () => menu.evaluate((element) => Number(getComputedStyle(element).opacity)))
      .toBeLessThan(1);
    await expect(menu).toHaveCount(0);
  });

  test('Open menu matches snapshot', async ({ page }) => {
    await page.goto('/iframe.html?id=overlay-contextmenu--default&viewMode=story');
    await page.getByText(/right click/i).click({ button: 'right' });
    await expect(page.getByRole('menuitem', { name: /edit/i })).toBeVisible();
    expect(
      await page
        .getByRole('menu')
        .evaluate((element) =>
          getComputedStyle(element).getPropertyValue('--floating-fallback-padding').trim(),
        ),
    ).toBe('10px');
    await expect(page).toHaveScreenshot('context-menu-open.png');
  });

  test('With icons open menu matches snapshot', async ({ page }) => {
    await page.goto('/iframe.html?id=overlay-contextmenu--with-icons&viewMode=story');
    await page.getByText(/right click.*icons/i).click({ button: 'right' });
    await expect(page.getByRole('menuitem', { name: /copy/i })).toBeVisible();
    await expect(page).toHaveScreenshot('context-menu-with-icons-open.png');
  });

  test('Brands story does not overflow on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/iframe.html?id=overlay-contextmenu--brands&viewMode=story');

    await expect(page.getByText(/right click/i).first()).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });

  test('Long shortcut stays contained in an ultra-narrow viewport', async ({ page }) => {
    await page.setViewportSize({ width: 160, height: 240 });
    await page.goto('/iframe.html?id=overlay-contextmenu--narrow-long-shortcut&viewMode=story');
    await page.getByText(/right click/i).click({ button: 'right' });

    const menu = page.getByRole('menu');
    const item = page.getByRole('menuitem', { name: 'Inspect selected workspace resource' });
    await expect(item).toBeVisible();
    const [menuBox, itemBox] = await Promise.all([menu.boundingBox(), item.boundingBox()]);
    expect(menuBox).not.toBeNull();
    expect(itemBox).not.toBeNull();
    expect(itemBox!.x).toBeGreaterThanOrEqual(menuBox!.x - 1);
    expect(itemBox!.x + itemBox!.width).toBeLessThanOrEqual(menuBox!.x + menuBox!.width + 1);
    await expectNoHorizontalOverflow(page);
  });

  test('Tab and Shift+Tab leave the portalled menu from its logical trigger', async ({ page }) => {
    const url = '/iframe.html?id=overlay-contextmenu--tab-order&viewMode=story';
    const openFromKeyboard = async () => {
      const trigger = page.getByLabel('Context menu trigger');
      await trigger.focus();
      await page.keyboard.press('Shift+F10');
      await expect(page.getByRole('menuitem', { name: 'View' })).toBeFocused();
    };

    await page.goto(url);
    await openFromKeyboard();
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'After context trigger' })).toBeFocused();
    await expect(page.getByRole('menu')).toBeHidden();

    await page.goto(url);
    await openFromKeyboard();
    await page.keyboard.press('Shift+Tab');
    await expect(page.getByRole('button', { name: 'Before context trigger' })).toBeFocused();
    await expect(page.getByRole('menu')).toBeHidden();
  });

  test('Tab resolves from a trigger temporarily removed from the tab sequence', async ({
    page,
  }) => {
    await page.goto('/iframe.html?id=overlay-contextmenu--tab-order&viewMode=story');
    const trigger = page.getByLabel('Context menu trigger');
    await trigger.focus();
    await page.keyboard.press('Shift+F10');
    await expect(page.getByRole('menuitem', { name: 'View' })).toBeFocused();
    await trigger.evaluate((element) => {
      element.tabIndex = -1;
    });

    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'After context trigger' })).toBeFocused();
    await expect(page.getByRole('menu')).toBeHidden();
  });

  for (const boundary of [
    { key: 'Shift+Tab', name: 'start' },
    { key: 'Tab', name: 'end' },
  ] as const) {
    test(`${boundary.name} boundary does not trap focus in the context trigger`, async ({
      page,
    }) => {
      await page.goto('/iframe.html?id=overlay-contextmenu--tab-order&viewMode=story');
      await page.getByRole('button', { name: 'Before context trigger' }).evaluate((element) => {
        (element as HTMLButtonElement).disabled = true;
      });
      await page.getByRole('button', { name: 'After context trigger' }).evaluate((element) => {
        (element as HTMLButtonElement).disabled = true;
      });
      const trigger = page.getByLabel('Context menu trigger');
      await trigger.focus();
      await page.keyboard.press('Shift+F10');
      await expect(page.getByRole('menuitem', { name: 'View' })).toBeFocused();

      await page.keyboard.press(boundary.key);
      await expect(page.getByRole('menu')).toBeHidden();
      await expect(trigger).not.toBeFocused();
    });
  }
});
