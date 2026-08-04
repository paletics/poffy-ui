import { expect, test } from '@playwright/test';
import { expectNoHorizontalOverflow, testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  accessibilityStory: 'sizes',
  componentId: 'inputs-inputgroup',
  snapshotPrefix: 'input-group',
  title: 'InputGroup sizes',
  stories: [{ name: 'Sizes', story: 'sizes' }],
});

test.describe('InputGroup layout', () => {
  test.setTimeout(90_000);

  test('keeps inner elements inside the input field when addons are present', async ({ page }) => {
    await page.goto('/iframe.html?id=inputs-inputgroup--default&viewMode=story');
    await expect(page.getByPlaceholder('example.com')).toBeVisible({ timeout: 60_000 });

    await page.goto('/iframe.html?id=inputs-inputgroup--mixed-layout&viewMode=story');

    const group = page.locator('[data-has-start-addon][data-has-start-element]').first();
    const addon = group.locator('[data-placement="start"]').first();
    const element = group.locator('[data-placement="start"]').nth(1);
    const input = group.getByPlaceholder('Search domain...');

    await expect(input).toBeVisible({ timeout: 60_000 });
    await input.blur();
    await expect(input).toHaveCSS('border-top-left-radius', '0px');
    await expect(input).toHaveCSS('border-bottom-left-radius', '0px');

    const boxes = await Promise.all([
      addon.boundingBox(),
      element.boundingBox(),
      input.boundingBox(),
    ]);

    const [addonBox, elementBox, inputBox] = boxes;
    expect(addonBox).not.toBeNull();
    expect(elementBox).not.toBeNull();
    expect(inputBox).not.toBeNull();

    expect(elementBox!.x).toBeGreaterThanOrEqual(inputBox!.x);
    expect(elementBox!.x).toBeGreaterThanOrEqual(addonBox!.x + addonBox!.width);
  });

  test('MixedLayout story does not overflow on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/iframe.html?id=inputs-inputgroup--mixed-layout&viewMode=story');
    await expect(page.getByPlaceholder('Search domain...')).toBeVisible({ timeout: 60_000 });

    await expectNoHorizontalOverflow(page);
  });

  test('applies public size geometry to every slot', async ({ page }) => {
    await page.goto('/iframe.html?id=inputs-inputgroup--sizes&viewMode=story');

    const smallInput = page.getByPlaceholder('Small field');
    const largeInput = page.getByPlaceholder('Large field');
    const smallRoot = smallInput.locator('../..');
    const largeRoot = largeInput.locator('../..');
    const smallAddon = smallRoot.getByText('sm', { exact: true });
    const largeAddon = largeRoot.getByText('lg', { exact: true });
    const smallElement = smallRoot.locator('[data-placement="end"]');
    const largeElement = largeRoot.locator('[data-placement="end"]');

    const [small, large] = await Promise.all(
      [
        [smallRoot, smallInput, smallAddon, smallElement],
        [largeRoot, largeInput, largeAddon, largeElement],
      ].map(async ([root, input, addon, element]) => ({
        rootFontSize: Number.parseFloat(
          await root.evaluate((node) => getComputedStyle(node).fontSize),
        ),
        rootRadius: Number.parseFloat(
          await root.evaluate((node) => getComputedStyle(node).borderTopLeftRadius),
        ),
        inputHeight: await input.evaluate((node) => node.getBoundingClientRect().height),
        inputPaddingEnd: Number.parseFloat(
          await input.evaluate((node) => getComputedStyle(node).paddingInlineEnd),
        ),
        addonHeight: await addon.evaluate((node) => node.getBoundingClientRect().height),
        addonRadius: Number.parseFloat(
          await addon.evaluate((node) => getComputedStyle(node).borderTopLeftRadius),
        ),
        elementWidth: await element.evaluate((node) => node.getBoundingClientRect().width),
      })),
    );

    expect(large.rootFontSize).toBeGreaterThan(small.rootFontSize);
    expect(large.rootRadius).toBeGreaterThan(small.rootRadius);
    expect(large.inputHeight).toBeGreaterThan(small.inputHeight);
    expect(large.inputPaddingEnd).toBeGreaterThan(small.inputPaddingEnd);
    expect(large.addonHeight).toBeGreaterThan(small.addonHeight);
    expect(large.addonRadius).toBeGreaterThan(small.addonRadius);
    expect(large.elementWidth).toBeGreaterThan(small.elementWidth);
  });

  test('keeps an addon action focus ring outside its truncation boundary', async ({ page }) => {
    await page.goto('/iframe.html?id=inputs-inputgroup--addon-focus-safety&viewMode=story');
    const action = page.getByRole('button', { name: 'Clear filter' });
    await expect(action).toBeVisible({ timeout: 60_000 });
    await action.focus();

    const addon = action.locator('..');
    await expect(addon).toHaveCSS('overflow', 'visible');
    await expect(page).toHaveScreenshot('input-group-addon-focus-ring.png');
  });

  test('keeps interactive elements available when decorative elements collapse', async ({
    page,
  }) => {
    await page.goto(
      '/iframe.html?id=inputs-inputgroup--extreme-narrow-interactive-element&viewMode=story',
    );

    const action = page.getByRole('button', { name: 'Clear narrow search' });
    const decoration = page.locator('[data-input-group-element]:not([data-interactive])');
    await expect(action).toBeVisible();
    await expect(decoration).toBeHidden();
  });
});
