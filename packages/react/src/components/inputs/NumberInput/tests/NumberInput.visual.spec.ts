import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {
  expectNoHorizontalOverflow,
  testStoriesDoNotOverflowOnMobile,
} from '@/components/e2e/visualSpecUtils';

test.describe('NumberInput Visual Regression', () => {
  test('Default render matches snapshot', async ({ page }) => {
    await page.goto('/iframe.html?id=inputs-numberinput--default&viewMode=story');
    const input = page.getByRole('spinbutton');
    const root = input.locator('..');

    await expect(input).toBeVisible();
    await expect(root).toHaveScreenshot('number-input-default-component.png');
  });

  test('Sizes matches snapshot', async ({ page }) => {
    await page.goto('/iframe.html?id=inputs-numberinput--sizes&viewMode=story');
    await expect(page.getByRole('spinbutton').first()).toBeVisible();
    await expect(page).toHaveScreenshot('number-input-sizes.png');
  });

  test('Appearances matches snapshot', async ({ page }) => {
    await page.goto('/iframe.html?id=inputs-numberinput--appearances&viewMode=story');
    await expect(page.getByRole('spinbutton').first()).toBeVisible();
    await expect(page).toHaveScreenshot('number-input-appearances.png');
  });

  for (const story of ['error-state', 'disabled-and-read-only']) {
    test(`${story} matches snapshot`, async ({ page }) => {
      await page.goto(`/iframe.html?id=inputs-numberinput--${story}&viewMode=story`);
      await expect(page.getByRole('spinbutton').first()).toBeVisible();
      await expect(page).toHaveScreenshot(`number-input-${story}.png`);
    });
  }

  test('Stepper interaction remains visually aligned', async ({ page }) => {
    await page.goto('/iframe.html?id=inputs-numberinput--default&viewMode=story');
    const input = page.getByRole('spinbutton');
    const root = input.locator('..');
    const increment = page.getByRole('button', { name: 'Increment' });
    const decrement = page.getByRole('button', { name: 'Decrement' });

    await expect(input).toHaveValue('10');
    await increment.click();
    await expect(input).toHaveValue('11');
    await decrement.click();
    await expect(input).toHaveValue('10');
    await expect(root).toHaveScreenshot('number-input-stepper-interaction-component.png');
  });

  test('stepper focus rings stay inside the clipped group', async ({ page }) => {
    await page.goto('/iframe.html?id=inputs-numberinput--default&viewMode=story');
    const root = page.getByRole('spinbutton').locator('..');
    const increment = page.getByRole('button', { name: 'Increment' });
    const decrement = page.getByRole('button', { name: 'Decrement' });

    await increment.focus();
    await expect(increment).toBeFocused();
    await expect(root).toHaveScreenshot('number-input-stepper-increment-focus-component.png');

    await decrement.focus();
    await expect(decrement).toBeFocused();
    await expect(root).toHaveScreenshot('number-input-stepper-decrement-focus-component.png');
  });

  test('should pass accessibility compliance', async ({ page }) => {
    await page.goto('/iframe.html?id=inputs-numberinput--default&viewMode=story');
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  test('minimum steppers keep 24px targets and logical RTL corners', async ({ page }) => {
    await page.goto('/iframe.html?id=inputs-numberinput--minimum-targets-and-rtl&viewMode=story');

    const input = page.getByRole('spinbutton', { name: '数量' });
    const increment = page.getByRole('button', { name: '増やす' });
    const decrement = page.getByRole('button', { name: '減らす' });
    const root = input.locator('..');
    const stepperGroup = increment.locator('..');
    const metrics = await input.evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        direction: style.direction,
        leftRadius: Number.parseFloat(style.borderTopLeftRadius),
        rightRadius: Number.parseFloat(style.borderTopRightRadius),
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      };
    });

    expect(metrics.direction).toBe('rtl');
    expect(metrics.leftRadius).toBe(0);
    expect(metrics.rightRadius).toBeGreaterThan(0);
    expect((await increment.boundingBox())!.height).toBeGreaterThanOrEqual(24);
    expect((await decrement.boundingBox())!.height).toBeGreaterThanOrEqual(24);
    const rootBox = (await root.boundingBox())!;
    const inputBox = (await input.boundingBox())!;
    const groupBox = (await stepperGroup.boundingBox())!;
    const groupRadii = await stepperGroup.evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        leftRadius: Number.parseFloat(style.borderTopLeftRadius),
        rightRadius: Number.parseFloat(style.borderTopRightRadius),
      };
    });
    expect(inputBox.x).toBeGreaterThan(groupBox.x);
    expect(groupBox.x).toBeGreaterThanOrEqual(rootBox.x - 1);
    expect(groupRadii.leftRadius).toBeGreaterThan(0);
    expect(groupRadii.rightRadius).toBe(0);
    expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.clientWidth);
  });

  test('narrow and threshold-adjacent containers retain stepping, input, and containment', async ({
    page,
  }) => {
    await page.goto('/iframe.html?id=inputs-numberinput--constrained-widths&viewMode=story');

    const cases = [
      { label: '40 pixel LTR quantity', width: 40, value: '8' },
      { label: '64 pixel LTR quantity', width: 64, value: '8' },
      { label: '65 pixel LTR quantity', width: 65, value: '10' },
      { label: '97 pixel LTR quantity', width: 97, value: '10' },
      { label: '113 pixel LTR quantity', width: 113, value: '10' },
      { label: '40 pixel RTL quantity', width: 40, value: '8' },
      { label: '64 pixel RTL quantity', width: 64, value: '8' },
    ];

    for (const testCase of cases) {
      const input = page.getByRole('spinbutton', { name: testCase.label });
      const root = input.locator('..');
      const increment = root.getByRole('button', { name: 'Increment' });
      const decrement = root.getByRole('button', { name: 'Decrement' });

      await expect(input).toBeVisible();
      await expect(input).toHaveValue(testCase.value);

      const rootBox = (await root.boundingBox())!;
      const inputBox = (await input.boundingBox())!;
      const incrementBox = (await increment.boundingBox())!;
      const decrementBox = (await decrement.boundingBox())!;
      const valueFits = await input.evaluate(
        (element) => element.scrollWidth <= element.clientWidth + 1,
      );

      expect(rootBox.width).toBeLessThanOrEqual(testCase.width + 1);
      expect(inputBox.width).toBeGreaterThan(0);
      expect(valueFits, testCase.label).toBe(true);
      expect(incrementBox.width).toBeGreaterThanOrEqual(24);
      expect(decrementBox.width).toBeGreaterThanOrEqual(24);
      expect(incrementBox.height).toBeGreaterThanOrEqual(24);
      expect(decrementBox.height).toBeGreaterThanOrEqual(24);

      for (const childBox of [inputBox, incrementBox, decrementBox]) {
        expect(childBox.x).toBeGreaterThanOrEqual(rootBox.x - 1);
        expect(childBox.x + childBox.width).toBeLessThanOrEqual(rootBox.x + rootBox.width + 1);
        expect(childBox.y).toBeGreaterThanOrEqual(rootBox.y - 1);
        expect(childBox.y + childBox.height).toBeLessThanOrEqual(rootBox.y + rootBox.height + 1);
      }

      await increment.click();
      await expect(input).toHaveValue(String(Number(testCase.value) + 1));
      await decrement.click();
      await expect(input).toHaveValue(testCase.value);
    }

    const keyboardInput = page.getByRole('spinbutton', { name: '40 pixel RTL quantity' });
    await keyboardInput.focus();
    await keyboardInput.press('ArrowUp');
    await expect(keyboardInput).toHaveValue('9');
    await keyboardInput.press('ArrowDown');
    await expect(keyboardInput).toHaveValue('8');

    const pageMetrics = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(pageMetrics.scrollWidth).toBeLessThanOrEqual(pageMetrics.clientWidth);
  });
});

testStoriesDoNotOverflowOnMobile({
  componentId: 'inputs-numberinput',
  title: 'NumberInput',
  stories: [
    { name: 'Sizes', story: 'sizes' },
    { name: 'Appearances', story: 'appearances' },
    { name: 'Error state', story: 'error-state' },
  ],
});

test('size galleries do not overflow on tablet', async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 900 });

  for (const story of ['sizes', 'appearances', 'error-state']) {
    await page.goto(`/iframe.html?id=inputs-numberinput--${story}&viewMode=story`);
    await expect(page.getByRole('spinbutton').first()).toBeVisible();
    await expectNoHorizontalOverflow(page);
  }
});
