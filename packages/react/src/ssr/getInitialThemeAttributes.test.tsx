import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { getInitialThemeAttributes } from './getInitialThemeAttributes';

/**
 * ### Test Strategy: getInitialThemeAttributes
 * - **Focus**: Server-safe document attributes matching ThemeProvider defaults.
 * - **DON'T**: Test persisted browser preferences or client media-query updates.
 */
describe('getInitialThemeAttributes', () => {
  it('returns ThemeProvider defaults without reading browser state', () => {
    expect(getInitialThemeAttributes()).toEqual({
      'data-brand': 'blue',
      'data-theme': 'light',
      className: 'light',
      dir: 'ltr',
      lang: 'en-US',
    });
  });

  it('returns explicit theme, brand, locale, and direction attributes', () => {
    expect(
      getInitialThemeAttributes({
        defaultBrand: 'pome',
        defaultColorMode: 'dark',
        defaultLocale: 'ja-JP',
        defaultDir: 'rtl',
      }),
    ).toEqual({
      'data-brand': 'pome',
      'data-theme': 'dark',
      className: 'dark',
      dir: 'rtl',
      lang: 'ja-JP',
    });
  });

  it('uses the ColorModeProvider server fallback for system mode', () => {
    expect(getInitialThemeAttributes({ defaultColorMode: 'system' })['data-theme']).toBe('light');
  });

  it('returns custom brand variables for server-rendered document markup', () => {
    const attributes = getInitialThemeAttributes({
      defaultBrand: 'custom',
      customBrand: { main: '#8B5CF6', contrast: '#111111', mainDark: '#A78BFA' },
    });

    expect(attributes.style).toMatchObject({
      '--poffy-custom-main': '#8B5CF6',
      '--poffy-custom-contrast': '#111111',
      '--poffy-custom-main-dark': '#A78BFA',
      '--poffy-custom-contrast-dark': '#111111',
    });
    expect(renderToStaticMarkup(<html lang={attributes.lang} {...attributes} />)).toContain(
      '--poffy-custom-main:#8B5CF6',
    );
  });

  it('returns token overrides for server-rendered document markup', () => {
    const attributes = getInitialThemeAttributes({
      tokenOverrides: { '--poffy-spacing-md': '0.75rem' },
    });

    expect(attributes.style).toMatchObject({ '--poffy-spacing-md': '0.75rem' });
    expect(renderToStaticMarkup(<html lang={attributes.lang} {...attributes} />)).toContain(
      '--poffy-spacing-md:0.75rem',
    );
  });

  it('matches scoped ThemeProvider attributes during SSR', () => {
    const options = {
      defaultBrand: 'pome' as const,
      defaultColorMode: 'dark' as const,
      defaultLocale: 'ja-JP',
      defaultDir: 'rtl' as const,
    };
    const markup = renderToStaticMarkup(
      <ThemeProvider global={false} {...options}>
        <span>content</span>
      </ThemeProvider>,
    );
    const attributes = getInitialThemeAttributes(options);

    expect(markup).toContain(`data-brand="${attributes['data-brand']}"`);
    expect(markup).toContain(`data-theme="${attributes['data-theme']}"`);
    expect(markup).toContain(`lang="${attributes.lang}"`);
    expect(markup).toContain(`dir="${attributes.dir}"`);
  });
});
