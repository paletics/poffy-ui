import { test, expect } from '@playwright/test';
import { expectNoHorizontalOverflow, testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  componentId: 'navigation-pagination',
  snapshotPrefix: 'pagination',
  title: 'Pagination',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'Many Pages', story: 'many-pages' },
    { name: 'Small', story: 'small' },
  ],
});

test.describe('Pagination Interaction Visual Regression', () => {
  test('centers the page list when it fits the available width', async ({ page }) => {
    await page.goto('/iframe.html?id=navigation-pagination--centered-wide&viewMode=story');
    const navigation = page.getByRole('navigation', { name: 'Pagination' });
    const list = navigation.locator('ul');
    const [navigationBox, listBox] = await Promise.all([
      navigation.boundingBox(),
      list.boundingBox(),
    ]);

    expect(navigationBox).not.toBeNull();
    expect(listBox).not.toBeNull();
    const navigationCenter = navigationBox!.x + navigationBox!.width / 2;
    const listCenter = listBox!.x + listBox!.width / 2;
    expect(Math.abs(navigationCenter - listCenter)).toBeLessThanOrEqual(1);
  });

  test('page link focus ring stays inside its clipped link boundary', async ({ page }) => {
    await page.goto('/iframe.html?id=navigation-pagination--default&viewMode=story');
    const pageTwo = page.getByRole('button', { name: /go to page 2/i });

    await pageTwo.focus();
    await expect(pageTwo).toBeFocused();
    await expect(page).toHaveScreenshot('pagination-page-2-focus.png');
  });

  test('Next page interaction matches snapshot', async ({ page }) => {
    await page.goto('/iframe.html?id=navigation-pagination--default&viewMode=story');
    await page.getByRole('button', { name: /go to page 2/i }).click();
    await expect(page.locator('[aria-current="page"]')).toHaveText('2');
    await expect(page).toHaveScreenshot('pagination-page-2-active.png');
  });

  test('Many Pages story does not overflow on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/iframe.html?id=navigation-pagination--many-pages&viewMode=story');

    await expect(page.getByRole('navigation', { name: /pagination/i })).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });

  test('uses the full parent inline size on a 240px viewport', async ({ page }) => {
    await page.setViewportSize({ width: 240, height: 320 });
    await page.goto('/iframe.html?id=navigation-pagination--full-width-narrow&viewMode=story');

    const parent = page.getByTestId('pagination-full-width-parent');
    const navigation = page.getByRole('navigation', { name: 'pagination' });
    const [parentWidth, navigationWidth] = await Promise.all([
      parent.evaluate((element) => element.clientWidth),
      navigation.evaluate((element) => element.clientWidth),
    ]);

    expect(navigationWidth).toBeGreaterThanOrEqual(parentWidth - 1);
    expect(navigationWidth).toBeLessThanOrEqual(parentWidth + 1);
    expect(navigationWidth).toBeGreaterThan(176);
    await expectNoHorizontalOverflow(page);
  });

  test('localized small pagination scrolls locally in RTL with minimum targets', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 240, height: 320 });
    await page.goto('/iframe.html?id=navigation-pagination--localized-rtl&viewMode=story');

    const navigation = page.getByRole('navigation', { name: 'ページネーション' });
    await expect(navigation).toBeVisible();
    const buttons = [];
    for (const button of await navigation.getByRole('button').all()) {
      if (await button.isVisible()) buttons.push(button);
    }
    expect(buttons).toHaveLength(3);
    for (const button of buttons) {
      const box = await button.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.width).toBeGreaterThanOrEqual(24);
      expect(box!.height).toBeGreaterThanOrEqual(24);
    }
    expect(await navigation.evaluate((element) => getComputedStyle(element).direction)).toBe('rtl');
    expect(
      await navigation.locator('ol, ul').evaluate((element) => getComputedStyle(element).flexWrap),
    ).toBe('nowrap');
    await expectNoHorizontalOverflow(page);
  });

  test('long custom labels compact to the current page and one RTL direction', async ({ page }) => {
    await page.setViewportSize({ width: 240, height: 480 });
    await page.goto(
      '/iframe.html?id=navigation-pagination--constrained-long-labels-rtl&viewMode=story',
    );

    const navigation = page.getByRole('navigation', { name: 'Pagination' });
    await expect(navigation).toBeVisible();
    await expect(navigation.locator('[aria-current="page"]')).toBeVisible();
    await expect(navigation.getByRole('button', { name: 'Go to previous page' })).toBeVisible();
    await expect(navigation.getByRole('button', { name: 'Go to next page' })).not.toBeVisible();
    expect(await navigation.evaluate((element) => getComputedStyle(element).direction)).toBe('rtl');
    await expectNoHorizontalOverflow(page);

    const previous = navigation.getByRole('button', { name: 'Go to previous page' });
    await previous.focus();
    const [navigationBox, previousBox] = await Promise.all([
      navigation.boundingBox(),
      previous.boundingBox(),
    ]);
    expect(navigationBox).not.toBeNull();
    expect(previousBox).not.toBeNull();
    expect(previousBox!.x).toBeGreaterThanOrEqual(navigationBox!.x - 1);
    expect(previousBox!.x + previousBox!.width).toBeLessThanOrEqual(
      navigationBox!.x + navigationBox!.width + 1,
    );
  });
});
