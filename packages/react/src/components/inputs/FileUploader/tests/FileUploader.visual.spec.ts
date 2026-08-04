import { test, expect } from '@playwright/test';
import { expectNoHorizontalOverflow, testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  componentId: 'inputs-fileuploader',
  snapshotPrefix: 'file-uploader',
  title: 'FileUploader',
  stories: [{ name: 'Default', story: 'default' }],
});

test('narrow RTL content stays within the uploader and viewport', async ({ page }) => {
  await page.setViewportSize({ width: 240, height: 480 });
  await page.goto('/iframe.html?id=inputs-fileuploader--narrow-rtl-long-content&viewMode=story');

  const uploader = page.getByRole('button', {
    name: 'VeryLongUploadInstructionWithoutAnyNaturalBreakOpportunities',
  });
  const list = page.getByRole('list');
  await expect(uploader).toBeVisible();
  await expect(list).toBeVisible();
  await expectNoHorizontalOverflow(page);
  expect(await uploader.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(
    true,
  );
  expect(await list.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
});

test('keyboard-focused drop zone has a visible focus ring', async ({ page }) => {
  await page.goto('/iframe.html?id=inputs-fileuploader--default&viewMode=story');

  const zone = page.getByRole('button', { name: 'Upload relevant documents' });
  const root = zone.locator('..');
  expect((await root.boundingBox())!.width).toBeGreaterThanOrEqual(280);
  expect(await root.evaluate((element) => element.scrollWidth <= element.clientWidth + 1)).toBe(
    true,
  );
  for (let attempt = 0; attempt < 8; attempt += 1) {
    if (await zone.evaluate((element) => element === element.ownerDocument.activeElement)) break;
    await page.keyboard.press('Tab');
  }
  await expect(zone).toBeFocused();
  await expect(zone).toHaveCSS('outline-style', 'solid');
});

test('128px and 64px uploaders preserve file information and removal controls', async ({
  page,
}) => {
  await page.goto('/iframe.html?id=inputs-fileuploader--constrained-widths&viewMode=story');

  const imageAt128 = page.getByTestId('file-uploader-image-128');
  const documentAt128Rtl = page.getByTestId('file-uploader-document-128-rtl');
  const imageAt64 = page.getByTestId('file-uploader-image-64');
  const documentAt64Rtl = page.getByTestId('file-uploader-document-64-rtl');

  for (const constrainedCase of [imageAt128, documentAt128Rtl, imageAt64, documentAt64Rtl]) {
    const list = constrainedCase.getByRole('list');
    const item = constrainedCase.getByRole('listitem');
    const root = list.locator('..');

    await expect(list).toBeVisible();
    await expect(item).toHaveCSS('display', 'grid');
    await expect(root).toHaveCSS('container-name', 'file-uploader');
    await expect(item).toHaveCSS('overflow', 'visible');
    expect(await root.evaluate((element) => element.scrollWidth <= element.clientWidth + 1)).toBe(
      true,
    );
  }

  await expect(imageAt128.locator('img')).toBeAttached();
  await expect(imageAt128.locator('img')).toBeHidden();
  await expect(documentAt128Rtl.getByRole('listitem').getByText('📄')).toBeHidden();
  await expect(imageAt64.locator('img')).toBeAttached();
  await expect(imageAt64.locator('img')).toBeHidden();
  await expect(documentAt64Rtl.getByRole('listitem').getByText('📄')).toBeHidden();

  expect(
    await imageAt128.getByRole('listitem').evaluate((element) => {
      return getComputedStyle(element).gridTemplateColumns.split(' ').length;
    }),
  ).toBe(2);
  expect(
    await imageAt64.getByRole('listitem').evaluate((element) => {
      return getComputedStyle(element).gridTemplateColumns.split(' ').length;
    }),
  ).toBe(1);
  await expect(documentAt64Rtl.getByRole('listitem')).toHaveCSS('direction', 'rtl');

  const rtlRemove = documentAt64Rtl.getByRole('button', {
    name: 'Remove document-at-64-pixels.pdf',
  });
  for (let attempt = 0; attempt < 16; attempt += 1) {
    if (await rtlRemove.evaluate((element) => element === element.ownerDocument.activeElement))
      break;
    await page.keyboard.press('Tab');
  }
  await expect(rtlRemove).toBeFocused();
  await expect(rtlRemove).toHaveCSS('outline-style', 'solid');

  await imageAt64.getByRole('button', { name: 'Remove image-at-64-pixels.png' }).click();
  await expect(imageAt64.getByRole('list')).toHaveCount(0);
  await expectNoHorizontalOverflow(page);
});
