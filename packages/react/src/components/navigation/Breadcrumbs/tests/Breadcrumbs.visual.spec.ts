import { expect, test } from '@playwright/test';
import { expectNoHorizontalOverflow, testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  componentId: 'navigation-breadcrumbs',
  snapshotPrefix: 'breadcrumbs',
  title: 'Breadcrumbs',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'Custom Separator', story: 'custom-separator' },
    { name: 'Background Variant', story: 'background-variant' },
  ],
});

test('long trails scroll locally without overflowing the page', async ({ page }) => {
  await page.goto('/iframe.html?id=navigation-breadcrumbs--constrained-long-trail&viewMode=story');
  const navigation = page.getByRole('navigation', { name: 'Breadcrumb' });
  await expect(navigation).toBeVisible();
  expect(await navigation.evaluate((node) => node.scrollWidth > node.clientWidth)).toBe(true);
  const current = page.getByText('UnusuallyLongCurrentPageIdentifier');
  const [initialCurrentBox, initialNavigationBox] = await Promise.all([
    current.boundingBox(),
    navigation.boundingBox(),
  ]);
  expect(initialCurrentBox).not.toBeNull();
  expect(initialNavigationBox).not.toBeNull();
  expect(initialCurrentBox!.x).toBeGreaterThanOrEqual(initialNavigationBox!.x - 1);
  expect(initialCurrentBox!.x + initialCurrentBox!.width).toBeLessThanOrEqual(
    initialNavigationBox!.x + initialNavigationBox!.width + 1,
  );
  expect(await page.evaluate(() => window.scrollY)).toBe(0);
  await expectNoHorizontalOverflow(page);
  await page.getByRole('link', { name: 'Components' }).focus();
  const linkBox = await page.getByRole('link', { name: 'Components' }).boundingBox();
  const navigationBox = await navigation.boundingBox();
  expect(linkBox).not.toBeNull();
  expect(navigationBox).not.toBeNull();
  expect(linkBox!.x + linkBox!.width).toBeLessThanOrEqual(
    navigationBox!.x + navigationBox!.width + 1,
  );
  await expect(page).toHaveScreenshot('breadcrumbs-constrained-link-focus.png');
});

test('RTL long trails reveal the current page without moving the document vertically', async ({
  page,
}) => {
  await page.goto(
    '/iframe.html?id=navigation-breadcrumbs--constrained-long-trail-rtl&viewMode=story',
  );
  const navigation = page.getByRole('navigation', { name: 'Breadcrumb' });
  const current = page.getByText('מזההדףהנוכחיהארוךבמיוחד');
  const [navigationBox, currentBox] = await Promise.all([
    navigation.boundingBox(),
    current.boundingBox(),
  ]);
  expect(navigationBox).not.toBeNull();
  expect(currentBox).not.toBeNull();
  expect(currentBox!.x).toBeGreaterThanOrEqual(navigationBox!.x - 1);
  expect(currentBox!.x + currentBox!.width).toBeLessThanOrEqual(
    navigationBox!.x + navigationBox!.width + 1,
  );
  expect(await page.evaluate(() => window.scrollY)).toBe(0);
});
