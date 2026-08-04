import { expect, test } from '@playwright/test';

test('open height animation follows nested state changes', async ({ page }) => {
  await page.goto('/iframe.html?id=animations-collapsetransition--dynamic-content&viewMode=story');

  const collapse = page.getByTestId('dynamic-collapse');
  await expect(collapse).toBeVisible();

  const initialSize = await collapse.evaluate((element) => ({
    clientHeight: element.clientHeight,
    scrollHeight: element.scrollHeight,
  }));
  expect(initialSize.clientHeight).toBe(initialSize.scrollHeight);

  await page.getByRole('button', { name: 'Add nested content' }).click();

  await expect
    .poll(() =>
      collapse.evaluate(
        (element, initialScrollHeight) =>
          element.scrollHeight > initialScrollHeight &&
          element.clientHeight === element.scrollHeight,
        initialSize.scrollHeight,
      ),
    )
    .toBe(true);

  const expandedSize = await collapse.evaluate((element) => ({
    clientHeight: element.clientHeight,
    scrollHeight: element.scrollHeight,
  }));
  expect(expandedSize.scrollHeight).toBeGreaterThan(initialSize.scrollHeight);
  expect(expandedSize.clientHeight).toBe(expandedSize.scrollHeight);

  await page.getByRole('button', { name: 'Toggle dynamic region' }).click();
  await expect(collapse).toHaveAttribute('aria-hidden', 'true');
  await expect.poll(() => collapse.evaluate((element) => element.clientHeight)).toBe(0);

  await page.getByRole('button', { name: 'Toggle dynamic region' }).click();
  await expect(collapse).toHaveAttribute('aria-hidden', 'false');
  await expect
    .poll(() =>
      collapse.evaluate(
        (element, expectedScrollHeight) =>
          element.scrollHeight === expectedScrollHeight &&
          element.clientHeight === element.scrollHeight,
        expandedSize.scrollHeight,
      ),
    )
    .toBe(true);

  await page.getByRole('button', { name: 'Remove nested content' }).click();
  await expect
    .poll(() =>
      collapse.evaluate(
        (element, initialScrollHeight) =>
          element.scrollHeight === initialScrollHeight &&
          element.clientHeight === element.scrollHeight,
        initialSize.scrollHeight,
      ),
    )
    .toBe(true);
});

test('height animation follows content changes in its owner iframe', async ({ page }) => {
  await page.goto(
    '/iframe.html?id=animations-collapsetransition--iframe-dynamic-content&viewMode=story',
  );

  const parentScroll = await page.evaluate(() => ({ x: window.scrollX, y: window.scrollY }));
  const frame = page.frameLocator('iframe[title="Collapse owner document"]');
  const collapse = frame.getByTestId('iframe-dynamic-collapse');
  await expect(collapse).toBeVisible();

  const initialHeight = await collapse.evaluate((element) => element.scrollHeight);
  await frame.getByRole('button', { name: 'Add nested content' }).click();

  await expect
    .poll(() =>
      collapse.evaluate(
        (element, previousHeight) =>
          element.scrollHeight > previousHeight && element.clientHeight === element.scrollHeight,
        initialHeight,
      ),
    )
    .toBe(true);

  const expandedHeight = await collapse.evaluate((element) => element.scrollHeight);
  await page.getByRole('button', { name: 'Toggle iframe region' }).click();
  await expect.poll(() => collapse.evaluate((element) => element.clientHeight)).toBe(0);

  await page.getByRole('button', { name: 'Toggle iframe region' }).click();
  await expect
    .poll(() =>
      collapse.evaluate(
        (element, expectedHeight) =>
          element.scrollHeight === expectedHeight && element.clientHeight === element.scrollHeight,
        expandedHeight,
      ),
    )
    .toBe(true);
  expect(await page.evaluate(() => ({ x: window.scrollX, y: window.scrollY }))).toEqual(
    parentScroll,
  );
});

test('reduced motion keeps dynamic content at its natural height', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/iframe.html?id=animations-collapsetransition--dynamic-content&viewMode=story');

  const collapse = page.getByTestId('dynamic-collapse');
  const initialHeight = await collapse.evaluate((element) => element.scrollHeight);
  await page.getByRole('button', { name: 'Add nested content' }).click();

  await expect
    .poll(() =>
      collapse.evaluate(
        (element, previousHeight) =>
          element.scrollHeight > previousHeight && element.clientHeight === element.scrollHeight,
        initialHeight,
      ),
    )
    .toBe(true);
});
