import { expect, test } from '@playwright/test';
import { testVisualStories } from '@/components/e2e/visualSpecUtils';

const getFocusShadowClearance = (input: HTMLElement) => {
  const shadowLengths =
    getComputedStyle(input)
      .boxShadow.match(/-?(?:\d*\.)?\d+px/g)
      ?.map(Number.parseFloat) ?? [];
  return Math.max(0, ...shadowLengths);
};

testVisualStories({
  componentId: 'inputs-otpinput',
  snapshotPrefix: 'otp-input',
  title: 'OTPInput',
  stories: [{ name: 'Default', story: 'default' }],
});

test('long OTP uses local scrolling and reveals the focused segment', async ({ page }) => {
  await page.goto('/iframe.html?id=inputs-otpinput--narrow-container&viewMode=story');

  const container = page.getByLabel('Constrained OTP container');
  const group = page.getByRole('group', { name: 'Constrained verification code' });
  const inputs = group.getByRole('textbox');
  await expect(inputs).toHaveCount(8);

  expect(await group.evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(true);
  expect(
    await container.evaluate((element) => element.scrollWidth <= element.clientWidth + 1),
  ).toBe(true);

  await inputs.last().focus();
  await expect.poll(() => group.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);
  await expect
    .poll(() => inputs.last().evaluate(getFocusShadowClearance))
    .toBeGreaterThanOrEqual(0.99);
  const [groupBox, inputBox, focusClearance] = await Promise.all([
    group.boundingBox(),
    inputs.last().boundingBox(),
    inputs.last().evaluate(getFocusShadowClearance),
  ]);
  expect(groupBox).not.toBeNull();
  expect(inputBox).not.toBeNull();
  expect(focusClearance).toBeGreaterThan(0);
  expect(inputBox!.x + inputBox!.width + focusClearance).toBeLessThanOrEqual(
    groupBox!.x + groupBox!.width + 0.1,
  );
});

test('RTL arrows reveal the visually adjacent segment with focus clearance', async ({ page }) => {
  await page.goto('/iframe.html?id=inputs-otpinput--narrow-rtl&viewMode=story');
  const container = page.getByLabel('Constrained RTL OTP container');
  const group = page.getByRole('group', { name: 'Constrained RTL verification code' });
  const inputs = group.getByRole('textbox');
  await expect(inputs).toHaveCount(8);
  expect(await group.evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(true);
  expect(
    await container.evaluate((element) => element.scrollWidth <= element.clientWidth + 1),
  ).toBe(true);

  const first = inputs.first();
  const last = inputs.last();
  await first.focus();
  const lastBefore = await last.boundingBox();
  for (let index = 1; index < 8; index += 1) {
    await page.keyboard.press('ArrowLeft');
  }
  await expect(last).toBeFocused();
  await expect.poll(() => last.evaluate(getFocusShadowClearance)).toBeGreaterThanOrEqual(0.99);

  const lastAfter = await last.boundingBox();
  expect(lastBefore).not.toBeNull();
  expect(lastAfter).not.toBeNull();
  expect(Math.abs(lastAfter!.x - lastBefore!.x)).toBeGreaterThan(1);

  const focusMetrics = await last.evaluate((input) => {
    const viewport = input.closest<HTMLElement>('[role="group"]');
    if (!viewport) throw new Error('Expected OTPInput group');

    const inputRect = input.getBoundingClientRect();
    const viewportRect = viewport.getBoundingClientRect();
    const viewportStyle = getComputedStyle(viewport);
    const inputStyle = getComputedStyle(input);
    const shadowLengths =
      inputStyle.boxShadow.match(/-?(?:\d*\.)?\d+px/g)?.map(Number.parseFloat) ?? [];
    const ringClearance = Math.max(0, ...shadowLengths);

    return {
      left: inputRect.left - viewportRect.left - ringClearance,
      right: viewportRect.right - inputRect.right - ringClearance,
      ringClearance,
      paddingInlineEnd: Number.parseFloat(viewportStyle.paddingInlineEnd),
      paddingInlineStart: Number.parseFloat(viewportStyle.paddingInlineStart),
    };
  });

  expect(focusMetrics.ringClearance).toBeGreaterThan(0);
  expect(focusMetrics.paddingInlineStart).toBeGreaterThanOrEqual(focusMetrics.ringClearance);
  expect(focusMetrics.paddingInlineEnd).toBeGreaterThanOrEqual(focusMetrics.ringClearance);
  expect(focusMetrics.left).toBeGreaterThanOrEqual(-0.1);
  expect(focusMetrics.right).toBeGreaterThanOrEqual(-0.1);
});
