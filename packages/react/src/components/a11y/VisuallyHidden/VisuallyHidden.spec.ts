import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.describe('VisuallyHidden Utility', () => {
  test('should be visually hidden but present in the DOM', async ({ page }) => {
    await page.goto('/iframe.html?id=a11y-visuallyhidden--default&viewMode=story');

    const hiddenElement = page.getByText('This text is only visible to screen readers');
    await expect(hiddenElement).toBeAttached();

    const styles = await hiddenElement.evaluate((element) => {
      const style = window.getComputedStyle(element);

      return {
        height: style.height,
        overflow: style.overflow,
        position: style.position,
        width: style.width,
      };
    });

    expect(styles.position).toBe('absolute');
    expect(styles.overflow).toBe('hidden');
    expect(styles.width).toBe('1px');
    expect(styles.height).toBe('1px');
  });

  test('should pass accessibility compliance', async ({ page }) => {
    await page.goto('/iframe.html?id=a11y-visuallyhidden--default&viewMode=story');
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  test('should render as a div when requested', async ({ page }) => {
    await page.goto('/iframe.html?id=a11y-visuallyhidden--as-div&viewMode=story');
    const hiddenDiv = page.getByText('This is rendered as a div element', { exact: true });
    await expect(hiddenDiv).toBeAttached();

    const tagName = await hiddenDiv.evaluate((el) => el.tagName);
    expect(tagName).toBe('DIV');
  });
});
