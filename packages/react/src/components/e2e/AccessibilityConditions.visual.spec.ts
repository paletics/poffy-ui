import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import type { Locator } from '@playwright/test';
import { expectNoHorizontalOverflow, gotoStory } from '@/components/e2e/visualSpecUtils';

const expectInsideOwner = async (owner: Locator, elements: Locator[]) => {
  const ownerBox = await owner.boundingBox();
  expect(ownerBox).not.toBeNull();

  for (const element of elements) {
    const box = await element.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.x).toBeGreaterThanOrEqual(ownerBox!.x - 1);
    expect(box!.y).toBeGreaterThanOrEqual(ownerBox!.y - 1);
    expect(box!.x + box!.width).toBeLessThanOrEqual(ownerBox!.x + ownerBox!.width + 1);
    expect(box!.y + box!.height).toBeLessThanOrEqual(ownerBox!.y + ownerBox!.height + 1);
  }
};

const expectNoBoxOverlap = async (first: Locator, second: Locator) => {
  const [firstBox, secondBox] = await Promise.all([first.boundingBox(), second.boundingBox()]);
  expect(firstBox).not.toBeNull();
  expect(secondBox).not.toBeNull();
  const overlaps =
    firstBox!.x < secondBox!.x + secondBox!.width &&
    firstBox!.x + firstBox!.width > secondBox!.x &&
    firstBox!.y < secondBox!.y + secondBox!.height &&
    firstBox!.y + firstBox!.height > secondBox!.y;
  expect(overlaps).toBe(false);
};

test('Chromium forced-colors emulation keeps representative controls perceivable', async ({
  page,
  browserName,
}) => {
  test.skip(
    browserName !== 'chromium',
    'This forced-colors proxy is scoped to Chromium emulation.',
  );
  await page.emulateMedia({ forcedColors: 'active', reducedMotion: 'reduce' });
  await gotoStory(page, {
    componentId: 'qa-accessibility-conditions',
    story: 'forced-colors-representative',
  });

  const primaryAction = page.getByRole('button', { name: 'Save changes' });
  await primaryAction.focus();
  await expect(primaryAction).toBeFocused();
  await expect(primaryAction).toHaveCSS('outline-style', 'solid');
  expect(
    await primaryAction.evaluate((element) =>
      Number.parseFloat(getComputedStyle(element).outlineWidth),
    ),
  ).toBeGreaterThanOrEqual(2);
  const checkbox = page.getByRole('checkbox', { name: 'Include archived records' });
  const checkboxMarker = page.getByTestId('forced-colors-checkbox').locator('svg');
  await expect(checkbox).toBeChecked();
  await expect(checkboxMarker).toBeVisible();
  await expect(checkboxMarker).toHaveAttribute('stroke', 'currentColor');
  expect(
    await checkboxMarker.evaluate((element) =>
      Number.parseFloat(getComputedStyle(element).strokeWidth),
    ),
  ).toBeGreaterThan(0);
  await expect(page.getByRole('searchbox', { name: 'Search audit records' })).toBeVisible();
  await expect(page.getByRole('status')).toContainText('Review required');
  await expect(
    page
      .getByRole('progressbar', { name: 'Accessibility audit progress' })
      .locator('circle')
      .last(),
  ).toBeVisible();

  const results = await new AxeBuilder({ page })
    .include('#storybook-root')
    .disableRules(['landmark-one-main', 'page-has-heading-one', 'region'])
    .analyze();
  expect(results.violations).toEqual([]);
  await expect(page).toHaveScreenshot('accessibility-forced-colors-focus.png');
});

test('representative composition reflows at a 320px CSS viewport', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await gotoStory(page, {
    componentId: 'qa-accessibility-conditions',
    story: 'forced-colors-representative',
  });

  await expectNoHorizontalOverflow(page);
  await expect(page.getByRole('button', { name: 'Save changes' })).toBeVisible();
  await expect(page.getByRole('searchbox', { name: 'Search audit records' })).toBeVisible();
  await expect(
    page.getByRole('progressbar', { name: 'Accessibility audit progress' }),
  ).toBeVisible();
});

const textResizeStories = [
  {
    componentId: 'feedback-alert',
    story: 'practical-minimum',
    target: { name: 'Close practical alert', role: 'button' },
  },
  {
    componentId: 'inputs-multiselect',
    story: 'constrained-tags',
    target: { name: 'Constrained frameworks', role: 'combobox' },
  },
  {
    componentId: 'inputs-searchinput',
    story: 'practical-minimum',
    target: { name: 'Practical minimum search', role: 'searchbox' },
  },
  {
    componentId: 'inputs-inputgroup',
    story: 'practical-minimum',
    target: { name: 'Practical domain', role: 'textbox' },
  },
] as const;

test('practical-minimum owners contain representative text and actions at a 200% root text-size proxy', async ({
  page,
}) => {
  for (const story of textResizeStories) {
    await gotoStory(page, story);
    await page.locator('html').evaluate((element) => {
      element.style.setProperty('font-size', '200%', 'important');
    });

    await expect
      .poll(() => page.locator('html').evaluate((element) => getComputedStyle(element).fontSize))
      .toBe('32px');
    await expect(page.getByRole(story.target.role, { name: story.target.name })).toBeVisible();
    await expectNoHorizontalOverflow(page);

    if (story.componentId === 'feedback-alert') {
      const owner = page.getByTestId('practical-alert-closable');
      const title = owner.getByText('Review required');
      const description = owner.getByText('Confirm the deployment settings.');
      const close = owner.getByRole('button', { name: 'Close practical alert' });
      await expectInsideOwner(owner, [title, description, close]);
      await expectNoBoxOverlap(title, close);
      await expectNoBoxOverlap(description, close);
    }

    if (story.componentId === 'inputs-multiselect') {
      const owner = page.getByTestId('multi-select-160');
      const labels = owner.locator('[data-multiselect-tag-label]');
      const removeActions = owner.locator('[data-multiselect-tag-remove]');
      await expect(labels).toHaveCount(3);
      await expect(removeActions).toHaveCount(3);
      await expectInsideOwner(owner, [
        labels.nth(0),
        labels.nth(1),
        labels.nth(2),
        removeActions.nth(0),
        removeActions.nth(1),
        removeActions.nth(2),
        owner.getByRole('combobox', { name: 'Constrained frameworks' }),
      ]);
      for (let index = 0; index < 3; index += 1) {
        await expectNoBoxOverlap(labels.nth(index), removeActions.nth(index));
      }
    }

    if (story.componentId === 'inputs-searchinput') {
      const owner = page.getByTestId('practical-search-owner');
      const input = owner.getByRole('searchbox', { name: 'Practical minimum search' });
      const clear = owner.getByRole('button', { name: /clear/i });
      await expect(input).toHaveValue('deployment');
      await expectInsideOwner(owner, [input, clear]);
      const [paddingInlineEnd, clearWidth] = await Promise.all([
        input.evaluate((element) => Number.parseFloat(getComputedStyle(element).paddingInlineEnd)),
        clear.evaluate((element) => element.getBoundingClientRect().width),
      ]);
      expect(paddingInlineEnd).toBeGreaterThanOrEqual(clearWidth);
    }

    if (story.componentId === 'inputs-inputgroup') {
      const owner = page.getByTestId('practical-input-group-owner');
      const startAddon = owner.locator('[data-placement="start"]');
      const input = owner.getByRole('textbox', { name: 'Practical website' });
      const endAddon = owner.locator('[data-placement="end"]');
      await expect(input).toHaveValue('example');
      await expect(startAddon).toContainText('https://');
      await expect(endAddon).toContainText('.com');
      await expectInsideOwner(owner, [startAddon, input, endAddon]);
      const [startBox, inputBox, endBox] = await Promise.all([
        startAddon.boundingBox(),
        input.boundingBox(),
        endAddon.boundingBox(),
      ]);
      expect(startBox).not.toBeNull();
      expect(inputBox).not.toBeNull();
      expect(endBox).not.toBeNull();
      expect(startBox!.x + startBox!.width).toBeLessThanOrEqual(inputBox!.x + 1);
      expect(inputBox!.x + inputBox!.width).toBeLessThanOrEqual(endBox!.x + 1);
    }
  }
});
