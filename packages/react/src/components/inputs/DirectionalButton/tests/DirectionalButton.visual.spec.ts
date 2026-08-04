import { expect, test } from '@playwright/test';
import { testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  accessibilityStory: 'default',
  componentId: 'inputs-directionalbutton',
  snapshotPrefix: 'directional-button',
  title: 'DirectionalButton',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'Directions', story: 'directions' },
    { name: 'Group', story: 'group' },
    { name: 'DisabledAsChild', story: 'disabled-as-child' },
  ],
});

test('connected group keeps the focused directional button ring inside its clipped boundary', async ({
  page,
}) => {
  await page.goto('/iframe.html?id=inputs-directionalbutton--group&viewMode=story');
  const previous = page.getByRole('button', { name: 'Previous page' });
  const next = page.getByRole('button', { name: 'Next page' });
  const group = previous.locator('..');

  await previous.focus();
  await expect(previous).toBeFocused();
  await expect(group).toHaveScreenshot('directional-button-connected-group-start-focus.png');

  await next.focus();
  await expect(next).toBeFocused();
  await expect(group).toHaveScreenshot('directional-button-connected-group-end-focus.png');
});

test('horizontal connected groups keep target sizes and scroll focused actions locally', async ({
  page,
}) => {
  await page.goto(
    '/iframe.html?id=inputs-directionalbutton--constrained-connected-group&viewMode=story',
  );

  for (const direction of ['LTR', 'RTL']) {
    const group = page.getByRole('group', {
      name: `Constrained ${direction} directional controls`,
    });
    const previous = page.getByRole('button', { name: `Previous ${direction} item` });
    const next = page.getByRole('button', { name: `Next ${direction} item` });

    const initial = await group.evaluate((element) => ({
      boundingWidth: element.getBoundingClientRect().width,
      clientWidth: element.clientWidth,
      scrollWidth: element.scrollWidth,
    }));
    expect(initial.boundingWidth).toBe(40);
    expect(initial.scrollWidth).toBeGreaterThan(initial.clientWidth);

    for (const button of [previous, next]) {
      const box = await button.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.width).toBeGreaterThanOrEqual(45);
      expect(box!.height).toBeGreaterThanOrEqual(45);
    }

    for (const button of [next, previous]) {
      await button.focus();
      await expect(button).toBeFocused();
      await expect
        .poll(async () => {
          const [groupBox, buttonBox] = await Promise.all([
            group.boundingBox(),
            button.boundingBox(),
          ]);
          return Boolean(
            groupBox &&
            buttonBox &&
            buttonBox.x < groupBox.x + groupBox.width &&
            buttonBox.x + buttonBox.width > groupBox.x,
          );
        })
        .toBe(true);
    }
  }

  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
    ),
  ).toBe(true);
});

test('visible labels stay contained for native, element, and asChild content', async ({ page }) => {
  await page.goto(
    '/iframe.html?id=inputs-directionalbutton--constrained-visible-labels&viewMode=story',
  );

  const cases = [
    {
      parent: 'directional-visible-40',
      role: 'button' as const,
      name: 'LocalizedUnbrokenDirectionalAction',
    },
    {
      parent: 'directional-visible-80',
      role: 'button' as const,
      name: 'LocalizedUnbrokenElementAction',
    },
    {
      parent: 'directional-visible-120',
      role: 'link' as const,
      name: 'LocalizedUnbrokenLinkAction',
    },
  ];

  for (const constrainedCase of cases) {
    const parent = page.getByTestId(constrainedCase.parent);
    const control = parent.getByRole(constrainedCase.role, { name: constrainedCase.name });
    const geometry = await parent.evaluate((element) => {
      const parentBox = element.getBoundingClientRect();
      const control = element.querySelector<HTMLElement>('[data-directional-button]');
      if (!control) throw new Error('Expected a directional button');
      const controlBox = control.getBoundingClientRect();
      return {
        blockSize: controlBox.height,
        controlEnd: controlBox.right,
        controlStart: controlBox.left,
        parentEnd: parentBox.right,
        parentStart: parentBox.left,
        parentWidth: parentBox.width,
        scrollWidth: element.scrollWidth,
      };
    });

    expect(geometry.scrollWidth).toBeLessThanOrEqual(geometry.parentWidth + 1);
    expect(geometry.controlStart).toBeGreaterThanOrEqual(geometry.parentStart - 1);
    expect(geometry.controlEnd).toBeLessThanOrEqual(geometry.parentEnd + 1);
    expect(geometry.blockSize).toBeGreaterThanOrEqual(24);
    expect(geometry.blockSize).toBeLessThanOrEqual(46);
    await expect(control.locator('[data-directional-button-label]')).toHaveCSS(
      'text-overflow',
      'ellipsis',
    );
    await expect(control.locator('[data-directional-button-label]')).toHaveCSS(
      'white-space',
      'nowrap',
    );
    await control.focus();
    await expect(control).toBeFocused();
  }

  await expect(page.getByRole('link', { name: 'LocalizedUnbrokenLinkAction' })).toHaveAttribute(
    'href',
    '#directional-visible-label',
  );
});
