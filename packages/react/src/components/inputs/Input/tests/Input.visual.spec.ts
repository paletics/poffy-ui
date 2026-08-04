import { expect, test } from '@playwright/test';
import { testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  componentId: 'inputs-input',
  snapshotPrefix: 'input',
  title: 'Input',
  stories: [{ name: 'Default', story: 'default' }],
});

const getAdornmentMetrics = async (page: import('@playwright/test').Page, placeholder: string) => {
  const input = page.getByPlaceholder(placeholder);

  await expect(input).toBeVisible({ timeout: 60_000 });
  await expect(input).toHaveCSS('transform', 'none');

  return input.evaluate((node) => {
    const groupNode = node.parentElement;
    const leftSvg = groupNode?.querySelector('[data-placement="start"] svg');
    const rightSvg = groupNode?.querySelector('[data-placement="end"] svg');
    const styles = window.getComputedStyle(node);
    const inputRect = node.getBoundingClientRect();
    const leftRect = leftSvg?.getBoundingClientRect();
    const rightRect = rightSvg?.getBoundingClientRect();

    return {
      inputLeft: inputRect.left,
      inputRight: inputRect.right,
      leftIconRight: leftRect?.right ?? null,
      rightIconLeft: rightRect?.left ?? null,
      paddingLeft: Number.parseFloat(styles.paddingLeft),
      paddingRight: Number.parseFloat(styles.paddingRight),
    };
  });
};

test.describe('Input adornment layout', () => {
  test.setTimeout(90_000);

  test('keeps both adornments inside the input padding area', async ({ page }) => {
    await page.goto('/iframe.html?id=inputs-input--adornment-sizes&viewMode=story');
    await expect(page.getByPlaceholder('Medium with icon')).toBeVisible({ timeout: 60_000 });

    await page.goto('/iframe.html?id=inputs-input--with-both-elements&viewMode=story');

    const metrics = await getAdornmentMetrics(page, 'user@example.com');

    expect(metrics.leftIconRight).not.toBeNull();
    expect(metrics.rightIconLeft).not.toBeNull();
    expect(metrics.leftIconRight!).toBeLessThanOrEqual(metrics.inputLeft + metrics.paddingLeft);
    expect(metrics.rightIconLeft!).toBeGreaterThanOrEqual(
      metrics.inputRight - metrics.paddingRight,
    );
  });

  test('keeps start adornments clear of text across sizes', async ({ page }) => {
    await page.goto('/iframe.html?id=inputs-input--adornment-sizes&viewMode=story');

    for (const placeholder of ['Small with icon', 'Medium with icon', 'Large with icon']) {
      const metrics = await getAdornmentMetrics(page, placeholder);

      expect(metrics.leftIconRight).not.toBeNull();
      expect(metrics.leftIconRight!).toBeLessThanOrEqual(metrics.inputLeft + metrics.paddingLeft);
    }
  });

  test('contains arbitrary compact adornment content in RTL', async ({ page }) => {
    await page.goto('/iframe.html?id=inputs-input--compact-long-adornment&viewMode=story');

    const input = page.getByRole('textbox', { name: 'Compact adornment input' });
    const root = input.locator('..');
    const adornments = root.locator('[data-input-group-element]');
    await expect(adornments).toHaveCount(2);

    const rootBox = await root.boundingBox();
    expect(rootBox).not.toBeNull();
    for (let index = 0; index < 2; index += 1) {
      const box = await adornments.nth(index).boundingBox();
      expect(box).not.toBeNull();
      expect(box!.x).toBeGreaterThanOrEqual(rootBox!.x - 1);
      expect(box!.x + box!.width).toBeLessThanOrEqual(rootBox!.x + rootBox!.width + 1);
      await expect(adornments.nth(index)).toHaveCSS('overflow', 'hidden');
      await expect(adornments.nth(index)).toHaveCSS('white-space', 'nowrap');
    }
    expect(await input.evaluate((node) => getComputedStyle(node).direction)).toBe('rtl');
  });
});
