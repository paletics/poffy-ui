import {
  expectNoHorizontalOverflow,
  testStoriesDoNotOverflowOnMobile,
  testVisualStories,
} from '@/components/e2e/visualSpecUtils';
import { expect, test } from '@playwright/test';

testVisualStories({
  componentId: 'inputs-splitbutton',
  snapshotPrefix: 'split-button',
  title: 'SplitButton',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'Sizes', story: 'sizes' },
    { name: 'Variants', story: 'variants' },
    { name: 'Disabled', story: 'disabled' },
  ],
});

test('portalled menu stays within a narrow and short viewport', async ({ page }) => {
  await page.setViewportSize({ width: 220, height: 180 });
  await page.goto('/iframe.html?id=inputs-splitbutton--constrained-viewport&viewMode=story');
  await page.getByRole('button', { name: 'More options' }).click();
  const menu = page.getByRole('menu');
  await expect(menu).toBeVisible();
  await expect
    .poll(async () => {
      const settledBox = await menu.boundingBox();
      return settledBox ? settledBox.y + settledBox.height : Number.POSITIVE_INFINITY;
    })
    .toBeLessThanOrEqual(180);
  const box = await menu.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.x).toBeGreaterThanOrEqual(0);
  expect(box!.y).toBeGreaterThanOrEqual(0);
  expect(box!.x + box!.width).toBeLessThanOrEqual(220);
  expect(await menu.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
  await expect(page).toHaveScreenshot('split-button-constrained-menu-open.png');
  await expectNoHorizontalOverflow(page);
});

test('focused connected actions stay above their sibling', async ({ page }) => {
  await page.goto('/iframe.html?id=inputs-splitbutton--default&viewMode=story');
  const trigger = page.getByRole('button', { name: 'More options' });
  await trigger.focus();
  await expect(trigger).toBeFocused();
  await expect(page).toHaveScreenshot('split-button-trigger-focus.png');
});

test('menu button keyboard entry and selection restore focus to the trigger', async ({ page }) => {
  await page.goto('/iframe.html?id=inputs-splitbutton--default&viewMode=story');
  const trigger = page.getByRole('button', { name: 'More options' });

  await trigger.focus();
  await trigger.press('ArrowUp');
  await expect(page.getByRole('menuitem', { name: 'Save as Template' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();

  await trigger.press('Enter');
  const firstItem = page.getByRole('menuitem', { name: 'Save and Close' });
  await expect(firstItem).toBeFocused();
  await firstItem.press('Enter');
  await expect(page.getByRole('menu')).toBeHidden();
  await expect(trigger).toBeFocused();

  await trigger.press('ArrowDown');
  await expect(firstItem).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(page.getByRole('menu')).toBeHidden();
  await expect(page.getByRole('button', { name: 'Save', exact: true })).toBeFocused();
});

test('Tab resolves from a split trigger temporarily removed from the tab sequence', async ({
  page,
}) => {
  await page.goto('/iframe.html?id=inputs-splitbutton--tab-order&viewMode=story');
  const trigger = page.getByRole('button', { name: 'More options' });
  await trigger.focus();
  await trigger.press('ArrowDown');
  await expect(page.getByRole('menuitem', { name: 'First secondary action' })).toBeFocused();
  await trigger.evaluate((element) => {
    element.tabIndex = -1;
  });

  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'After split button' })).toBeFocused();
  await expect(page.getByRole('menu')).toBeHidden();
});

for (const boundary of [
  { key: 'Shift+Tab', name: 'start' },
  { key: 'Tab', name: 'end' },
] as const) {
  test(`${boundary.name} boundary does not trap focus in the split trigger`, async ({ page }) => {
    await page.goto('/iframe.html?id=inputs-splitbutton--tab-order&viewMode=story');
    await page.getByRole('button', { name: 'Before split button' }).evaluate((element) => {
      (element as HTMLButtonElement).disabled = true;
    });
    await page.getByRole('button', { name: 'After split button' }).evaluate((element) => {
      (element as HTMLButtonElement).disabled = true;
    });
    if (boundary.name === 'start') {
      await page.getByRole('button', { name: 'Primary action' }).evaluate((element) => {
        element.tabIndex = -1;
      });
    }
    const trigger = page.getByRole('button', { name: 'More options' });
    await trigger.focus();
    await trigger.press('ArrowDown');
    await expect(page.getByRole('menuitem', { name: 'First secondary action' })).toBeFocused();

    await page.keyboard.press(boundary.key);
    await expect(page.getByRole('menu')).toBeHidden();
    await expect(trigger).not.toBeFocused();
  });
}

testStoriesDoNotOverflowOnMobile({
  componentId: 'inputs-splitbutton',
  title: 'SplitButton',
  stories: [
    { name: 'Sizes', story: 'sizes' },
    { name: 'ConstrainedViewport', story: 'constrained-viewport' },
  ],
});
