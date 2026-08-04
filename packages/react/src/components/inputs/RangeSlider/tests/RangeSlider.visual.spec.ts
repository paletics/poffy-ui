import { expect, test } from '@playwright/test';
import { expectNoHorizontalOverflow, testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  componentId: 'inputs-rangeslider',
  snapshotPrefix: 'range-slider',
  title: 'RangeSlider',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'Controlled', story: 'controlled' },
    { name: 'Sizes', story: 'sizes' },
    { name: 'Intents', story: 'intents' },
    { name: 'States', story: 'states' },
    { name: 'MinGap', story: 'min-gap' },
  ],
});

test('keeps RTL endpoint thumbs centered and targets at least 24px', async ({ page }) => {
  await page.goto('/iframe.html?id=inputs-rangeslider--narrow-rtl-endpoints&viewMode=story');
  const group = page.getByRole('group');
  const track = page.locator('[data-range-slider-track]');
  const thumbs = page.getByRole('slider');
  await expect(thumbs).toHaveCount(2);

  const [trackBox, lowerBox, upperBox] = await Promise.all([
    track.boundingBox(),
    thumbs.nth(0).boundingBox(),
    thumbs.nth(1).boundingBox(),
  ]);
  expect(trackBox).not.toBeNull();
  expect(lowerBox).not.toBeNull();
  expect(upperBox).not.toBeNull();
  expect(lowerBox!.width).toBeGreaterThanOrEqual(24);
  expect(upperBox!.width).toBeGreaterThanOrEqual(24);
  expect(
    Math.abs(lowerBox!.x + lowerBox!.width / 2 - (trackBox!.x + trackBox!.width)),
  ).toBeLessThan(1);
  expect(Math.abs(upperBox!.x + upperBox!.width / 2 - trackBox!.x)).toBeLessThan(1);
  await expectNoHorizontalOverflow(page);
  await expect(group).toBeVisible();
});

test('contains endpoint thumbs and focus rings across sizes and directions', async ({ page }) => {
  await page.goto('/iframe.html?id=inputs-rangeslider--endpoint-containment&viewMode=story');

  for (const size of ['sm', 'md', 'lg']) {
    for (const direction of ['ltr', 'rtl']) {
      const container = page.getByLabel(`${size}-${direction} range slider container`);
      const track = container.locator('[data-range-slider-track]');
      const thumbs = container.getByRole('slider');
      const [containerBox, trackBox, firstThumbBox, secondThumbBox] = await Promise.all([
        container.boundingBox(),
        track.boundingBox(),
        thumbs.nth(0).boundingBox(),
        thumbs.nth(1).boundingBox(),
      ]);
      expect(containerBox).not.toBeNull();
      expect(trackBox).not.toBeNull();
      expect(firstThumbBox).not.toBeNull();
      expect(secondThumbBox).not.toBeNull();

      for (const thumbBox of [firstThumbBox!, secondThumbBox!]) {
        expect(thumbBox.x).toBeGreaterThanOrEqual(containerBox!.x + 3 - 1);
        expect(thumbBox.x + thumbBox.width).toBeLessThanOrEqual(
          containerBox!.x + containerBox!.width - 3 + 1,
        );
      }
      expect(
        await container.evaluate((element) => element.scrollWidth <= element.clientWidth + 1),
      ).toBe(true);

      const endpointCenters = [firstThumbBox!, secondThumbBox!]
        .map((box) => box.x + box.width / 2)
        .sort((left, right) => left - right);
      expect(Math.abs(endpointCenters[0]! - trackBox!.x)).toBeLessThan(1);
      expect(Math.abs(endpointCenters[1]! - (trackBox!.x + trackBox!.width))).toBeLessThan(1);

      for (const thumb of [thumbs.nth(0), thumbs.nth(1)]) {
        await thumb.focus();
        await expect(thumb).toBeFocused();
        await expect(thumb).toHaveCSS('box-shadow', /0px 0px 0px 3px/);
      }
    }
  }
});
