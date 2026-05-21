import { test, expect } from '@playwright/test';
import { testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  componentId: 'display-accordion',
  snapshotPrefix: 'accordion',
  title: 'Accordion',
  stories: [
    { name: 'Default Closed', story: 'default' },
    { name: 'Outlined', story: 'outlined' },
    { name: 'With Disabled', story: 'with-disabled' },
    { name: 'Constrained Width', story: 'constrained-width' },
  ],
});

test.describe('Accordion Interaction Visual Regression', () => {
  test('Default open render matches snapshot', async ({ page }) => {
    await page.goto('/iframe.html?id=display-accordion--default&viewMode=story');
    await page.getByRole('button', { name: /is it accessible/i }).click();
    await expect(page.getByText(/wai-aria design pattern/i)).toBeVisible();
    await expect(page).toHaveScreenshot('accordion-default-open.png');
  });
});
