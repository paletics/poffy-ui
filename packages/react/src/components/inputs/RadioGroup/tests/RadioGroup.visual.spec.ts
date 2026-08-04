import { expect, test } from '@playwright/test';
import { expectNoHorizontalOverflow, testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  componentId: 'inputs-radiogroup',
  snapshotPrefix: 'radio-group',
  title: 'RadioGroup',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'Controlled', story: 'controlled' },
  ],
});

test('wraps localized horizontal options inside a narrow RTL container', async ({ page }) => {
  await page.goto('/iframe.html?id=inputs-radiogroup--narrow-localized-horizontal&viewMode=story');

  const group = page.getByRole('radiogroup', { name: '表示密度' });
  const options = group.getByRole('radio');
  await expect(options).toHaveCount(3);
  const groupBox = await group.boundingBox();
  expect(groupBox).not.toBeNull();

  for (let index = 0; index < 3; index += 1) {
    const optionBox = await options.nth(index).locator('..').boundingBox();
    expect(optionBox).not.toBeNull();
    expect(optionBox!.x).toBeGreaterThanOrEqual(groupBox!.x - 1);
    expect(optionBox!.x + optionBox!.width).toBeLessThanOrEqual(groupBox!.x + groupBox!.width + 1);
  }

  await options.nth(1).focus();
  await expect(options.nth(1)).toBeFocused();
  await expectNoHorizontalOverflow(page);
});
