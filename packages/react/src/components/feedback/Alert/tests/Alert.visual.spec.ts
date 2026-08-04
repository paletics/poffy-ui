import {
  testStoriesDoNotOverflowOnMobile,
  testVisualStories,
} from '@/components/e2e/visualSpecUtils';
import { expect, test } from '@playwright/test';

testVisualStories({
  accessibilityStory: 'default',
  componentId: 'feedback-alert',
  snapshotPrefix: 'alert',
  title: 'Alert',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'Variants', story: 'variants' },
    { name: 'LogicalStartAccent', story: 'logical-start-accent' },
    { name: 'Statuses', story: 'statuses' },
    { name: 'WithClose', story: 'with-close' },
    { name: 'ConstrainedLongText', story: 'constrained-long-text' },
  ],
});

test('start accent follows the logical inline direction', async ({ page }) => {
  await page.goto('/iframe.html?id=feedback-alert--logical-start-accent&viewMode=story');

  const ltr = page.getByTestId('start-accent-ltr').getByRole('status');
  const rtl = page.getByTestId('start-accent-rtl').getByRole('status');
  await expect(ltr).toBeVisible();
  await expect(rtl).toBeVisible();

  await expect(ltr).toHaveCSS('border-left-width', '4px');
  await expect(ltr).toHaveCSS('border-right-width', '0px');
  await expect(rtl).toHaveCSS('border-right-width', '4px');
  await expect(rtl).toHaveCSS('border-left-width', '0px');
});

testStoriesDoNotOverflowOnMobile({
  componentId: 'feedback-alert',
  title: 'Alert',
  stories: [{ name: 'ConstrainedLongText', story: 'constrained-long-text' }],
});

test('long alert text stays within a narrow parent', async ({ page }) => {
  await page.goto('/iframe.html?id=feedback-alert--constrained-long-text&viewMode=story');

  const alert = page.getByRole('status');
  await expect(alert).toBeVisible();
  expect(await alert.evaluate((node) => node.scrollWidth <= node.clientWidth + 1)).toBe(true);
});

test('70px closable alerts wrap direct and stacked content without overlap in LTR and RTL', async ({
  page,
}) => {
  await page.goto('/iframe.html?id=feedback-alert--constrained-closable&viewMode=story');

  const cases = [
    page.getByTestId('alert-direct-ltr'),
    page.getByTestId('alert-direct-rtl'),
    page.getByTestId('alert-stack-ltr'),
    page.getByTestId('alert-stack-rtl'),
  ];

  for (const constrainedCase of cases) {
    const alert = constrainedCase.locator('[role="status"], [role="alert"]');
    await expect(alert).toBeVisible();
    expect(
      await alert.evaluate((element) => Math.round(element.getBoundingClientRect().width)),
    ).toBe(70);
    expect(await alert.evaluate((element) => element.scrollWidth <= element.clientWidth + 1)).toBe(
      true,
    );
    expect(
      await alert.evaluate((element) => {
        const close = element.querySelector<HTMLElement>('[data-alert-close]');
        if (!close) return false;
        const closeRect = close.getBoundingClientRect();
        return Array.from(element.children)
          .filter((child) => child !== close)
          .every((child) => {
            const childRect = child.getBoundingClientRect();
            const overlapInline =
              Math.min(closeRect.right, childRect.right) - Math.max(closeRect.left, childRect.left);
            const overlapBlock =
              Math.min(closeRect.bottom, childRect.bottom) - Math.max(closeRect.top, childRect.top);
            if (overlapInline > 0 && overlapBlock > 0) return false;
            return true;
          });
      }),
    ).toBe(true);
  }

  await expect(page.getByTestId('alert-direct-rtl').getByRole('status')).toHaveCSS(
    'direction',
    'rtl',
  );
  const rtlClose = page.getByRole('button', { name: 'Close stack RTL alert' });
  for (let attempt = 0; attempt < 8; attempt += 1) {
    if (await rtlClose.evaluate((element) => element === element.ownerDocument.activeElement))
      break;
    await page.keyboard.press('Tab');
  }
  await expect(rtlClose).toBeFocused();
  await expect(rtlClose).toHaveCSS('outline-style', 'solid');
  await expect(page.getByTestId('alert-stack-rtl').getByRole('alert')).toHaveCSS(
    'overflow',
    'visible',
  );

  await page.getByRole('button', { name: 'Close direct LTR alert' }).click();
  await expect(page.getByText('Closed direct LTR alert')).toBeVisible();
});
