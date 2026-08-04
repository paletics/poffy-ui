import { expect, test } from '@playwright/test';
import { expectNoHorizontalOverflow, testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  componentId: 'inputs-select',
  snapshotPrefix: 'select',
  title: 'Select',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'Sizes', story: 'sizes' },
    { name: 'Variants', story: 'variants' },
    { name: 'States', story: 'states' },
  ],
});

test('native selects retain their intrinsic fallback and adapt decorations at narrow widths', async ({
  page,
}) => {
  await page.goto('/iframe.html?id=inputs-select--constrained-widths&viewMode=story');

  const paddingInlineEndByName = new Map<string, number>();
  for (const name of [
    '40 pixel native select',
    '64 pixel RTL native select',
    '65 pixel native select',
    '112 pixel native select',
    '113 pixel native select',
    '112 pixel multiple select',
  ]) {
    const select = page.getByRole(name.includes('multiple') ? 'listbox' : 'combobox', { name });
    const geometry = await select.evaluate((element) => {
      const root = element.parentElement;
      const icon = element.nextElementSibling as HTMLElement | null;
      const rootBox = root?.getBoundingClientRect();
      const fieldBox = element.getBoundingClientRect();
      const styles = getComputedStyle(element);
      return {
        containIntrinsicInlineSize: root ? getComputedStyle(root).containIntrinsicInlineSize : '',
        rootWidth: rootBox?.width,
        fieldInside:
          Boolean(rootBox) &&
          fieldBox.left >= rootBox!.left - 1 &&
          fieldBox.right <= rootBox!.right + 1,
        fieldHeight: fieldBox.height,
        iconDisplay: icon ? getComputedStyle(icon).display : null,
        paddingInlineEnd: Number.parseFloat(styles.paddingInlineEnd),
        textOverflow: styles.textOverflow,
      };
    });
    paddingInlineEndByName.set(name, geometry.paddingInlineEnd);

    expect(geometry.containIntrinsicInlineSize).toBe('256px');
    expect(geometry.rootWidth).toBe(Number.parseInt(name, 10));
    expect(geometry.fieldInside).toBe(true);
    expect(geometry.iconDisplay).toBe(
      name.includes('multiple') ? null : /^(40|64) /.test(name) ? 'none' : 'flex',
    );
    expect(geometry.textOverflow).toBe(name.includes('multiple') ? 'clip' : 'ellipsis');
  }
  expect(paddingInlineEndByName.get('112 pixel multiple select')!).toBeLessThan(
    paddingInlineEndByName.get('112 pixel native select')!,
  );
  expect(
    await page
      .getByRole('listbox', { name: '112 pixel multiple select' })
      .evaluate((element) => element.getBoundingClientRect().height),
  ).toBeGreaterThan(44);

  await expectNoHorizontalOverflow(page);
});
