import { testVisualStories } from '@/components/e2e/visualSpecUtils';
import { expect, test } from '@playwright/test';

testVisualStories({
  accessibilityStory: 'constrained-tags',
  componentId: 'inputs-multiselect',
  snapshotPrefix: 'multi-select',
  title: 'MultiSelect',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'Ultra Narrow', story: 'ultra-narrow' },
    { name: 'Ultra Narrow Custom Tag', story: 'ultra-narrow-custom-tag' },
    { name: 'Constrained Tags', story: 'constrained-tags' },
  ],
});

test('keeps ultra-narrow controls and their popup inside their layout boundaries', async ({
  page,
}) => {
  await page.goto('/iframe.html?id=inputs-multiselect--ultra-narrow&viewMode=story');

  for (const width of [40, 60] as const) {
    const root = page.getByTestId(`multi-select-${width}`);
    const input = page.getByRole('combobox', { name: `${width} pixel frameworks` });
    const removeButton = page.getByRole('button', {
      name: `Remove ${width === 40 ? 'React' : 'Vue'}`,
    });
    const trigger = page.getByRole('button', { name: `Toggle ${width} pixel options` });
    const control = input.locator('..');
    const tag = removeButton.locator('..');
    const tagLabel = root.getByText(width === 40 ? 'React' : 'Vue', { exact: true });

    await expect(tagLabel).toBeVisible();
    await expect(removeButton).toBeVisible();

    const [sizes, controlInnerBox, tagBox, removeBox, triggerBox] = await Promise.all([
      Promise.all([
        root.evaluate((element) => ({
          clientWidth: element.clientWidth,
          scrollWidth: element.scrollWidth,
        })),
        control.evaluate((element) => ({
          clientWidth: element.clientWidth,
          scrollWidth: element.scrollWidth,
        })),
      ]),
      control.evaluate((element) => {
        const box = element.getBoundingClientRect();
        const left = box.left + element.clientLeft;
        const top = box.top + element.clientTop;
        return {
          left,
          right: left + element.clientWidth,
          top,
          bottom: top + element.clientHeight,
          width: element.clientWidth,
        };
      }),
      tag.boundingBox(),
      removeButton.boundingBox(),
      trigger.boundingBox(),
    ]);

    if (!tagBox || !removeBox || !triggerBox) {
      throw new Error(
        'Expected the MultiSelect tag, remove button, and trigger to have layout boxes',
      );
    }

    for (const box of [tagBox, removeBox, triggerBox]) {
      expect(box.x).toBeGreaterThanOrEqual(controlInnerBox.left - 1);
      expect(box.x + box.width).toBeLessThanOrEqual(controlInnerBox.right + 1);
      expect(box.y).toBeGreaterThanOrEqual(controlInnerBox.top - 1);
      expect(box.y + box.height).toBeLessThanOrEqual(controlInnerBox.bottom + 1);
    }

    expect(Math.abs(removeBox.width - tagBox.width)).toBeLessThanOrEqual(1);
    expect(Math.abs(triggerBox.width - controlInnerBox.width)).toBeLessThanOrEqual(1);
    expect(
      await removeButton.evaluate((button) => {
        const box = button.getBoundingClientRect();
        const y = box.top + box.height / 2;
        return [box.left + 2, box.right - 2].every((x) => {
          const hit = document.elementFromPoint(x, y);
          return hit !== null && button.contains(hit);
        });
      }),
    ).toBe(true);
    expect(
      await trigger.evaluate((button) => {
        const box = button.getBoundingClientRect();
        const y = box.top + box.height / 2;
        return [box.left + 2, box.right - 2].every((x) => {
          const hit = document.elementFromPoint(x, y);
          return hit !== null && button.contains(hit);
        });
      }),
    ).toBe(true);
    expect(
      await removeButton.evaluate((button) => {
        const style = getComputedStyle(button);
        return [style.marginInlineStart, style.marginInlineEnd];
      }),
    ).toEqual(['0px', '0px']);

    expect(sizes[0].scrollWidth).toBeLessThanOrEqual(sizes[0].clientWidth + 1);
    expect(sizes[1].scrollWidth).toBeLessThanOrEqual(sizes[1].clientWidth + 1);

    await input.focus();
    await page.keyboard.press('Shift+Tab');
    await expect(removeButton).toBeFocused();
    await expect(root).toHaveScreenshot(`multi-select-ultra-narrow-${width}-remove-focus.png`);

    await page.mouse.click(removeBox.x + removeBox.width - 2, removeBox.y + removeBox.height / 2);
    await expect(removeButton).toBeHidden();
    await expect(input).toBeFocused();

    await input.focus();
    const currentTriggerBox = await trigger.boundingBox();
    if (!currentTriggerBox) {
      throw new Error('Expected the MultiSelect trigger to retain a layout box after tag removal');
    }
    expect(
      await trigger.evaluate((button) => {
        const box = button.getBoundingClientRect();
        const hit = document.elementFromPoint(box.right - 2, box.top + box.height / 2);
        return hit !== null && button.contains(hit);
      }),
    ).toBe(true);
    await page.mouse.click(
      currentTriggerBox.x + currentTriggerBox.width - 2,
      currentTriggerBox.y + currentTriggerBox.height / 2,
    );
    await expect(input).toBeFocused();
    await expect(input).toHaveAttribute('aria-expanded', 'true');
    const listbox = page.getByRole('listbox');
    await expect(listbox).toBeVisible();
    const controlledId = await input.getAttribute('aria-controls');
    if (!controlledId) {
      throw new Error('Expected the open MultiSelect input to identify its listbox');
    }
    await expect(listbox).toHaveAttribute('id', controlledId);

    const [controlBox, listboxBox] = await Promise.all([
      control.boundingBox(),
      listbox.boundingBox(),
    ]);
    if (!controlBox || !listboxBox) {
      throw new Error('Expected the MultiSelect control and listbox to have layout boxes');
    }
    expect(Math.abs(listboxBox.x - controlBox.x)).toBeLessThanOrEqual(2);
    expect(listboxBox.y).toBeGreaterThanOrEqual(controlBox.y + controlBox.height - 2);

    await page.keyboard.press('Escape');
    await expect(input).toHaveAttribute('aria-expanded', 'false');
    await expect(listbox).toBeHidden();
  }
});

test('keeps a custom tag inside an ultra-narrow control without rewriting its internals', async ({
  page,
}) => {
  await page.goto('/iframe.html?id=inputs-multiselect--ultra-narrow-custom-tag&viewMode=story');

  const root = page.getByTestId('multi-select-custom-40');
  const input = page.getByRole('combobox', { name: '40 pixel custom frameworks' });
  const customTag = page.getByRole('button', { name: 'Remove React' });
  const control = input.locator('..');

  await expect(customTag).toBeVisible();
  expect(await root.evaluate((element) => element.scrollWidth <= element.clientWidth + 1)).toBe(
    true,
  );

  const [controlBox, customTagBox] = await Promise.all([
    control.boundingBox(),
    customTag.boundingBox(),
  ]);
  if (!controlBox || !customTagBox) {
    throw new Error('Expected the custom tag and MultiSelect control to have layout boxes');
  }
  expect(customTagBox.x).toBeGreaterThanOrEqual(controlBox.x - 1);
  expect(customTagBox.x + customTagBox.width).toBeLessThanOrEqual(
    controlBox.x + controlBox.width + 1,
  );

  await customTag.click();
  await expect(customTag).toBeHidden();
  await expect(input).toBeFocused();
});

test('keeps constrained tags removable while preserving a usable combobox', async ({ page }) => {
  await page.goto('/iframe.html?id=inputs-multiselect--constrained-tags&viewMode=story');

  const root = page.getByTestId('multi-select-160');
  const input = page.getByRole('combobox', { name: 'Constrained frameworks' });
  const inputBox = await input.boundingBox();
  expect(inputBox?.width).toBeGreaterThan(0);
  expect(await root.evaluate((element) => element.scrollWidth <= element.clientWidth + 1)).toBe(
    true,
  );

  await input.fill('sve');
  await expect(input).toHaveValue('sve');
  const removeButton = page.getByRole('button', { name: 'Remove React' });
  await expect(removeButton).toBeVisible();
  await removeButton.focus();
  await expect(removeButton).toBeFocused();
  await expect(page).toHaveScreenshot('multi-select-constrained-tag-focus.png');
  await removeButton.click();
  await expect(removeButton).toBeHidden();
});
