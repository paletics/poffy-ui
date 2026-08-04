import { expect, test } from '@playwright/test';
import { expectNoHorizontalOverflow, testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  componentId: 'inputs-datepicker',
  snapshotPrefix: 'date-picker',
  title: 'DatePicker',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'Sizes', story: 'standard-sizes' },
    { name: 'Controlled', story: 'controlled' },
  ],
});

test('portalled calendar preserves forward and reverse tab order', async ({ page }) => {
  const url = '/iframe.html?id=inputs-datepicker--tab-order&viewMode=story';
  await page.goto(url);

  const trigger = page.getByRole('button', { name: 'Appointment date' });
  await trigger.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('button', { name: /Tuesday, April 14, 2026/i })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'After date picker' })).toBeFocused();
  await expect(page.getByRole('dialog', { name: 'Calendar' })).toBeHidden();

  await page.goto(url);
  await trigger.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('button', { name: /Tuesday, April 14, 2026/i })).toBeFocused();
  for (let index = 0; index < 8; index += 1) {
    if (
      await page
        .getByRole('button', { name: 'Before date picker' })
        .evaluate((node) => node === node.ownerDocument.activeElement)
    )
      break;
    await page.keyboard.press('Shift+Tab');
  }
  await expect(page.getByRole('button', { name: 'Before date picker' })).toBeFocused();
  await expect(page.getByRole('dialog', { name: 'Calendar' })).toBeHidden();
});

for (const [name, viewport] of Object.entries({
  Desktop: { width: 1280, height: 900 },
  Tablet: { width: 768, height: 900 },
  Mobile: { width: 390, height: 844 },
})) {
  test(`${name} calendar popover is fully visible when DatePicker opens`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto('/iframe.html?id=inputs-datepicker--standard-sizes&viewMode=story');

    for (const trigger of await page.locator('button[aria-haspopup="dialog"]').all()) {
      await trigger.click();
      const calendar = page.getByRole('dialog', { name: 'Calendar' });
      const calendarGrid = calendar.getByRole('group', { name: 'Calendar' });
      await expect(calendar).toBeVisible();
      await expect(calendar).toHaveAttribute('data-surface', 'none');
      await expect(calendar).toHaveCSS('padding', '0px');
      await expect(calendar).toHaveCSS('border-top-width', '0px');
      const bounds = await calendar.evaluate((element) => {
        const rect = element.getBoundingClientRect();
        return { bottom: rect.bottom, left: rect.left, right: rect.right, top: rect.top };
      });
      expect(bounds).toMatchObject({ left: expect.any(Number), top: expect.any(Number) });
      expect(bounds.left).toBeGreaterThanOrEqual(0);
      expect(bounds.top).toBeGreaterThanOrEqual(0);
      expect(bounds.right).toBeLessThanOrEqual(viewport.width);
      expect(bounds.bottom).toBeLessThanOrEqual(viewport.height);
      const calendarWidth = await calendarGrid.evaluate((element) => ({
        clientWidth: element.clientWidth,
        scrollWidth: element.scrollWidth,
      }));
      expect(calendarWidth.scrollWidth).toBe(calendarWidth.clientWidth);
      await expectNoHorizontalOverflow(page);
      await page.keyboard.press('Escape');
    }
  });
}
