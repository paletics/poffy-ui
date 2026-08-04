import { expect, test } from '@playwright/test';
import { testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  componentId: 'navigation-commandmenu',
  snapshotPrefix: 'command-menu',
  title: 'CommandMenu',
  stories: [
    { name: 'Default Closed', story: 'default' },
    { name: 'Open', story: 'open' },
    { name: 'Empty', story: 'empty' },
    { name: 'Sizes', story: 'sizes' },
  ],
});

test.describe('CommandMenu Interaction Visual Regression', () => {
  test('shortcut-open render matches snapshot', async ({ page }) => {
    await page.goto('/iframe.html?id=navigation-commandmenu--interaction&viewMode=story');
    await page.keyboard.press(process.platform === 'darwin' ? 'Meta+K' : 'Control+K');
    await expect(page.getByRole('dialog', { name: 'Command menu' })).toBeVisible();
    await expect(page).toHaveScreenshot('command-menu-shortcut-open.png');
  });

  test('keeps the highlighted item visible in a short viewport', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 160 });
    await page.goto('/iframe.html?id=navigation-commandmenu--long-list&viewMode=story');

    const overlay = page.locator('[data-command-menu-overlay]');
    const dialog = page.getByRole('dialog', { name: 'Command menu' });
    const input = page.getByRole('combobox', { name: 'Command menu' });
    const list = page.getByRole('listbox', { name: 'Command menu results' });
    await expect(dialog).toBeVisible();
    await expect(input).toBeFocused();
    const overlayPaddingTop = await overlay.evaluate((element) =>
      Number.parseFloat(getComputedStyle(element).paddingTop),
    );
    expect(overlayPaddingTop).toBeGreaterThan(0);
    const dialogBox = await dialog.boundingBox();
    expect(dialogBox).not.toBeNull();
    expect(dialogBox!.y).toBeGreaterThanOrEqual(-1);
    expect(dialogBox!.y + dialogBox!.height).toBeLessThanOrEqual(161);
    await input.press('End');

    const selected = list.getByRole('option', { selected: true });
    await expect(selected).toHaveText(/Command 30/);
    const isInsideList = await Promise.all([list.boundingBox(), selected.boundingBox()]).then(
      ([listBox, selectedBox]) =>
        Boolean(
          listBox &&
          selectedBox &&
          selectedBox.y >= listBox.y - 1 &&
          selectedBox.y + selectedBox.height <= listBox.y + listBox.height + 1,
        ),
    );
    expect(isInsideList).toBe(true);
  });

  test('keeps the search input intact when the dynamic viewport is shorter than the dialog floor', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 240, height: 56 });
    await page.goto('/iframe.html?id=navigation-commandmenu--long-list&viewMode=story');

    const overlay = page.locator('[data-command-menu-overlay]');
    const dialog = page.getByRole('dialog', { name: 'Command menu' });
    const input = page.getByRole('combobox', { name: 'Command menu' });
    await expect(dialog).toBeVisible();
    await expect(input).toBeFocused();

    const overlayMetrics = await overlay.evaluate((element) => ({
      clientHeight: element.clientHeight,
      scrollHeight: element.scrollHeight,
    }));
    await expect
      .poll(() =>
        dialog.evaluate((element) => {
          const search = element.querySelector('[role="combobox"]');
          const dialogBox = element.getBoundingClientRect();
          const inputBox = search?.getBoundingClientRect();
          return inputBox
            ? {
                dialogHeight: dialogBox.height,
                inputHeight: inputBox.height,
                isInside:
                  inputBox.top >= dialogBox.top - 1 && inputBox.bottom <= dialogBox.bottom + 1,
              }
            : null;
        }),
      )
      .toEqual({
        dialogHeight: expect.any(Number),
        inputHeight: expect.any(Number),
        isInside: true,
      });
    const geometry = await dialog.evaluate((element) => {
      const search = element.querySelector('[role="combobox"]');
      return {
        dialogHeight: element.getBoundingClientRect().height,
        inputHeight: search?.getBoundingClientRect().height ?? 0,
      };
    });
    // Token-derived dimensions can resolve to fractional CSS pixels at this
    // extreme viewport size. Keep a small rounding tolerance while guarding
    // against materially clipped dialog and search field geometry.
    expect(geometry.dialogHeight).toBeGreaterThanOrEqual(44.5);
    expect(geometry.inputHeight).toBeGreaterThanOrEqual(23.5);
    expect(overlayMetrics.scrollHeight).toBeGreaterThan(overlayMetrics.clientHeight);
  });

  test('keeps an RTL dialog inside an ultra-narrow viewport gutter', async ({ page }) => {
    await page.setViewportSize({ width: 180, height: 260 });
    await page.goto('/iframe.html?id=navigation-commandmenu--narrow-viewport&viewMode=story');

    const dialog = page.getByRole('dialog', { name: 'Narrow command menu' });
    const input = page.getByRole('combobox', { name: 'Narrow command menu' });
    await expect(dialog).toBeVisible();
    await expect(input).toBeFocused();
    const box = await dialog.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.x).toBeGreaterThan(0);
    expect(box!.x + box!.width).toBeLessThan(180);
    expect(await dialog.evaluate((element) => getComputedStyle(element).direction)).toBe('rtl');
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
      ),
    ).toBe(true);
  });
});
