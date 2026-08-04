import {
  expectNoHorizontalOverflow,
  testStoriesDoNotOverflowOnMobile,
  testVisualStories,
} from '@/components/e2e/visualSpecUtils';
import { expect, test } from '@playwright/test';

testVisualStories({
  accessibilityStory: 'default',
  componentId: 'display-avatargroup',
  snapshotPrefix: 'avatar-group',
  title: 'AvatarGroup',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'AsChild', story: 'as-child' },
    { name: 'WithMax', story: 'with-max' },
    { name: 'WithTotalOverride', story: 'with-total-override' },
    { name: 'Scrollable', story: 'scrollable' },
  ],
});

testStoriesDoNotOverflowOnMobile({
  componentId: 'display-avatargroup',
  title: 'AvatarGroup',
  stories: [
    { name: 'WithTotalOverride', story: 'with-total-override' },
    { name: 'Scrollable', story: 'scrollable' },
  ],
});

test('many avatars overflow within the group rather than the mobile page', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/iframe.html?id=display-avatargroup--scrollable&viewMode=story');
  const group = page.getByTestId('scrollable-avatar-group');
  await expect(group).toBeVisible();

  const dimensions = await group.evaluate((element) => ({
    clientWidth: element.clientWidth,
    scrollWidth: element.scrollWidth,
  }));
  expect(dimensions.scrollWidth).toBeGreaterThan(dimensions.clientWidth);
  await expect(group).toHaveAttribute('tabindex', '0');
  await group.focus();
  await expect(group).toBeFocused();
  await expect(group).toHaveCSS('outline-style', 'solid');
  await group.press('End');
  await expect
    .poll(() => group.evaluate((element) => Math.abs(element.scrollLeft)))
    .toBeGreaterThan(0);
  await group.press('Home');
  await expect.poll(() => group.evaluate((element) => Math.abs(element.scrollLeft))).toBe(0);
  await expectNoHorizontalOverflow(page);
});

test('RTL overflow responds to logical Home and End keyboard scrolling', async ({ page }) => {
  await page.goto('/iframe.html?id=display-avatargroup--scrollable-rtl&viewMode=story');
  const group = page.getByTestId('scrollable-avatar-group-rtl');

  await expect(group).toHaveAttribute('tabindex', '0');
  await expect(group).toHaveCSS('direction', 'rtl');
  await group.focus();
  await group.press('End');
  await expect
    .poll(() => group.evaluate((element) => Math.abs(element.scrollLeft)))
    .toBeGreaterThan(0);
  await group.press('Home');
  await expect.poll(() => group.evaluate((element) => Math.abs(element.scrollLeft))).toBe(0);
});

test('overlapping avatar links keep the focused ring inside the scrollable group', async ({
  page,
}) => {
  await page.goto('/iframe.html?id=display-avatargroup--focusable-avatars&viewMode=story');

  const group = page.getByTestId('focusable-avatar-group');
  const avatar = page.getByRole('link', { name: 'Mika Sato profile' });
  await avatar.focus();

  await expect(avatar).toBeFocused();
  await expect(avatar).toHaveCSS('outline-style', 'solid');
  await expect(avatar).toHaveCSS('outline-offset', '-2px');
  await expect(group).toHaveCSS('overflow-y', 'hidden');
  await expect(page).toHaveScreenshot('avatar-group-focusable-avatar-focus.png');
});
