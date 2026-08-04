import { expect, test } from '@playwright/test';
import { expectNoHorizontalOverflow, testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  componentId: 'inputs-searchinput',
  snapshotPrefix: 'search-input',
  title: 'SearchInput',
  stories: [{ name: 'Default', story: 'default' }],
});

const getSearchMetrics = async (page: import('@playwright/test').Page, placeholder: string) => {
  const input = page.getByPlaceholder(placeholder);

  await expect(input).toBeVisible({ timeout: 60_000 });

  return input.evaluate((node) => {
    const fieldNode = node.parentElement;
    const leftSvg = fieldNode?.querySelector('[data-placement="start"] svg');
    const clearButton = fieldNode?.querySelector('[data-placement="end"] button');
    const styles = window.getComputedStyle(node);
    const inputRect = node.getBoundingClientRect();
    const leftRect = leftSvg?.getBoundingClientRect();
    const clearRect = clearButton?.getBoundingClientRect();

    return {
      inputLeft: inputRect.left,
      inputRight: inputRect.right,
      leftIconRight: leftRect?.right ?? null,
      clearButtonLeft: clearRect?.left ?? null,
      paddingLeft: Number.parseFloat(styles.paddingLeft),
      paddingRight: Number.parseFloat(styles.paddingRight),
    };
  });
};

test.describe('SearchInput visual layout', () => {
  test.setTimeout(90_000);

  test('keeps search icon and clear action inside the padded input area', async ({ page }) => {
    await page.goto('/iframe.html?id=inputs-searchinput--states&viewMode=story');

    const metrics = await getSearchMetrics(page, 'Filled search');

    expect(metrics.leftIconRight).not.toBeNull();
    expect(metrics.clearButtonLeft).not.toBeNull();
    expect(metrics.leftIconRight!).toBeLessThanOrEqual(metrics.inputLeft + metrics.paddingLeft);
    expect(metrics.clearButtonLeft!).toBeGreaterThanOrEqual(
      metrics.inputRight - metrics.paddingRight,
    );
  });
});

test('progressively removes colliding adornments while preserving search input focus', async ({
  page,
}) => {
  await page.goto('/iframe.html?id=inputs-searchinput--ultra-narrow-rtl&viewMode=story');

  const narrow = page.getByRole('searchbox', { name: 'Narrow RTL search' });
  const narrowRoot = narrow.locator('../..');
  const clear = narrowRoot.getByRole('button', { name: 'Clear search' });
  await expect(narrowRoot.locator('[data-placement="start"]')).toBeHidden();
  await expect(clear).toBeVisible();

  const [rootBox, clearBox] = await Promise.all([narrowRoot.boundingBox(), clear.boundingBox()]);
  expect(rootBox).not.toBeNull();
  expect(clearBox).not.toBeNull();
  expect(clearBox!.width).toBeGreaterThanOrEqual(24);
  expect(clearBox!.x).toBeGreaterThanOrEqual(rootBox!.x - 1);
  expect(clearBox!.x + clearBox!.width).toBeLessThanOrEqual(rootBox!.x + rootBox!.width + 1);
  await clear.click();
  await expect(narrow).toBeFocused();

  const ultra = page.getByRole('searchbox', { name: 'Ultra narrow search' });
  const ultraRoot = ultra.locator('../..');
  const ultraElements = ultraRoot.locator('[data-input-group-element]');
  await expect(ultraElements).toHaveCount(2);
  await expect(ultraElements.first()).toBeHidden();
  await expect(ultraElements.last()).toBeHidden();
  await ultra.fill('x');
  await expect(ultra).toHaveValue('x');
  await expectNoHorizontalOverflow(page);
});
