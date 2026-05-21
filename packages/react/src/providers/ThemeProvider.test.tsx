// Override the global vi.mock('@/providers') in tests/setup.ts
// so this file uses the real implementations
vi.unmock('@/providers');

import { useAnimation, useBrand, useColorMode, useDirection, useLocale } from '@/providers';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { useOptionalAnimation } from './AnimationProvider';
import { MotionProvider } from './MotionProvider';
import { ThemeBoundary } from './ThemeBoundary';
import { ThemeProvider } from './ThemeProvider';

// Helper component to expose all context values and controls
const ContextChecker = () => {
  const { brand, setBrand } = useBrand();
  const { resolvedColorMode, colorMode, setColorMode, toggleColorMode } = useColorMode();
  const { locale, setLocale } = useLocale();
  const { dir, setDir } = useDirection();
  const { animationEnabled, isAnimating, setAnimationEnabled, toggleAnimation } = useAnimation();
  return (
    <div data-testid="context-values">
      <span data-testid="brand">{brand}</span>
      <span data-testid="mode">{resolvedColorMode}</span>
      <span data-testid="raw-mode">{colorMode}</span>
      <span data-testid="locale">{locale}</span>
      <span data-testid="dir">{dir}</span>
      <span data-testid="animation-enabled">{String(animationEnabled)}</span>
      <span data-testid="is-animating">{String(isAnimating)}</span>
      <button data-testid="toggle" onClick={toggleColorMode}>
        Toggle
      </button>
      <button data-testid="set-dark" onClick={() => setColorMode('dark')}>
        Dark
      </button>
      <button data-testid="set-system" onClick={() => setColorMode('system')}>
        System
      </button>
      <button data-testid="set-pome" onClick={() => setBrand('pome')}>
        Pome
      </button>
      <button data-testid="set-ja" onClick={() => setLocale('ja-JP')}>
        Japanese
      </button>
      <button data-testid="set-rtl" onClick={() => setDir('rtl')}>
        RTL
      </button>
      <button data-testid="disable-animation" onClick={() => setAnimationEnabled(false)}>
        Disable Animation
      </button>
      <button data-testid="toggle-animation" onClick={toggleAnimation}>
        Toggle Animation
      </button>
    </div>
  );
};

const OptionalAnimationChecker = () => {
  const { animationEnabled, isAnimating, reducedMotion } = useOptionalAnimation();
  return (
    <div>
      <span data-testid="optional-animation-enabled">{String(animationEnabled)}</span>
      <span data-testid="optional-is-animating">{String(isAnimating)}</span>
      <span data-testid="optional-reduced-motion">{String(reducedMotion)}</span>
    </div>
  );
};

describe('ThemeProvider & ThemeBoundary', () => {
  beforeEach(() => {
    document.documentElement.removeAttribute('data-brand');
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.removeAttribute('data-animation');
    document.documentElement.removeAttribute('lang');
    document.documentElement.removeAttribute('dir');
    document.documentElement.classList.remove('light', 'dark');
    localStorage.clear();
    vi.restoreAllMocks();
  });

  // Default values

  it('provides default theme values', async () => {
    render(
      <ThemeProvider>
        <ContextChecker />
      </ThemeProvider>,
    );

    expect(screen.getByTestId('brand')).toHaveTextContent('blue');
    expect(screen.getByTestId('mode')).toHaveTextContent('light');

    await waitFor(() => {
      expect(document.documentElement).toHaveAttribute('data-brand', 'blue');
      expect(document.documentElement).toHaveAttribute('data-theme', 'light');
      expect(document.documentElement.classList.contains('light')).toBe(true);
    });
  });

  it('supports custom initial brand and mode', async () => {
    render(
      <ThemeProvider defaultBrand="pome" defaultColorMode="dark">
        <ContextChecker />
      </ThemeProvider>,
    );

    expect(screen.getByTestId('brand')).toHaveTextContent('pome');
    expect(screen.getByTestId('mode')).toHaveTextContent('dark');

    await waitFor(() => {
      expect(document.documentElement).toHaveAttribute('data-brand', 'pome');
      expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
    });
  });

  it('provides locale, direction, and animation defaults through the composed provider', async () => {
    render(
      <ThemeProvider defaultLocale="ja-JP" defaultDir="rtl" defaultAnimationEnabled={false}>
        <ContextChecker />
      </ThemeProvider>,
    );

    expect(screen.getByTestId('locale')).toHaveTextContent('ja-JP');
    expect(screen.getByTestId('dir')).toHaveTextContent('rtl');
    expect(screen.getByTestId('animation-enabled')).toHaveTextContent('false');
    expect(screen.getByTestId('is-animating')).toHaveTextContent('false');

    await waitFor(() => {
      expect(document.documentElement).toHaveAttribute('lang', 'ja-JP');
      expect(document.documentElement).toHaveAttribute('dir', 'rtl');
      expect(document.documentElement).toHaveAttribute('data-animation', 'disabled');
    });
  });

  it('updates locale, direction, and animation document attributes', async () => {
    render(
      <ThemeProvider>
        <ContextChecker />
      </ThemeProvider>,
    );

    fireEvent.click(screen.getByTestId('set-ja'));
    fireEvent.click(screen.getByTestId('set-rtl'));
    fireEvent.click(screen.getByTestId('disable-animation'));

    await waitFor(() => {
      expect(screen.getByTestId('locale')).toHaveTextContent('ja-JP');
      expect(screen.getByTestId('dir')).toHaveTextContent('rtl');
      expect(screen.getByTestId('animation-enabled')).toHaveTextContent('false');
      expect(screen.getByTestId('is-animating')).toHaveTextContent('false');
      expect(document.documentElement).toHaveAttribute('lang', 'ja-JP');
      expect(document.documentElement).toHaveAttribute('dir', 'rtl');
      expect(document.documentElement).toHaveAttribute('data-animation', 'disabled');
    });
  });

  it('respects reduced motion when resolving animation state', async () => {
    vi.spyOn(window, 'matchMedia').mockImplementation(
      (query) =>
        ({
          matches: query === '(prefers-reduced-motion: reduce)',
          media: query,
          onchange: null,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        }) as unknown as MediaQueryList,
    );

    render(
      <ThemeProvider defaultAnimationEnabled>
        <ContextChecker />
      </ThemeProvider>,
    );

    expect(screen.getByTestId('animation-enabled')).toHaveTextContent('true');
    expect(screen.getByTestId('is-animating')).toHaveTextContent('false');

    await waitFor(() => {
      expect(document.documentElement).toHaveAttribute('data-animation', 'disabled');
    });
  });

  it('allows animation primitives to read optional animation state without a provider', () => {
    vi.spyOn(window, 'matchMedia').mockImplementation(
      (query) =>
        ({
          matches: false,
          media: query,
          onchange: null,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        }) as unknown as MediaQueryList,
    );

    render(<OptionalAnimationChecker />);

    expect(screen.getByTestId('optional-animation-enabled')).toHaveTextContent('true');
    expect(screen.getByTestId('optional-is-animating')).toHaveTextContent('true');
    expect(screen.getByTestId('optional-reduced-motion')).toHaveTextContent('false');
  });

  it('keeps MotionProvider usable without AnimationProvider', () => {
    render(
      <MotionProvider>
        <OptionalAnimationChecker />
      </MotionProvider>,
    );

    expect(screen.getByTestId('optional-animation-enabled')).toHaveTextContent('true');
    expect(screen.getByTestId('optional-is-animating')).toHaveTextContent('true');
  });

  it('allows animation primitives to inherit disabled animation from ThemeProvider', () => {
    render(
      <ThemeProvider defaultAnimationEnabled={false}>
        <OptionalAnimationChecker />
      </ThemeProvider>,
    );

    expect(screen.getByTestId('optional-animation-enabled')).toHaveTextContent('false');
    expect(screen.getByTestId('optional-is-animating')).toHaveTextContent('false');
    expect(screen.getByTestId('optional-reduced-motion')).toHaveTextContent('false');
  });

  // toggleColorMode

  it('toggles color mode between light and dark', async () => {
    render(
      <ThemeProvider defaultColorMode="light">
        <ContextChecker />
      </ThemeProvider>,
    );

    await waitFor(() => expect(screen.getByTestId('mode')).toHaveTextContent('light'));

    fireEvent.click(screen.getByTestId('toggle'));
    await waitFor(() => expect(screen.getByTestId('mode')).toHaveTextContent('dark'));

    fireEvent.click(screen.getByTestId('toggle'));
    await waitFor(() => expect(screen.getByTestId('mode')).toHaveTextContent('light'));
  });

  it('toggleColorMode resolves correctly from system mode (dark OS)', async () => {
    vi.spyOn(window, 'matchMedia').mockImplementation(
      (query) =>
        ({
          matches: query === '(prefers-color-scheme: dark)',
          media: query,
          onchange: null,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        }) as unknown as MediaQueryList,
    );

    render(
      <ThemeProvider defaultColorMode="system">
        <ContextChecker />
      </ThemeProvider>,
    );

    // system + dark OS resolves to dark.
    await waitFor(() => expect(screen.getByTestId('mode')).toHaveTextContent('dark'));
    expect(screen.getByTestId('raw-mode')).toHaveTextContent('system');

    // Toggle from system (resolved=dark) should go to light, not stay dark.
    fireEvent.click(screen.getByTestId('toggle'));
    await waitFor(() => expect(screen.getByTestId('mode')).toHaveTextContent('light'));
  });

  // localStorage persistence

  it('persists color mode to localStorage', async () => {
    render(
      <ThemeProvider defaultColorMode="light">
        <ContextChecker />
      </ThemeProvider>,
    );

    fireEvent.click(screen.getByTestId('set-dark'));

    await waitFor(() => {
      expect(localStorage.getItem('poffy-color-mode')).toBe('dark');
    });
  });

  it('persists brand to localStorage', async () => {
    render(
      <ThemeProvider defaultBrand="blue">
        <ContextChecker />
      </ThemeProvider>,
    );

    fireEvent.click(screen.getByTestId('set-pome'));

    await waitFor(() => {
      expect(localStorage.getItem('poffy-brand')).toBe('pome');
    });
  });

  it('restores color mode from localStorage on mount', async () => {
    localStorage.setItem('poffy-color-mode', 'dark');

    render(
      <ThemeProvider defaultColorMode="light">
        <ContextChecker />
      </ThemeProvider>,
    );

    await waitFor(() => expect(screen.getByTestId('mode')).toHaveTextContent('dark'));
  });

  it('restores brand from localStorage on mount', async () => {
    localStorage.setItem('poffy-brand', 'pome');

    render(
      <ThemeProvider defaultBrand="blue">
        <ContextChecker />
      </ThemeProvider>,
    );

    await waitFor(() => expect(screen.getByTestId('brand')).toHaveTextContent('pome'));
  });

  // global=false (scoped mode)

  it('renders ThemeBoundary when global is false', async () => {
    const { container } = render(
      <ThemeProvider
        global={false}
        defaultBrand="pome"
        defaultColorMode="dark"
        defaultLocale="ja-JP"
        defaultDir="rtl"
      >
        <div data-testid="child">Scoped Content</div>
      </ThemeProvider>,
    );

    expect(document.documentElement).not.toHaveAttribute('data-brand', 'pome');
    expect(document.documentElement).not.toHaveAttribute('lang', 'ja-JP');
    expect(document.documentElement).not.toHaveAttribute('dir', 'rtl');

    await waitFor(() => {
      const boundary = container.querySelector('[data-brand="pome"]');
      expect(boundary).toBeInTheDocument();
      expect(boundary).toHaveAttribute('data-theme', 'dark');
      expect(boundary).toHaveAttribute('lang', 'ja-JP');
      expect(boundary).toHaveAttribute('dir', 'rtl');
    });
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('does not persist to localStorage when global is false', async () => {
    render(
      <ThemeProvider global={false} defaultColorMode="dark" defaultBrand="pome">
        <ContextChecker />
      </ThemeProvider>,
    );

    await waitFor(() => expect(screen.getByTestId('mode')).toHaveTextContent('dark'));

    expect(localStorage.getItem('poffy-color-mode')).toBeNull();
    expect(localStorage.getItem('poffy-brand')).toBeNull();
    expect(localStorage.getItem('poffy-animation-enabled')).toBeNull();
  });

  it('uses scoped defaults instead of localStorage when global is false', async () => {
    localStorage.setItem('poffy-color-mode', 'light');
    localStorage.setItem('poffy-brand', 'blue');
    localStorage.setItem('poffy-animation-enabled', 'false');

    render(
      <ThemeProvider
        global={false}
        defaultColorMode="dark"
        defaultBrand="pome"
        defaultAnimationEnabled
      >
        <ContextChecker />
      </ThemeProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('mode')).toHaveTextContent('dark');
      expect(screen.getByTestId('brand')).toHaveTextContent('pome');
      expect(screen.getByTestId('animation-enabled')).toHaveTextContent('true');
    });
  });

  // ThemeBoundary nesting

  it('allows nesting via ThemeBoundary', async () => {
    render(
      <ThemeProvider defaultBrand="blue">
        <div data-testid="outer">Outer</div>
        <ThemeBoundary>
          <div data-testid="inner">Inner</div>
        </ThemeBoundary>
      </ThemeProvider>,
    );

    await waitFor(() => {
      expect(document.documentElement).toHaveAttribute('data-brand', 'blue');
      const boundaries = document.querySelectorAll('[data-brand="blue"]');
      expect(boundaries.length).toBeGreaterThanOrEqual(2);
    });
  });

  // Error boundaries

  it('throws when useColorMode is used outside provider', () => {
    // Suppress React's internal error logging
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {
      /* do nothing */
    });

    const Standalone = () => {
      useColorMode();
      return null;
    };

    // React 19 re-throws after logging; wrap in try/catch to capture the message
    let caughtMessage = '';
    try {
      render(<Standalone />);
    } catch (e) {
      caughtMessage = (e as Error).message;
    }

    expect(caughtMessage).toContain('useColorMode must be used within a ColorModeProvider');
    consoleError.mockRestore();
  });

  // Accessibility

  it('has no accessibility violations', async () => {
    const { container } = render(
      <ThemeProvider>
        <div>Content</div>
      </ThemeProvider>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
