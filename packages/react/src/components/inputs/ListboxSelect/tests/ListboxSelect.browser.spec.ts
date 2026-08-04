import { expect, test } from '@playwright/test';

test.describe('ListboxSelect browser contracts', () => {
  test('keeps required validity, focus, FormData, and invalid events on the native select contract', async ({
    page,
  }) => {
    await page.goto('/iframe.html?id=inputs-listboxselect--required-validation&viewMode=story');

    const nativeSelect = page.locator('select[name="plan"]');
    const form = page.locator('form');
    await expect(nativeSelect).toHaveAttribute('required', '');
    await expect(nativeSelect).toHaveAttribute('aria-hidden', 'true');

    const before = await nativeSelect.evaluate((select: HTMLSelectElement) => ({
      required: select.required,
      valid: select.validity.valid,
      valueMissing: select.validity.valueMissing,
      willValidate: select.willValidate,
    }));
    expect(before).toEqual({
      required: true,
      valid: false,
      valueMissing: true,
      willValidate: true,
    });
    expect(
      await form.evaluate((node: HTMLFormElement) => Array.from(new FormData(node).entries())),
    ).toEqual([]);

    expect(await form.evaluate((node: HTMLFormElement) => node.reportValidity())).toBe(false);
    await expect(nativeSelect).toHaveAttribute('data-invalid-count', '1');
    await expect(page.getByRole('combobox', { name: 'Required plan' })).toBeFocused();

    await page.getByRole('combobox', { name: 'Required plan' }).click();
    await page.getByRole('option', { name: 'Professional' }).click();
    expect(await nativeSelect.evaluate((select: HTMLSelectElement) => select.validity.valid)).toBe(
      true,
    );
    expect(
      await form.evaluate((node: HTMLFormElement) => Array.from(new FormData(node).entries())),
    ).toEqual([['plan', 'pro']]);
  });
});
