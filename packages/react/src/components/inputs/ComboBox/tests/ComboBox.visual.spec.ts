import { expect, test } from '@playwright/test';
import { expectNoHorizontalOverflow, testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  componentId: 'inputs-combobox',
  snapshotPrefix: 'combo-box',
  title: 'ComboBox',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'Controlled', story: 'controlled' },
  ],
});

test('keeps disclosure geometry aligned across public sizes', async ({ page }) => {
  await page.goto('/iframe.html?id=inputs-combobox--responsive-sizes&viewMode=story');

  const container = page.getByLabel('Responsive ComboBox container');
  const containerBox = await container.boundingBox();
  expect(containerBox).not.toBeNull();

  for (const name of ['Small fruit', 'Medium fruit', 'Large fruit']) {
    const input = page.getByRole('combobox', { name });
    const control = input.locator('..');
    const root = control.locator('..');
    const trigger = control.locator('[data-combobox-trigger]');
    const [rootBox, inputBox, triggerBox] = await Promise.all([
      root.boundingBox(),
      input.boundingBox(),
      trigger.boundingBox(),
    ]);

    expect(rootBox).not.toBeNull();
    expect(inputBox).not.toBeNull();
    expect(triggerBox).not.toBeNull();
    expect(Math.abs(rootBox!.width - containerBox!.width)).toBeLessThanOrEqual(1);
    expect(Math.abs(triggerBox!.height - inputBox!.height)).toBeLessThan(1);
    expect(Math.abs(triggerBox!.y - inputBox!.y)).toBeLessThan(1);
  }
});

test('keeps ultra-narrow RTL input and trigger operable and contained', async ({ page }) => {
  await page.goto('/iframe.html?id=inputs-combobox--ultra-narrow-rtl&viewMode=story');

  const input = page.getByRole('combobox', { name: 'Narrow RTL fruit' });
  const control = input.locator('..');
  const trigger = control.locator('[data-combobox-trigger]');
  const [controlBox, inputBox, triggerBox] = await Promise.all([
    control.boundingBox(),
    input.boundingBox(),
    trigger.boundingBox(),
  ]);

  expect(controlBox).not.toBeNull();
  expect(inputBox).not.toBeNull();
  expect(triggerBox).not.toBeNull();
  expect(triggerBox!.width).toBeGreaterThanOrEqual(24);
  expect(triggerBox!.x).toBeGreaterThanOrEqual(controlBox!.x - 1);
  expect(triggerBox!.x + triggerBox!.width).toBeLessThanOrEqual(
    controlBox!.x + controlBox!.width + 1,
  );
  expect(await input.evaluate((node) => getComputedStyle(node).direction)).toBe('rtl');
  expect(await input.evaluate((node) => getComputedStyle(node).color)).toBe('rgba(0, 0, 0, 0)');

  await input.fill('Ban');
  await expect(page.getByRole('option', { name: 'Banana' })).toBeVisible();

  const ultraNarrowInput = page.getByRole('combobox', { name: 'Ultra narrow fruit' });
  const ultraNarrowControl = ultraNarrowInput.locator('..');
  const ultraNarrowTrigger = ultraNarrowControl.locator('[data-combobox-trigger]');
  const [ultraNarrowControlBox, ultraNarrowTriggerBox] = await Promise.all([
    ultraNarrowControl.boundingBox(),
    ultraNarrowTrigger.boundingBox(),
  ]);
  expect(ultraNarrowControlBox).not.toBeNull();
  expect(ultraNarrowTriggerBox).not.toBeNull();
  expect(ultraNarrowTriggerBox!.width).toBeGreaterThanOrEqual(24);
  expect(ultraNarrowTriggerBox!.x).toBeGreaterThanOrEqual(ultraNarrowControlBox!.x - 1);
  expect(ultraNarrowTriggerBox!.x + ultraNarrowTriggerBox!.width).toBeLessThanOrEqual(
    ultraNarrowControlBox!.x + ultraNarrowControlBox!.width + 1,
  );
  expect(await ultraNarrowInput.evaluate((node) => getComputedStyle(node).color)).toBe(
    'rgba(0, 0, 0, 0)',
  );
  await expectNoHorizontalOverflow(page);
});
