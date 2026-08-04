import { test, expect } from '@playwright/test';
import { expectNoHorizontalOverflow, testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  componentId: 'navigation-stepper',
  snapshotPrefix: 'stepper',
  title: 'Stepper',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'Completed', story: 'completed' },
    { name: 'Vertical', story: 'vertical' },
    { name: 'With Content', story: 'with-content' },
  ],
});

test.describe('Stepper Interaction Visual Regression', () => {
  test('Default interaction matches snapshot', async ({ page }) => {
    await page.goto('/iframe.html?id=navigation-stepper--default&viewMode=story');
    await page.getByRole('button', { name: /step 2/i }).click();
    await expect(page).toHaveScreenshot('stepper-step-2-active.png');
  });

  test('Focusable step keeps its focus ring inside the horizontal scroll area', async ({
    page,
  }) => {
    await page.goto('/iframe.html?id=navigation-stepper--default&viewMode=story');
    const step = page.getByRole('button', { name: /step 2/i });
    await step.focus();
    await expect(step).toBeFocused();
    await expect(page).toHaveScreenshot('stepper-step-focus.png');
  });

  test('Default story does not overflow on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/iframe.html?id=navigation-stepper--default&viewMode=story');
    await page.locator('#storybook-root').evaluate((root) => {
      root.style.width = '100%';
      root.style.minWidth = '0';
    });

    await expect(page.getByRole('group')).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });

  test('narrow horizontal steppers preserve full wrapped labels in LTR and RTL', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 844 });
    await page.goto('/iframe.html?id=navigation-stepper--narrow-and-rtl&viewMode=story');

    const groups = page.getByRole('group');
    await expect(groups).toHaveCount(2);
    await expectNoHorizontalOverflow(page);

    const horizontal = groups.first();
    expect(await horizontal.evaluate((node) => node.scrollWidth > node.clientWidth)).toBe(false);
    expect((await horizontal.boundingBox())?.width).toBeCloseTo(240, 0);
    expect(
      await horizontal
        .locator('[data-stepper-layout]')
        .evaluate((node) => getComputedStyle(node).flexDirection),
    ).toBe('column');

    const rtl = groups.nth(1);
    expect(await rtl.evaluate((node) => getComputedStyle(node).direction)).toBe('rtl');
    expect(await rtl.evaluate((node) => node.scrollWidth > node.clientWidth)).toBe(false);
    expect(
      await rtl
        .locator('[data-stepper-layout]')
        .evaluate((node) => getComputedStyle(node).flexDirection),
    ).toBe('column');

    const buttons = await page.getByRole('button').all();
    for (const button of buttons) {
      const box = await button.boundingBox();
      expect(box?.height).toBeGreaterThanOrEqual(24);
    }

    for (const text of [
      'بيانات الحساب الطويلة جدًا',
      'وصف طويل يلتف في المساحة الضيقة',
      'averylongunbrokensteptitle',
      'averylongunbrokendescription',
    ]) {
      const label = page.getByText(text);
      const metrics = await label.evaluate((node) => {
        const style = getComputedStyle(node);
        return {
          clientHeight: node.clientHeight,
          clientWidth: node.clientWidth,
          overflow: style.overflow,
          overflowWrap: style.overflowWrap,
          scrollHeight: node.scrollHeight,
          scrollWidth: node.scrollWidth,
          textOverflow: style.textOverflow,
          whiteSpace: style.whiteSpace,
        };
      });
      expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.clientWidth + 1);
      expect(metrics.scrollHeight).toBeLessThanOrEqual(metrics.clientHeight + 1);
      expect(metrics.whiteSpace).toBe('normal');
      expect(metrics.overflowWrap).toBe('anywhere');
      expect(metrics.overflow).toBe('visible');
      expect(metrics.textOverflow).toBe('clip');
    }

    const rtlButtons = await rtl.getByRole('button', { disabled: false }).all();
    for (const button of rtlButtons) {
      await button.focus();
      await expect(button).toBeFocused();
      const [rootBox, buttonBox] = await Promise.all([rtl.boundingBox(), button.boundingBox()]);
      expect(rootBox).not.toBeNull();
      expect(buttonBox).not.toBeNull();
      expect(buttonBox!.x).toBeGreaterThanOrEqual(rootBox!.x - 1);
      expect(buttonBox!.x + buttonBox!.width).toBeLessThanOrEqual(rootBox!.x + rootBox!.width + 1);
      await expect(button).toHaveCSS('outline-offset', '-2px');
    }
  });
});
