import AxeBuilder from '@axe-core/playwright';
import { testVisualStories } from '@/components/e2e/visualSpecUtils';
import { expect, test } from '@playwright/test';

testVisualStories({
  componentId: 'overlay-portal',
  snapshotPrefix: 'portal',
  title: 'Portal',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'Custom Container', story: 'custom-container' },
    { name: 'Disabled', story: 'disabled' },
  ],
});

test.describe('Portal body-level behavior', () => {
  test('body-level portalled content passes accessibility compliance', async ({ page }) => {
    await page.goto('/iframe.html?id=overlay-portal--default&viewMode=story');
    await expect(page.getByText('Portalled body content')).toBeVisible();

    const results = await new AxeBuilder({ page })
      .include('body')
      .exclude('iframe')
      .disableRules(['landmark-one-main', 'page-has-heading-one', 'region'])
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test('toggle story open state matches snapshot', async ({ page }) => {
    await page.goto('/iframe.html?id=overlay-portal--toggle&viewMode=story');
    await page.getByRole('button', { name: 'Show portal' }).click();
    await expect(page.getByText('Toggle portal content')).toBeVisible();
    await expect(page).toHaveScreenshot('portal-toggle-open.png');
  });
});

test.describe('PortalProvider browser behavior', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/iframe.html?id=overlay-portal--provider-custom-target&viewMode=story');
    await expect(page.getByText('Provider inherited portal content')).toBeVisible();
  });

  test('routes inherited and explicit portals to their respective targets', async ({ page }) => {
    const providerTarget = page.getByRole('region', { name: 'Provider portal target' });
    const explicitTarget = page.getByRole('region', { name: 'Explicit portal target' });

    await expect(providerTarget.getByText('Provider inherited portal content')).toBeVisible();
    await expect(providerTarget.getByText('Explicit override portal content')).toHaveCount(0);
    await expect(explicitTarget.getByText('Explicit override portal content')).toBeVisible();
    await expect(explicitTarget.getByText('Provider inherited portal content')).toHaveCount(0);
  });

  test('preserves nested floating portal structure and non-modal focus order', async ({ page }) => {
    const outerTrigger = page.getByRole('button', { name: 'Open provider popover' });
    await outerTrigger.click();

    const outerClose = page.getByRole('button', { name: 'Close provider popover' });
    await expect(outerClose).toBeFocused();

    await page.keyboard.press('Shift+Tab');
    await expect(outerTrigger).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(outerClose).toBeFocused();

    const nestedTrigger = page.getByRole('button', { name: 'Open nested popover' });
    await nestedTrigger.click();

    const nestedClose = page.getByRole('button', { name: 'Close nested popover' });
    await expect(nestedClose).toBeFocused();

    const outerHeading = page.getByRole('heading', { name: 'Provider popover', exact: true });
    const nestedHeading = page.getByRole('heading', {
      name: 'Nested provider popover',
      exact: true,
    });
    const nestedHeadingHandle = await nestedHeading.elementHandle();
    expect(nestedHeadingHandle).not.toBeNull();
    const isNestedPortal = await outerHeading.evaluate((outerElement, nestedElement) => {
      const outerPortal = outerElement.closest('[data-floating-ui-portal]');
      const nestedPortal = (nestedElement as Element | null)?.closest('[data-floating-ui-portal]');
      return outerPortal !== null && nestedPortal !== null && outerPortal.contains(nestedPortal);
    }, nestedHeadingHandle);
    expect(isNestedPortal).toBe(true);

    const inheritedMeasurementIsReset = await outerHeading.evaluate(
      (outerElement, nestedElement) => {
        const outerContent = outerElement.closest<HTMLElement>('.poffy-popover__content');
        const nestedContent = (nestedElement as Element | null)?.closest<HTMLElement>(
          '.poffy-popover__content',
        );
        if (!outerContent || !nestedContent) return null;

        outerContent.style.setProperty('--floating-available-width', '13px');
        nestedContent.style.removeProperty('--floating-available-width');
        const fallbackStyles = getComputedStyle(nestedContent);
        const fallbackMaxWidth = Number.parseFloat(fallbackStyles.maxWidth);
        const localAvailableWidth = fallbackStyles
          .getPropertyValue('--floating-available-width')
          .trim();

        nestedContent.style.setProperty('--floating-available-width', '0px');
        const inlineMaxWidth = getComputedStyle(nestedContent).maxWidth;

        return { fallbackMaxWidth, inlineMaxWidth, localAvailableWidth };
      },
      nestedHeadingHandle,
    );
    expect(inheritedMeasurementIsReset).not.toBeNull();
    expect(inheritedMeasurementIsReset?.localAvailableWidth).toBe('');
    expect(inheritedMeasurementIsReset?.fallbackMaxWidth).toBeGreaterThan(13);
    expect(inheritedMeasurementIsReset?.inlineMaxWidth).toBe('0px');

    await nestedClose.click();
    await expect(nestedTrigger).toBeFocused();
    await outerClose.click();
    await expect(outerTrigger).toBeFocused();
  });
});
