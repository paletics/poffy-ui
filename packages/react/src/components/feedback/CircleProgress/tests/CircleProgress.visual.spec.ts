import AxeBuilder from '@axe-core/playwright';
import { test, expect } from '@playwright/test';
import { expectNoHorizontalOverflow } from '@/components/e2e/visualSpecUtils';

test.describe('CircleProgress Visual Regression', () => {
  test('Default render matches snapshot', async ({ page }) => {
    await page.goto('/iframe.html?id=feedback-circleprogress--default&viewMode=story');
    await expect(page.locator('#storybook-root svg')).toBeVisible();
    await expect(page).toHaveScreenshot('circle-progress-default.png');
  });

  test('Primary variant matches snapshot', async ({ page }) => {
    await page.goto('/iframe.html?id=feedback-circleprogress--primary&viewMode=story');
    await expect(page.locator('#storybook-root svg')).toBeVisible();
    await expect(page).toHaveScreenshot('circle-progress-primary.png');
  });

  test('Sizes matches snapshot', async ({ page }) => {
    await page.goto('/iframe.html?id=feedback-circleprogress--sizes&viewMode=story');
    await expect(page.locator('svg').first()).toBeVisible();
    await expect(page).toHaveScreenshot('circle-progress-sizes.png');
  });

  test('Thickness matches snapshot', async ({ page }) => {
    await page.goto('/iframe.html?id=feedback-circleprogress--thickness&viewMode=story');
    await expect(page.locator('svg').first()).toBeVisible();
    await expect(page).toHaveScreenshot('circle-progress-thickness.png');
  });

  test('With Label matches snapshot', async ({ page }) => {
    await page.goto('/iframe.html?id=feedback-circleprogress--with-label&viewMode=story');
    await expect(page.getByText('Done')).toBeVisible();
    await expect(page).toHaveScreenshot('circle-progress-with-label.png');
  });

  test('Long custom label stays within the circle', async ({ page }) => {
    await page.goto('/iframe.html?id=feedback-circleprogress--long-custom-label&viewMode=story');
    await expect(page.getByText('Processing upload request')).toBeVisible();
    await expect(page).toHaveScreenshot('circle-progress-long-custom-label.png');
  });

  test('Tiny long custom label stays within the circle', async ({ page }) => {
    await page.goto(
      '/iframe.html?id=feedback-circleprogress--tiny-long-custom-label&viewMode=story',
    );
    await expect(page.locator('#storybook-root svg')).toBeVisible();
    await expect(page).toHaveScreenshot('circle-progress-tiny-long-custom-label.png');
  });

  test('Intents match snapshot', async ({ page }) => {
    await page.goto('/iframe.html?id=feedback-circleprogress--intents&viewMode=story');
    await expect(page.locator('#storybook-root svg').first()).toBeVisible();
    await expect(page).toHaveScreenshot('circle-progress-intents.png');
  });

  test('Soft appearance reduces track emphasis', async ({ page }) => {
    await page.goto('/iframe.html?id=feedback-circleprogress--appearances&viewMode=story');
    const solidTrack = page
      .getByRole('progressbar', { name: 'Solid progress' })
      .locator('circle')
      .first();
    const softTrack = page
      .getByRole('progressbar', { name: 'Soft progress' })
      .locator('circle')
      .first();

    await expect(solidTrack).toHaveCSS('opacity', '1');
    await expect(softTrack).toHaveCSS('opacity', '0.75');
    await expect(page).toHaveScreenshot('circle-progress-appearances.png');
  });

  test('should pass accessibility compliance', async ({ page }) => {
    await page.goto('/iframe.html?id=feedback-circleprogress--default&viewMode=story');
    const results = await new AxeBuilder({ page }).include('#storybook-root').analyze();
    expect(results.violations).toEqual([]);
  });

  test('treats size as a preferred maximum without changing SVG geometry', async ({ page }) => {
    await page.goto('/iframe.html?id=feedback-circleprogress--preferred-maximum&viewMode=story');

    const narrowParent = page.getByTestId('circle-progress-narrow-parent');
    const narrowProgress = page.getByRole('progressbar', { name: 'Narrow upload progress' });
    const narrowSvg = narrowProgress.locator('svg');
    const wideProgress = page.getByRole('progressbar', { name: 'Wide upload progress' });

    await expect(narrowProgress).toBeVisible();
    await expect(narrowSvg).toHaveAttribute('width', '300');
    await expect(narrowSvg).toHaveAttribute('height', '300');
    await expect(narrowSvg).toHaveAttribute('viewBox', '0 0 300 300');

    const measure = async () =>
      narrowProgress.evaluate((root) => {
        const parent = root.parentElement;
        const svg = root.querySelector('svg');
        const label = root.querySelector('span');
        if (!parent || !svg || !label) throw new Error('Expected responsive progress markup');
        const rootRect = root.getBoundingClientRect();
        const svgRect = svg.getBoundingClientRect();
        const labelRect = label.getBoundingClientRect();
        return {
          labelInside:
            labelRect.left >= rootRect.left - 0.5 && labelRect.right <= rootRect.right + 0.5,
          parentClientWidth: parent.clientWidth,
          parentScrollWidth: parent.scrollWidth,
          rootHeight: rootRect.height,
          rootWidth: rootRect.width,
          svgHeight: svgRect.height,
          svgWidth: svgRect.width,
        };
      });

    expect(await measure()).toEqual({
      labelInside: true,
      parentClientWidth: 160,
      parentScrollWidth: 160,
      rootHeight: 160,
      rootWidth: 160,
      svgHeight: 160,
      svgWidth: 160,
    });

    await page.evaluate(() => {
      document.documentElement.dir = 'rtl';
    });
    expect(await measure()).toMatchObject({ labelInside: true, parentScrollWidth: 160 });

    await expect(wideProgress).toBeVisible();
    expect(await wideProgress.evaluate((element) => element.getBoundingClientRect().width)).toBe(
      300,
    );
    await expect(narrowParent).toBeVisible();
  });

  test('documents practical visual-label diameters without imposing a hard minimum', async ({
    page,
  }) => {
    await page.goto('/iframe.html?id=feedback-circleprogress--practical-minimum&viewMode=story');

    const compact = page.getByRole('progressbar', { name: 'Compact unlabelled progress' });
    const numeric = page.getByRole('progressbar', { name: 'Minimum numeric progress' });
    const custom = page.getByRole('progressbar', { name: 'Minimum custom-label progress' });

    await expect(numeric).toContainText('58%');
    await expect(custom).toContainText('Sync');
    await expect
      .poll(async () =>
        Promise.all(
          [compact, numeric, custom].map((item) =>
            item.evaluate((element) => element.getBoundingClientRect().width),
          ),
        ),
      )
      .toEqual([32, 48, 64]);
  });

  for (const story of [
    'sizes',
    'thickness',
    'long-custom-label',
    'tiny-long-custom-label',
    'intents',
    'preferred-maximum',
  ]) {
    test(`${story} story does not overflow on mobile`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(`/iframe.html?id=feedback-circleprogress--${story}&viewMode=story`);
      await expect(page.locator('svg').first()).toBeVisible();

      await expectNoHorizontalOverflow(page);
    });
  }
});
