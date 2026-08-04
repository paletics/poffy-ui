import { expect, test } from '@playwright/test';
import { expectNoHorizontalOverflow, testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  accessibilityStory: 'default',
  componentId: 'inputs-listboxselect',
  snapshotPrefix: 'listbox-select',
  title: 'ListboxSelect',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'Sizes', story: 'sizes' },
    { name: 'States', story: 'states' },
    { name: 'Variants', story: 'variants' },
    { name: 'Placeholder', story: 'placeholder' },
  ],
});

test('selected values stay inside constrained controls and hide decoration at or below 4rem', async ({
  page,
}) => {
  await page.goto('/iframe.html?id=inputs-listboxselect--constrained-widths&viewMode=story');

  for (const name of [
    '40 pixel listbox',
    '64 pixel RTL listbox',
    '65 pixel listbox',
    '112 pixel listbox',
    '113 pixel listbox',
  ]) {
    const combobox = page.getByRole('combobox', { name });
    const geometry = await combobox.evaluate((element) => {
      const value = element.querySelector<HTMLElement>('[data-listbox-select-value]');
      const icon = element.querySelector<HTMLElement>('[data-select-icon]');
      const root = element.parentElement;
      const rootBox = root?.getBoundingClientRect();
      const fieldBox = element.getBoundingClientRect();
      const valueBox = value?.getBoundingClientRect();
      return {
        fieldInside:
          Boolean(rootBox) &&
          fieldBox.left >= rootBox!.left - 1 &&
          fieldBox.right <= rootBox!.right + 1,
        rootWidth: rootBox?.width,
        iconDisplay: icon ? getComputedStyle(icon).display : null,
        valueInside:
          Boolean(valueBox) &&
          valueBox!.left >= fieldBox.left - 1 &&
          valueBox!.right <= fieldBox.right + 1,
        valueStyles: value
          ? {
              overflow: getComputedStyle(value).overflow,
              textOverflow: getComputedStyle(value).textOverflow,
              whiteSpace: getComputedStyle(value).whiteSpace,
            }
          : null,
      };
    });

    expect(geometry.fieldInside).toBe(true);
    expect(geometry.rootWidth).toBe(Number.parseInt(name, 10));
    expect(geometry.valueInside).toBe(true);
    expect(geometry.valueStyles).toEqual({
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    });
    expect(geometry.iconDisplay).toBe(/^(40|64) /.test(name) ? 'none' : 'flex');
  }

  await expectNoHorizontalOverflow(page);
});
