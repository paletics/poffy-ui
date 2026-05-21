import { expect, test } from '@playwright/test';

test.describe('InputGroup layout', () => {
  test.setTimeout(90_000);

  test('keeps inner elements inside the input field when addons are present', async ({ page }) => {
    await page.goto('/iframe.html?id=inputs-inputgroup--default&viewMode=story');
    await expect(page.getByPlaceholder('example.com')).toBeVisible({ timeout: 60_000 });

    await page.goto('/iframe.html?id=inputs-inputgroup--mixed-layout&viewMode=story');

    const group = page.locator('[data-has-left-addon][data-has-left-element]').first();
    const addon = group.locator('[data-placement="left"]').first();
    const element = group.locator('[data-placement="left"]').nth(1);
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
});
