import { expect, test } from '@playwright/test';
import { testStoriesDoNotOverflowOnMobile } from '@/components/e2e/visualSpecUtils';

testStoriesDoNotOverflowOnMobile({
  componentId: 'theme-tokens',
  title: 'Theme Tokens',
  stories: [
    { name: 'Palette', story: 'palette' },
    { name: 'Semantic Colors', story: 'semantic-colors' },
    { name: 'Typography', story: 'typography' },
    { name: 'Animations', story: 'animations' },
  ],
});

test('renders semantic color leaves and purpose-built animation previews', async ({ page }) => {
  await page.goto('/iframe.html?id=theme-tokens--semantic-colors&viewMode=story');
  await expect(page.getByText('colors.poffy.cloud.main')).toBeVisible();
  await expect(page.getByText('colors.variants.primary.main')).toBeVisible();
  await expect(page.getByTestId('semantic-token-colors-brand-main')).toHaveCSS(
    'background-color',
    /rgb\(/,
  );

  await page.goto('/iframe.html?id=theme-tokens--animations&viewMode=story');
  const dashPreview = page.getByTestId('theme-stroke-dash-circle-dash');
  await expect(dashPreview).toBeVisible();
  await expect(dashPreview.locator('circle')).toHaveAttribute('stroke-dasharray', '100');
  await expect(page.getByTestId('theme-progress-load-track')).toHaveCSS('overflow', 'hidden');
});

test('publishes platform and CJK fallbacks in the document font stack', async ({ page }) => {
  await page.goto('/iframe.html?id=theme-tokens--typography&viewMode=story');

  const fontFamily = await page
    .locator('body')
    .evaluate((body) => getComputedStyle(body).fontFamily);
  expect(fontFamily).toContain('Hiragino Kaku Gothic ProN');
  expect(fontFamily).toContain('Yu Gothic');
  expect(fontFamily).toContain('Noto Sans CJK JP');
});

test('renders Japanese glyphs with the installed Noto CJK platform font', async ({
  page,
  browserName,
}) => {
  test.skip(browserName !== 'chromium', 'Platform font inspection uses the Chromium CDP.');

  await page.goto('/iframe.html?id=theme-tokens--cjk-typography&viewMode=story');
  const sample = page.getByTestId('cjk-body-sample');
  await expect(sample).toBeVisible();

  const client = await page.context().newCDPSession(page);
  await client.send('DOM.enable');
  await client.send('CSS.enable');
  const documentResult = (await client.send('DOM.getDocument')) as {
    root: { nodeId: number };
  };
  const queryResult = (await client.send('DOM.querySelector', {
    nodeId: documentResult.root.nodeId,
    selector: '[data-testid="cjk-body-sample"]',
  })) as { nodeId: number };
  const fontResult = (await client.send('CSS.getPlatformFontsForNode', {
    nodeId: queryResult.nodeId,
  })) as {
    fonts: { familyName: string; glyphCount: number }[];
  };
  const notoFont = fontResult.fonts.find((font) =>
    font.familyName.toLowerCase().includes('noto sans cjk jp'),
  );

  if (!process.env.CI && !notoFont) {
    const measuredFamilies = fontResult.fonts.map((font) => font.familyName).join(', ');
    test.skip(
      true,
      `Noto Sans CJK JP is not installed locally; measured: ${
        measuredFamilies.length > 0 ? measuredFamilies : 'none'
      }`,
    );
  }

  expect(
    notoFont,
    `Expected Noto Sans CJK JP in measured platform fonts: ${fontResult.fonts
      .map((font) => `${font.familyName} (${font.glyphCount})`)
      .join(', ')}`,
  ).toBeDefined();
  expect(notoFont?.glyphCount).toBeGreaterThan(0);
});
