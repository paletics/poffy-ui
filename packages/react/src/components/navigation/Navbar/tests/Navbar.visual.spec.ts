import { test, expect } from '@playwright/test';
import { expectNoHorizontalOverflow, testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  componentId: 'navigation-navbar',
  snapshotPrefix: 'navbar',
  title: 'Navbar',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'Sticky', story: 'sticky' },
  ],
});

test.describe('Navbar Interaction Visual Regression', () => {
  test('Default hover state matches snapshot', async ({ page }) => {
    await page.goto('/iframe.html?id=navigation-navbar--default&viewMode=story');
    await page.getByRole('link', { name: /features/i }).hover();
    await expect(page).toHaveScreenshot('navbar-link-hover.png');
  });

  test('Navigation link keeps its focus ring inside the horizontal scroll area', async ({ page }) => {
    await page.goto('/iframe.html?id=navigation-navbar--default&viewMode=story');
    const link = page.getByRole('link', { name: /features/i });
    await link.focus();
    await expect(link).toBeFocused();
    await expect(page).toHaveScreenshot('navbar-link-focus.png');
  });

  test('Default story does not overflow on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/iframe.html?id=navigation-navbar--default&viewMode=story');

    await expect(page.getByRole('navigation')).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });

  test('Wrap layout keeps all navigation content within a narrow navbar', async ({ page }) => {
    await page.setViewportSize({ width: 240, height: 844 });
    await page.goto('/iframe.html?id=navigation-navbar--narrow-wrap&viewMode=story');

    const navigation = page.getByRole('navigation', {
      name: 'Responsive primary navigation',
    });
    await expect(navigation).toBeVisible();
    await expect(
      page.getByRole('link', { name: 'AReallyLongUnbrokenNavigationDestinationLabel' }),
    ).toBeVisible();
    await expect(
      page.getByRole('link', { name: 'PoffyWorkspaceWithAnUnbrokenBrandName' }),
    ).toBeVisible();
    await expect(page.getByRole('button', { name: 'Create account' })).toBeVisible();
    await expect
      .poll(() => navigation.evaluate((node) => node.scrollWidth <= node.clientWidth + 1))
      .toBe(true);
    await expectNoHorizontalOverflow(page);
  });
});
