import { expect, test } from '@playwright/test';
import { testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  accessibilityStory: 'open',
  componentId: 'overlay-hovercard',
  snapshotPrefix: 'hover-card',
  title: 'HoverCard',
  stories: [
    { name: 'Default Closed', story: 'default' },
    { name: 'Open', story: 'open' },
    { name: 'Variants', story: 'variants' },
    { name: 'Placements', story: 'placements' },
    { name: 'Brands', story: 'brands' },
    { name: 'No Arrow', story: 'no-arrow' },
    { name: 'Interactive Content', story: 'interactive-content' },
  ],
});

test.describe('HoverCard Interaction Visual Regression', () => {
  test('hover-open render matches snapshot', async ({ page }) => {
    await page.goto('/iframe.html?id=overlay-hovercard--default&viewMode=story');
    await page.getByRole('button', { name: /ada lovelace/i }).hover();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page).toHaveScreenshot('hover-card-default-open.png');
  });

  test('scrollable content reserves space for a focused descendant ring', async ({ page }) => {
    await page.goto('/iframe.html?id=overlay-hovercard--interactive-content&viewMode=story');

    const content = page.getByRole('dialog');
    const messageButton = content.getByRole('button', { name: 'Message' });
    await messageButton.focus();

    await expect(messageButton).toBeFocused();
    await expect(content).toHaveCSS('scroll-padding-block', '4px');
  });

  test('managed content follows the trigger in forward and reverse Tab order', async ({ page }) => {
    await page.goto('/iframe.html?id=overlay-hovercard--focus-order&viewMode=story');

    const trigger = page.getByRole('button', { name: 'Focus order trigger' });
    const action = page.getByRole('button', { name: 'Card action' });
    await trigger.focus();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.keyboard.press('Tab');
    await expect(action).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'After hover card' })).toBeFocused();
    await expect(page.getByRole('dialog')).toBeHidden();

    await trigger.focus();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.keyboard.press('Tab');
    await expect(action).toBeFocused();
    await page.keyboard.press('Shift+Tab');
    await expect(trigger).toBeFocused();
  });
});
