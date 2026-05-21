import { test, expect } from '@playwright/test';
import { testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  componentId: 'navigation-stepper',
  snapshotPrefix: 'stepper',
  title: 'Stepper',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'Vertical', story: 'vertical' },
    { name: 'With Content', story: 'with-content' },
  ],
});

test.describe('Stepper Interaction Visual Regression', () => {
  test('Default interaction matches snapshot', async ({ page }) => {
    await page.goto('/iframe.html?id=navigation-stepper--default&viewMode=story');
    await page.getByText('Step 2').click();
    await expect(page).toHaveScreenshot('stepper-step-2-active.png');
  });
});
