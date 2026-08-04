import { fireEvent, render, screen } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { PoffyBrandProvider, useBrand } from './BrandProvider';
import { ColorModeProvider } from './ColorModeProvider';
import { DirectionProvider } from './DirectionProvider';
import { LocaleProvider } from './LocaleProvider';

vi.unmock('@/providers');

const CustomBrandControl = () => {
  const { setCustomBrand } = useBrand();
  return (
    <button onClick={() => setCustomBrand({ main: '#16A34A', contrast: '#000000' })}>
      Update brand
    </button>
  );
};

/**
 * ### Test Strategy: ProviderScope
 * - **Focus**: Explicit local provider boundaries, SSR output, state updates, and DOM-transparent defaults.
 * - **DON'T**: Test document-level ownership; ThemeProvider tests cover global providers.
 */
describe('ProviderScope', () => {
  beforeEach(() => {
    document.documentElement.removeAttribute('data-brand');
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.removeAttribute('lang');
    document.documentElement.removeAttribute('dir');
    document.documentElement.classList.remove('light', 'dark');
    localStorage.clear();
  });

  it('keeps global=false providers DOM-transparent until scope is requested', () => {
    const { container } = render(
      <ColorModeProvider global={false} defaultColorMode="dark">
        <span data-testid="content">Content</span>
      </ColorModeProvider>,
    );

    expect(container.firstElementChild).toBe(screen.getByTestId('content'));
    expect(document.documentElement).not.toHaveAttribute('data-theme');
  });

  it('scopes every low-level provider without mutating document state', async () => {
    const { container } = render(
      <ColorModeProvider global={false} scope defaultColorMode="dark">
        <PoffyBrandProvider
          global={false}
          scope
          initialBrand="custom"
          customBrand={{ main: '#8B5CF6', contrast: '#111111' }}
        >
          <LocaleProvider global={false} scope defaultLocale="ja-JP">
            <DirectionProvider global={false} scope defaultDir="rtl">
              <span data-testid="content">Content</span>
            </DirectionProvider>
          </LocaleProvider>
        </PoffyBrandProvider>
      </ColorModeProvider>,
    );

    const [colorScope, brandScope, localeScope, directionScope] = Array.from(
      container.querySelectorAll('div'),
    );
    expect(colorScope).toHaveAttribute('data-theme', 'dark');
    expect(colorScope).toHaveClass('dark');
    expect(brandScope).toHaveAttribute('data-brand', 'custom');
    expect(brandScope).toHaveStyle({ '--poffy-custom-main': '#8B5CF6' });
    expect(localeScope).toHaveAttribute('lang', 'ja-JP');
    expect(directionScope).toHaveAttribute('dir', 'rtl');
    expect(document.documentElement).not.toHaveAttribute('data-theme');
    expect(document.documentElement).not.toHaveAttribute('data-brand');
    expect(document.documentElement).not.toHaveAttribute('lang');
    expect(document.documentElement).not.toHaveAttribute('dir');
    expect(localStorage.length).toBe(0);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('updates scoped custom brand variables with provider state', () => {
    const { container } = render(
      <PoffyBrandProvider global={false} scope initialBrand="custom" customBrand={{ main: '#8B5CF6' }}>
        <CustomBrandControl />
      </PoffyBrandProvider>,
    );
    const scope = container.firstElementChild;

    expect(scope).toHaveStyle({ '--poffy-custom-main': '#8B5CF6' });
    fireEvent.click(screen.getByRole('button', { name: 'Update brand' }));
    expect(scope).toHaveStyle({ '--poffy-custom-main': '#16A34A' });
    expect(scope).toHaveStyle({ '--poffy-custom-contrast': '#000000' });
  });

  it('renders scope attributes during SSR', () => {
    const markup = renderToStaticMarkup(
      <ColorModeProvider global={false} scope defaultColorMode="dark">
        <PoffyBrandProvider global={false} scope initialBrand="custom" customBrand={{ main: '#8B5CF6' }}>
          <LocaleProvider global={false} scope defaultLocale="ar-SA">
            <DirectionProvider global={false} scope defaultDir="rtl">
              <span>Content</span>
            </DirectionProvider>
          </LocaleProvider>
        </PoffyBrandProvider>
      </ColorModeProvider>,
    );

    expect(markup).toContain('data-theme="dark"');
    expect(markup).toContain('data-brand="custom"');
    expect(markup).toContain('lang="ar-SA"');
    expect(markup).toContain('dir="rtl"');
    expect(markup).toContain('--poffy-custom-main:#8B5CF6');
  });
});
