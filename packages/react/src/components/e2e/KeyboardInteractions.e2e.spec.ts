import { expect, type Page, test } from '@playwright/test';

const gotoStory = async (page: Page, storyId: string) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(`/iframe.html?id=${storyId}&viewMode=story`);

  const storyRoot = page.locator('#storybook-root, #root').first();
  await expect
    .poll(
      async () => {
        try {
          return await storyRoot.evaluate((node) => node.childElementCount);
        } catch {
          return 0;
        }
      },
      { timeout: 60_000 },
    )
    .toBeGreaterThan(0);
};

test.describe('component keyboard interactions', () => {
  test('Tabs supports roving focus and keyboard activation', async ({ page }) => {
    await gotoStory(page, 'navigation-tabs--default');

    const tab1 = page.getByRole('tab', { name: 'Tab 1' });
    const tab2 = page.getByRole('tab', { name: 'Tab 2' });

    await tab1.focus();
    await page.keyboard.press('ArrowRight');

    await expect(tab2).toBeFocused();
    await expect(tab2).toHaveAttribute('aria-selected', 'false');

    await page.keyboard.press('Enter');

    await expect(tab2).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByRole('tabpanel')).toContainText('Content 2');
  });

  test('Dropdown opens from keyboard, moves through items, and closes with Escape', async ({
    page,
  }) => {
    await gotoStory(page, 'navigation-dropdown--default');

    const trigger = page.getByRole('button', { name: 'Actions' });
    const edit = page.getByRole('menuitem', { name: 'Edit' });
    const duplicate = page.getByRole('menuitem', { name: 'Duplicate' });

    await trigger.focus();
    await page.keyboard.press('Enter');

    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(page.getByRole('menu')).toBeVisible();

    await edit.focus();
    await expect(edit).toBeFocused();

    await page.keyboard.press('ArrowDown');
    await expect(duplicate).toBeFocused();

    await page.keyboard.press('ArrowUp');
    await expect(edit).toBeFocused();

    await page.keyboard.press('ArrowDown');
    await expect(duplicate).toBeFocused();

    await page.keyboard.press('Escape');

    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(trigger).toBeFocused();
  });

  test('Modal opens from keyboard, traps focus inside, and closes with Escape', async ({
    page,
  }) => {
    await gotoStory(page, 'overlay-modal--default');

    const trigger = page.getByRole('button', { name: /open default modal/i });

    await trigger.focus();
    await page.keyboard.press('Enter');

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    await page.keyboard.press('Tab');
    await expect(dialog).toContainText('Modal Title');

    await page.keyboard.press('Escape');

    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test('ListboxSelect selects the next option using ArrowDown and Enter', async ({ page }) => {
    await gotoStory(page, 'inputs-listboxselect--playground');

    const select = page.getByRole('combobox', { name: 'Example listbox select' });

    await select.focus();
    await expect(select).toHaveAttribute('aria-expanded', 'false');

    await page.keyboard.press('ArrowDown');
    await expect(select).toHaveAttribute('aria-expanded', 'true');
    await expect(page.getByRole('listbox')).toBeVisible();

    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');

    await expect(select).toHaveAttribute('aria-expanded', 'false');
    await expect(select).toContainText('Option 2');
  });

  test('ComboBox filters options and selects the highlighted match with Enter', async ({
    page,
  }) => {
    await gotoStory(page, 'inputs-combobox--playground');

    const input = page.getByRole('combobox', { name: 'Fruit' });

    await input.focus();
    await input.fill('blu');

    const option = page.getByRole('option', { name: 'Blueberry' });
    await expect(option).toBeVisible();

    await page.keyboard.press('Enter');

    await expect(input).toHaveValue('Blueberry');
    await expect(input).toHaveAttribute('aria-expanded', 'false');
  });

  test('MultiSelect selects an option and removes the tag from keyboard', async ({ page }) => {
    await gotoStory(page, 'inputs-multiselect--playground');

    const input = page.getByRole('combobox', { name: 'Frameworks' });

    await input.focus();
    await page.keyboard.press('ArrowDown');

    await expect(input).toHaveAttribute('aria-expanded', 'true');
    await expect(page.getByRole('listbox')).toBeVisible();
    await expect(input).toHaveAttribute('aria-activedescendant', /.+/);

    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');

    const removeVue = page.getByRole('button', { name: 'Remove Vue' });
    await expect(removeVue).toBeVisible();

    await input.focus();
    await page.keyboard.press('Backspace');

    await expect(removeVue).toBeHidden();
  });

  test('DatePicker opens the calendar and selects the next day from keyboard', async ({ page }) => {
    await gotoStory(page, 'inputs-datepicker--controlled');

    const input = page.getByRole('combobox');

    await expect(input).toHaveValue(/Oct 15, 2023|2023年10月15日|2023\/10\/15/);
    await input.focus();
    await page.keyboard.press('Enter');

    await expect(input).toHaveAttribute('aria-expanded', 'true');
    await expect(page.getByRole('grid')).toBeVisible();

    const selectedDay = page.getByRole('button', { name: /October 15, 2023|2023.*10.*15/ });
    await selectedDay.focus();
    await page.keyboard.press('ArrowRight');

    const nextDay = page.getByRole('button', { name: /October 16, 2023|2023.*10.*16/ });
    await expect(nextDay).toBeFocused();

    await page.keyboard.press('Enter');

    await expect(input).toHaveAttribute('aria-expanded', 'false');
    await expect(input).toHaveValue(/Oct 16, 2023|2023年10月16日|2023\/10\/16/);
  });

  test('ContextMenu moves focus through items and closes with Escape', async ({ page }) => {
    await gotoStory(page, 'overlay-contextmenu--default');

    await page.getByText(/right click/i).click({ button: 'right' });

    const menu = page.getByRole('menu');
    const view = page.getByRole('menuitem', { name: 'View' });
    const edit = page.getByRole('menuitem', { name: /Edit/ });
    const del = page.getByRole('menuitem', { name: /Delete/ });

    await expect(menu).toBeVisible();
    await view.focus();
    await expect(view).toBeFocused();

    await page.keyboard.press('ArrowDown');
    await expect(edit).toBeFocused();

    await page.keyboard.press('ArrowDown');
    await expect(del).toBeFocused();

    await page.keyboard.press('ArrowUp');
    await expect(edit).toBeFocused();

    await page.keyboard.press('Escape');
    await expect(menu).toBeHidden();
  });

  test('TreeView toggles an expandable node from keyboard', async ({ page }) => {
    await gotoStory(page, 'display-treeview--manual-parts-construction');

    const folder = page.getByRole('button', { name: /Folder/ });
    const file = page.getByRole('button', { name: /Magic File/ });

    await folder.focus();
    await expect(folder).toHaveAttribute('aria-expanded', 'true');
    await expect(file).toBeVisible();

    await page.keyboard.press('ArrowLeft');
    await expect(folder).toHaveAttribute('aria-expanded', 'false');
    await expect(file).toBeHidden();

    await page.keyboard.press('ArrowRight');
    await expect(folder).toHaveAttribute('aria-expanded', 'true');
    await expect(file).toBeVisible();

    await page.keyboard.press(' ');
    await expect(folder).toHaveAttribute('aria-expanded', 'false');
  });
});
