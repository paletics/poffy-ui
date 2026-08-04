// Override the global vi.mock('@/providers') in tests/setup.ts
// so this file uses the real implementations
vi.unmock('@/providers');

import { useAnimation, useBrand, useColorMode, useDirection, useLocale } from '@/providers';
import { Portal } from '@/components/overlay';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { StrictMode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { AnimationProvider, useOptionalAnimation } from './AnimationProvider';
import { ColorModeProvider } from './ColorModeProvider';
import { MotionProvider } from './MotionProvider';
import { MotionPortalScope } from './MotionPortalScope';
import { ThemeBoundary } from './ThemeBoundary';
import { ThemeProvider } from './ThemeProvider';

// Helper component to expose all context values and controls
const ContextChecker = () => {
  const { brand, setBrand } = useBrand();
  const { resolvedColorMode, colorMode, setColorMode, toggleColorMode } = useColorMode();
  const { locale, setLocale } = useLocale();
  const { dir, setDir } = useDirection();
  const {
    animationEnabled,
    isAnimating,
    motionStyle,
    resolvedMotionStyle,
    setAnimationEnabled,
    setMotionStyle,
    toggleAnimation,
  } = useAnimation();
  return (
    <div data-testid="context-values">
      <span data-testid="brand">{brand}</span>
      <span data-testid="mode">{resolvedColorMode}</span>
      <span data-testid="raw-mode">{colorMode}</span>
      <span data-testid="locale">{locale}</span>
      <span data-testid="dir">{dir}</span>
      <span data-testid="animation-enabled">{String(animationEnabled)}</span>
      <span data-testid="is-animating">{String(isAnimating)}</span>
      <span data-testid="motion-style">{motionStyle}</span>
      <span data-testid="resolved-motion-style">{resolvedMotionStyle}</span>
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
      <button data-testid="set-pop-motion" onClick={() => setMotionStyle('pop')}>
        Set Pop Motion
      </button>
    </div>
  );
};

const InvalidBrandControls = () => {
  const { brand, setBrand, setCustomBrand } = useBrand();
  return (
    <>
      <span data-testid="guarded-brand">{brand}</span>
      <button onClick={() => (setBrand as (value: string) => void)('custom')}>Invalid brand</button>
      <button
        onClick={() =>
          (setCustomBrand as (value: unknown) => void)({
            contrast: '#ffffff',
          })
        }
      >
        Invalid custom brand
      </button>
    </>
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

const SsrContextChecker = () => {
  const { brand } = useBrand();
  const { resolvedColorMode } = useColorMode();
  const { animationEnabled, isAnimating, motionStyle, resolvedMotionStyle } = useAnimation();
  return (
    <span data-testid="ssr-context">
      {`${brand}/${resolvedColorMode}/${motionStyle}/${resolvedMotionStyle}/${animationEnabled}/${isAnimating}`}
    </span>
  );
};

describe('ThemeProvider & ThemeBoundary', () => {
  beforeEach(() => {
    document.documentElement.removeAttribute('data-brand');
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.removeAttribute('data-animation');
    document.documentElement.removeAttribute('data-motion-style');
    document.documentElement.removeAttribute('data-motion-scope-fallback');
    document.documentElement.removeAttribute('lang');
    document.documentElement.removeAttribute('dir');
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.style.removeProperty('--poffy-custom-main');
    document.documentElement.style.removeProperty('--poffy-custom-contrast');
    document.documentElement.style.removeProperty('--poffy-custom-main-dark');
    document.documentElement.style.removeProperty('--poffy-custom-contrast-dark');
    localStorage.clear();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
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

  it('uses defaults during SSR and restores persisted theme choices after hydration', async () => {
    const storageRead = vi.fn();
    vi.stubGlobal('window', undefined);
    vi.stubGlobal('localStorage', { getItem: storageRead });

    const markup = renderToString(
      <ThemeProvider defaultBrand="blue" defaultColorMode="light" defaultMotionStyle="standard">
        <SsrContextChecker />
      </ThemeProvider>,
    );

    expect(markup).toContain('blue/light/standard/standard/true/true');
    expect(storageRead).not.toHaveBeenCalled();
    vi.unstubAllGlobals();
    localStorage.setItem('poffy-brand', 'pome');
    localStorage.setItem('poffy-color-mode', 'dark');
    localStorage.setItem('poffy-motion-style', 'pop');
    localStorage.setItem('poffy-animation-enabled', 'false');

    const container = document.createElement('div');
    container.innerHTML = markup;
    document.body.append(container);
    const onRecoverableError = vi.fn();
    let root: ReturnType<typeof hydrateRoot> | undefined;

    await act(async () => {
      root = hydrateRoot(
        container,
        <ThemeProvider defaultBrand="blue" defaultColorMode="light" defaultMotionStyle="standard">
          <SsrContextChecker />
        </ThemeProvider>,
        { onRecoverableError },
      );
    });

    expect(onRecoverableError).not.toHaveBeenCalled();
    await waitFor(() => {
      expect(screen.getByTestId('ssr-context')).toHaveTextContent('pome/dark/pop/none/false/false');
      expect(document.documentElement).toHaveAttribute('data-brand', 'pome');
      expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
      expect(document.documentElement).toHaveAttribute('data-animation', 'disabled');
      expect(document.documentElement).toHaveAttribute('data-motion-style', 'none');
    });

    act(() => root?.unmount());
    container.remove();
  });

  it('renders scoped theme attributes deterministically during SSR', () => {
    const markup = renderToString(
      <ThemeProvider
        global={false}
        defaultBrand="pome"
        defaultColorMode="dark"
        defaultLocale="ja-JP"
        defaultDir="rtl"
        defaultAnimationEnabled={false}
        defaultMotionStyle="pop"
      >
        <span>Scoped SSR</span>
      </ThemeProvider>,
    );

    expect(markup).toContain('data-brand="pome"');
    expect(markup).toContain('data-theme="dark"');
    expect(markup).toContain('data-animation="disabled"');
    expect(markup).toContain('data-motion-style="none"');
    expect(markup).toContain('lang="ja-JP"');
    expect(markup).toContain('dir="rtl"');
  });

  it('renders scoped custom brand variables during SSR', () => {
    const markup = renderToString(
      <ThemeProvider
        global={false}
        defaultBrand="custom"
        customBrand={{ main: '#123456', contrast: '#ffffff', mainDark: '#0f2233' }}
      >
        <span>Scoped custom brand</span>
      </ThemeProvider>,
    );

    expect(markup).toContain('--poffy-custom-main:#123456');
    expect(markup).toContain('--poffy-custom-contrast:#ffffff');
    expect(markup).toContain('--poffy-custom-main-dark:#0f2233');
  });

  it('carries scoped locale, direction, brand, and token variables into portal scopes', () => {
    render(
      <ThemeProvider
        global={false}
        defaultBrand="custom"
        defaultLocale="ar-SA"
        defaultDir="rtl"
        customBrand={{ main: '#123456', contrast: '#ffffff' }}
        tokenOverrides={{ '--poffy-spacing-md': '0.75rem' }}
      >
        <MotionPortalScope>
          <span>Portal content</span>
        </MotionPortalScope>
      </ThemeProvider>,
    );

    const portalScope = screen.getByText('Portal content').parentElement;
    expect(portalScope).toHaveAttribute('lang', 'ar-SA');
    expect(portalScope).toHaveAttribute('dir', 'rtl');
    expect(portalScope).toHaveStyle('--poffy-custom-main: #123456');
    expect(portalScope).toHaveStyle('--poffy-spacing-md: 0.75rem');
  });

  it('carries scoped token variables across a real portal boundary', async () => {
    render(
      <ThemeProvider global={false} tokenOverrides={{ '--poffy-spacing-md': '0.75rem' }}>
        <Portal scopeProviders>
          <span>Portalled token override</span>
        </Portal>
      </ThemeProvider>,
    );

    const content = await screen.findByText('Portalled token override');
    const portalScope = content.parentElement;
    expect(portalScope).toHaveStyle('--poffy-spacing-md: 0.75rem');
    expect(portalScope?.closest('[data-theme-boundary]')).toBeNull();
  });

  it('prevents outer custom dark variables from leaking into a scoped custom brand', () => {
    render(
      <ThemeProvider
        defaultBrand="custom"
        customBrand={{ main: '#000011', contrast: '#ffffff', mainDark: '#000022' }}
        tokenOverrides={{ '--poffy-spacing-md': '0.5rem' }}
      >
        <ThemeProvider
          global={false}
          defaultBrand="custom"
          customBrand={{ main: '#123456', contrast: '#eeeeee' }}
          tokenOverrides={{ '--poffy-radii-md': '12px' }}
        >
          <MotionPortalScope>
            <span>Nested portal content</span>
          </MotionPortalScope>
        </ThemeProvider>
      </ThemeProvider>,
    );

    const portalScope = screen.getByText('Nested portal content').parentElement;
    expect(portalScope).toHaveStyle('--poffy-custom-main-dark: #123456');
    expect(portalScope).toHaveStyle('--poffy-custom-contrast-dark: #eeeeee');
    expect(portalScope).toHaveStyle('--poffy-spacing-md: 0.5rem');
    expect(portalScope).toHaveStyle('--poffy-radii-md: 12px');
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

  it('adds the global CSS fallback when CSS scope is unavailable', async () => {
    vi.stubGlobal('CSSScopeRule', undefined);

    render(
      <ThemeProvider defaultAnimationEnabled={false}>
        <ContextChecker />
      </ThemeProvider>,
    );

    await waitFor(() => {
      expect(document.documentElement).toHaveAttribute('data-motion-scope-fallback', 'disabled');
    });
  });

  it('provides, persists, and exposes the resolved motion style', async () => {
    render(
      <ThemeProvider defaultMotionStyle="subtle">
        <ContextChecker />
      </ThemeProvider>,
    );

    expect(screen.getByTestId('motion-style')).toHaveTextContent('subtle');
    expect(screen.getByTestId('resolved-motion-style')).toHaveTextContent('subtle');

    fireEvent.click(screen.getByTestId('set-pop-motion'));

    await waitFor(() => {
      expect(screen.getByTestId('motion-style')).toHaveTextContent('pop');
      expect(screen.getByTestId('resolved-motion-style')).toHaveTextContent('pop');
      expect(document.documentElement).toHaveAttribute('data-motion-style', 'pop');
      expect(localStorage.getItem('poffy-motion-style')).toBe('pop');
    });
  });

  it('restores a valid global motion style after hydration', async () => {
    localStorage.setItem('poffy-motion-style', 'pop');

    render(
      <ThemeProvider defaultMotionStyle="subtle">
        <ContextChecker />
      </ThemeProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('motion-style')).toHaveTextContent('pop');
      expect(screen.getByTestId('resolved-motion-style')).toHaveTextContent('pop');
    });
  });

  it('ignores invalid stored styles and does not persist a local provider style', async () => {
    localStorage.setItem('poffy-motion-style', 'playful');

    render(
      <ThemeProvider defaultMotionStyle="subtle" global={false}>
        <ContextChecker />
      </ThemeProvider>,
    );

    expect(screen.getByTestId('motion-style')).toHaveTextContent('subtle');
    expect(document.documentElement).not.toHaveAttribute('data-motion-style');
    expect(localStorage.getItem('poffy-motion-style')).toBe('playful');

    await waitFor(() => {
      expect(screen.getByTestId('resolved-motion-style')).toHaveTextContent('subtle');
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
    expect(screen.getByTestId('resolved-motion-style')).toHaveTextContent('none');

    await waitFor(() => {
      expect(document.documentElement).toHaveAttribute('data-animation', 'disabled');
      expect(document.documentElement).toHaveAttribute('data-motion-style', 'none');
    });
  });

  it('shares one reduced-motion listener, updates on changes, and unsubscribes on unmount', async () => {
    let reducedMotion = false;
    let listener: (() => void) | undefined;
    const addEventListener = vi.fn(
      (_type: string, nextListener: EventListenerOrEventListenerObject) => {
        listener = nextListener as () => void;
      },
    );
    const removeEventListener = vi.fn();
    const mediaQuery = {
      get matches() {
        return reducedMotion;
      },
      media: '(prefers-reduced-motion: reduce)',
      onchange: null,
      addEventListener,
      removeEventListener,
      dispatchEvent: vi.fn(),
    } as unknown as MediaQueryList;
    vi.spyOn(window, 'matchMedia').mockReturnValue(mediaQuery);

    const result = render(
      <>
        <AnimationProvider global={false}>
          <OptionalAnimationChecker />
        </AnimationProvider>
        <AnimationProvider global={false}>
          <span />
        </AnimationProvider>
      </>,
    );

    await waitFor(() =>
      expect(addEventListener).toHaveBeenCalledWith('change', expect.any(Function)),
    );
    expect(addEventListener).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('optional-reduced-motion')).toHaveTextContent('false');

    reducedMotion = true;
    act(() => listener?.());

    expect(screen.getByTestId('optional-reduced-motion')).toHaveTextContent('true');
    expect(screen.getByTestId('optional-is-animating')).toHaveTextContent('false');

    result.unmount();
    expect(removeEventListener).toHaveBeenCalledWith('change', listener);
    expect(removeEventListener).toHaveBeenCalledTimes(1);
  });

  it('reads scoped color preference from the owner document realm', async () => {
    const iframe = document.createElement('iframe');
    document.body.append(iframe);
    const ownerDocument = iframe.contentDocument;
    const ownerWindow = ownerDocument?.defaultView;
    if (!ownerDocument || !ownerWindow) throw new Error('Expected an iframe document realm');

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
    const removeEventListener = vi.fn();
    const ownerMatchMedia = vi.fn(
      (query: string) =>
        ({
          matches: query === '(prefers-color-scheme: dark)',
          media: query,
          onchange: null,
          addEventListener: vi.fn(),
          removeEventListener,
          dispatchEvent: vi.fn(),
        }) as unknown as MediaQueryList,
    );
    Object.defineProperty(ownerWindow, 'matchMedia', {
      configurable: true,
      value: ownerMatchMedia,
    });

    const result = render(
      <ColorModeProvider
        defaultColorMode="system"
        global={false}
        ownerDocument={ownerDocument}
        scope
      >
        <span>Scoped system color</span>
      </ColorModeProvider>,
    );

    await waitFor(() =>
      expect(screen.getByText('Scoped system color').parentElement).toHaveAttribute(
        'data-theme',
        'dark',
      ),
    );
    expect(ownerMatchMedia).toHaveBeenCalledWith('(prefers-color-scheme: dark)');

    result.unmount();
    expect(removeEventListener).toHaveBeenCalledWith('change', expect.any(Function));
    iframe.remove();
  });

  it('reads scoped reduced-motion preference from the owner document realm', async () => {
    const iframe = document.createElement('iframe');
    document.body.append(iframe);
    const ownerDocument = iframe.contentDocument;
    const ownerWindow = ownerDocument?.defaultView;
    if (!ownerDocument || !ownerWindow) throw new Error('Expected an iframe document realm');

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
    const removeEventListener = vi.fn();
    const ownerMatchMedia = vi.fn(
      (query: string) =>
        ({
          matches: query === '(prefers-reduced-motion: reduce)',
          media: query,
          onchange: null,
          addEventListener: vi.fn(),
          removeEventListener,
          dispatchEvent: vi.fn(),
        }) as unknown as MediaQueryList,
    );
    Object.defineProperty(ownerWindow, 'matchMedia', {
      configurable: true,
      value: ownerMatchMedia,
    });

    const result = render(
      <AnimationProvider
        defaultAnimationEnabled
        global={false}
        ownerDocument={ownerDocument}
        scope
      >
        <OptionalAnimationChecker />
      </AnimationProvider>,
    );

    await waitFor(() =>
      expect(screen.getByTestId('optional-reduced-motion')).toHaveTextContent('true'),
    );
    expect(screen.getByTestId('optional-is-animating')).toHaveTextContent('false');
    expect(ownerMatchMedia).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)');

    result.unmount();
    expect(removeEventListener).toHaveBeenCalledWith('change', expect.any(Function));
    iframe.remove();
  });

  it('updates global and scoped motion attributes when the OS preference changes', async () => {
    let reducedMotion = false;
    let listener: (() => void) | undefined;
    const mediaQuery = {
      get matches() {
        return reducedMotion;
      },
      media: '(prefers-reduced-motion: reduce)',
      onchange: null,
      addEventListener: vi.fn((_type: string, nextListener: EventListenerOrEventListenerObject) => {
        listener = nextListener as () => void;
      }),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    } as unknown as MediaQueryList;
    vi.spyOn(window, 'matchMedia').mockReturnValue(mediaQuery);

    render(
      <>
        <AnimationProvider>
          <span />
        </AnimationProvider>
        <AnimationProvider global={false} scope>
          <span>Scoped content</span>
        </AnimationProvider>
      </>,
    );

    await waitFor(() => {
      expect(document.documentElement).toHaveAttribute('data-animation', 'enabled');
      expect(screen.getByText('Scoped content').parentElement).toHaveAttribute(
        'data-animation',
        'enabled',
      );
    });

    reducedMotion = true;
    act(() => listener?.());

    expect(document.documentElement).toHaveAttribute('data-animation', 'disabled');
    expect(document.documentElement).toHaveAttribute('data-motion-style', 'none');
    expect(screen.getByText('Scoped content').parentElement).toHaveAttribute(
      'data-animation',
      'disabled',
    );
    expect(screen.getByText('Scoped content').parentElement).toHaveAttribute(
      'data-motion-style',
      'none',
    );
  });

  it('updates a ThemeBoundary and its fallback attribute when the OS preference changes', async () => {
    let reducedMotion = false;
    let listener: (() => void) | undefined;
    vi.stubGlobal('CSSScopeRule', undefined);
    const addEventListener = vi.fn(
      (_type: string, nextListener: EventListenerOrEventListenerObject) => {
        listener = nextListener as () => void;
      },
    );
    const reducedMotionMediaQuery = {
      get matches() {
        return reducedMotion;
      },
      media: '(prefers-reduced-motion: reduce)',
      onchange: null,
      addEventListener,
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    } as unknown as MediaQueryList;
    vi.spyOn(window, 'matchMedia').mockImplementation((query) =>
      query === '(prefers-reduced-motion: reduce)'
        ? reducedMotionMediaQuery
        : ({
            matches: false,
            media: query,
            onchange: null,
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            dispatchEvent: vi.fn(),
          } as unknown as MediaQueryList),
    );

    render(
      <ThemeProvider global={false}>
        <span>Boundary content</span>
      </ThemeProvider>,
    );

    const boundary = screen.getByText('Boundary content').closest('[data-theme-boundary]');
    await waitFor(() => expect(boundary).toHaveAttribute('data-animation', 'enabled'));
    await waitFor(() =>
      expect(addEventListener).toHaveBeenCalledWith('change', expect.any(Function)),
    );
    expect(boundary).toHaveAttribute('data-motion-style', 'standard');
    expect(boundary).not.toHaveAttribute('data-motion-scope-fallback');

    reducedMotion = true;
    act(() => listener?.());

    await waitFor(() => {
      expect(boundary).toHaveAttribute('data-animation', 'disabled');
      expect(boundary).toHaveAttribute('data-motion-style', 'none');
      expect(boundary).toHaveAttribute('data-motion-scope-fallback', 'disabled');
    });

    reducedMotion = false;
    act(() => listener?.());

    await waitFor(() => {
      expect(boundary).toHaveAttribute('data-animation', 'enabled');
      expect(boundary).toHaveAttribute('data-motion-style', 'standard');
      expect(boundary).not.toHaveAttribute('data-motion-scope-fallback');
    });
  });

  it('uses legacy media-query listeners when change events are unavailable', async () => {
    let reducedMotion = false;
    let listener: (() => void) | undefined;
    const addListener = vi.fn((nextListener: () => void) => {
      listener = nextListener;
    });
    const removeListener = vi.fn();
    const mediaQuery = {
      get matches() {
        return reducedMotion;
      },
      media: '(prefers-reduced-motion: reduce)',
      onchange: null,
      addEventListener: undefined,
      removeEventListener: undefined,
      addListener,
      removeListener,
      dispatchEvent: vi.fn(),
    } as unknown as MediaQueryList;
    vi.spyOn(window, 'matchMedia').mockReturnValue(mediaQuery);

    const result = render(
      <AnimationProvider global={false}>
        <OptionalAnimationChecker />
      </AnimationProvider>,
    );

    await waitFor(() => expect(addListener).toHaveBeenCalledWith(expect.any(Function)));
    reducedMotion = true;
    act(() => listener?.());

    expect(screen.getByTestId('optional-reduced-motion')).toHaveTextContent('true');

    result.unmount();
    expect(removeListener).toHaveBeenCalledWith(listener);
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

  it('ignores invalid runtime brand mutations', () => {
    render(
      <ThemeProvider defaultBrand="blue" global={false}>
        <InvalidBrandControls />
      </ThemeProvider>,
    );

    fireEvent.click(screen.getByText('Invalid brand'));
    fireEvent.click(screen.getByText('Invalid custom brand'));

    expect(screen.getByTestId('guarded-brand')).toHaveTextContent('blue');
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

  it('keeps a low-level scoped AnimationProvider DOM-free unless scope is enabled', () => {
    const { container, rerender } = render(
      <AnimationProvider global={false}>
        <span data-testid="low-level-child">Child</span>
      </AnimationProvider>,
    );

    expect(container.firstElementChild).toBe(screen.getByTestId('low-level-child'));

    rerender(
      <AnimationProvider global={false} scope>
        <span data-testid="low-level-child">Child</span>
      </AnimationProvider>,
    );

    expect(container.firstElementChild).toHaveAttribute('data-motion-style', 'standard');
  });

  it('keeps scope DOM-free when a low-level AnimationProvider is global', async () => {
    const { container } = render(
      <AnimationProvider global scope defaultMotionStyle="pop">
        <span>Global child</span>
      </AnimationProvider>,
    );

    expect(container.firstElementChild).toHaveTextContent('Global child');
    expect(container.querySelector('[data-motion-style="pop"]')).toBeNull();
    await waitFor(() => {
      expect(document.documentElement).toHaveAttribute('data-motion-style', 'pop');
    });
  });

  it('preserves the innermost global motion owner through outer updates and unmounts', async () => {
    const OuterControls = () => {
      const { setAnimationEnabled } = useAnimation();
      return <button onClick={() => setAnimationEnabled(false)}>Disable outer</button>;
    };
    const GlobalProviders = ({ includeInner }: { includeInner: boolean }) => (
      <AnimationProvider defaultMotionStyle="pop">
        <OuterControls />
        {includeInner && (
          <AnimationProvider defaultMotionStyle="standard">
            <span>Inner provider</span>
          </AnimationProvider>
        )}
      </AnimationProvider>
    );
    const { rerender } = render(<GlobalProviders includeInner />);

    await waitFor(() => {
      expect(document.documentElement).toHaveAttribute('data-animation', 'enabled');
      expect(document.documentElement).toHaveAttribute('data-motion-style', 'standard');
    });

    fireEvent.click(screen.getByText('Disable outer'));
    await waitFor(() => {
      expect(document.documentElement).toHaveAttribute('data-animation', 'enabled');
      expect(document.documentElement).toHaveAttribute('data-motion-style', 'standard');
      expect(localStorage.getItem('poffy-animation-enabled')).toBe('true');
      expect(localStorage.getItem('poffy-motion-style')).toBe('standard');
    });

    rerender(<GlobalProviders includeInner={false} />);
    await waitFor(() => {
      expect(document.documentElement).toHaveAttribute('data-animation', 'disabled');
      expect(document.documentElement).toHaveAttribute('data-motion-style', 'none');
    });
  });

  it('restores document motion attributes after the final global provider unmounts', async () => {
    document.documentElement.setAttribute('data-animation', 'external');
    document.documentElement.setAttribute('data-motion-style', 'external');
    document.documentElement.setAttribute('data-motion-scope-fallback', 'external');
    const { unmount } = render(
      <AnimationProvider defaultAnimationEnabled={false}>
        <span>Global child</span>
      </AnimationProvider>,
    );

    await waitFor(() => {
      expect(document.documentElement).toHaveAttribute('data-animation', 'disabled');
    });
    unmount();

    expect(document.documentElement).toHaveAttribute('data-animation', 'external');
    expect(document.documentElement).toHaveAttribute('data-motion-style', 'external');
    expect(document.documentElement).toHaveAttribute('data-motion-scope-fallback', 'external');
  });

  it('restores document motion attributes after StrictMode effect replay', async () => {
    document.documentElement.setAttribute('data-animation', 'external');
    document.documentElement.setAttribute('data-motion-style', 'external');
    document.documentElement.setAttribute('data-motion-scope-fallback', 'external');
    const { unmount } = render(
      <StrictMode>
        <AnimationProvider defaultAnimationEnabled={false}>
          <span>Global child</span>
        </AnimationProvider>
      </StrictMode>,
    );

    await waitFor(() => {
      expect(document.documentElement).toHaveAttribute('data-animation', 'disabled');
    });
    unmount();

    expect(document.documentElement).toHaveAttribute('data-animation', 'external');
    expect(document.documentElement).toHaveAttribute('data-motion-style', 'external');
    expect(document.documentElement).toHaveAttribute('data-motion-scope-fallback', 'external');
  });

  it('restores and reapplies global motion attributes when global ownership changes', async () => {
    document.documentElement.setAttribute('data-animation', 'external');
    document.documentElement.setAttribute('data-motion-style', 'external');
    document.documentElement.setAttribute('data-motion-scope-fallback', 'external');
    const Animation = ({ global }: { global: boolean }) => (
      <AnimationProvider global={global} defaultAnimationEnabled={false}>
        <span>Global child</span>
      </AnimationProvider>
    );
    const { rerender } = render(<Animation global />);

    await waitFor(() => {
      expect(document.documentElement).toHaveAttribute('data-animation', 'disabled');
    });
    rerender(<Animation global={false} />);

    await waitFor(() => {
      expect(document.documentElement).toHaveAttribute('data-animation', 'external');
      expect(document.documentElement).toHaveAttribute('data-motion-style', 'external');
      expect(document.documentElement).toHaveAttribute('data-motion-scope-fallback', 'external');
    });
    rerender(<Animation global />);

    await waitFor(() => {
      expect(document.documentElement).toHaveAttribute('data-animation', 'disabled');
      expect(document.documentElement).toHaveAttribute('data-motion-style', 'none');
    });
  });

  it('restores preferences before re-enabling global motion ownership', async () => {
    localStorage.setItem('poffy-animation-enabled', 'true');
    localStorage.setItem('poffy-motion-style', 'pop');
    const Animation = ({ global }: { global: boolean }) => (
      <AnimationProvider
        global={global}
        defaultAnimationEnabled={false}
        defaultMotionStyle="standard"
      >
        <span>Global child</span>
      </AnimationProvider>
    );
    const { rerender } = render(<Animation global={false} />);
    const setAttribute = vi.spyOn(document.documentElement, 'setAttribute');

    rerender(<Animation global />);

    await waitFor(() => {
      expect(document.documentElement).toHaveAttribute('data-animation', 'enabled');
      expect(document.documentElement).toHaveAttribute('data-motion-style', 'pop');
    });
    expect(setAttribute).not.toHaveBeenCalledWith('data-animation', 'disabled');
  });

  it('keeps every document-level theme concern owned by the innermost global provider', async () => {
    const OuterThemeControls = () => {
      const { setBrand } = useBrand();
      const { setColorMode } = useColorMode();
      const { setLocale } = useLocale();
      const { setDir } = useDirection();
      return (
        <>
          <button onClick={() => setBrand('pome')}>Set outer brand</button>
          <button onClick={() => setColorMode('dark')}>Set outer color mode</button>
          <button onClick={() => setLocale('ja-JP')}>Set outer locale</button>
          <button onClick={() => setDir('rtl')}>Set outer direction</button>
        </>
      );
    };
    const Providers = ({ includeInner }: { includeInner: boolean }) => (
      <ThemeProvider>
        <OuterThemeControls />
        {includeInner && (
          <ThemeProvider
            defaultBrand="blue"
            defaultColorMode="light"
            defaultLocale="en-US"
            defaultDir="ltr"
          >
            <span>Inner theme</span>
          </ThemeProvider>
        )}
      </ThemeProvider>
    );
    const { rerender } = render(<Providers includeInner />);

    await waitFor(() => {
      expect(document.documentElement).toHaveAttribute('data-brand', 'blue');
      expect(document.documentElement).toHaveAttribute('data-theme', 'light');
      expect(document.documentElement).toHaveAttribute('lang', 'en-US');
      expect(document.documentElement).toHaveAttribute('dir', 'ltr');
    });

    fireEvent.click(screen.getByText('Set outer brand'));
    fireEvent.click(screen.getByText('Set outer color mode'));
    fireEvent.click(screen.getByText('Set outer locale'));
    fireEvent.click(screen.getByText('Set outer direction'));

    await waitFor(() => {
      expect(document.documentElement).toHaveAttribute('data-brand', 'blue');
      expect(document.documentElement).toHaveAttribute('data-theme', 'light');
      expect(document.documentElement).toHaveAttribute('lang', 'en-US');
      expect(document.documentElement).toHaveAttribute('dir', 'ltr');
      expect(localStorage.getItem('poffy-brand')).toBe('blue');
      expect(localStorage.getItem('poffy-color-mode')).toBe('light');
    });

    rerender(<Providers includeInner={false} />);
    await waitFor(() => {
      expect(document.documentElement).toHaveAttribute('data-brand', 'pome');
      expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
      expect(document.documentElement).toHaveAttribute('lang', 'ja-JP');
      expect(document.documentElement).toHaveAttribute('dir', 'rtl');
    });
  });

  it('restores pre-existing global theme attributes, classes, and custom brand variables', async () => {
    document.documentElement.setAttribute('data-brand', 'external');
    document.documentElement.setAttribute('data-theme', 'external');
    document.documentElement.setAttribute('lang', 'external');
    document.documentElement.setAttribute('dir', 'external');
    document.documentElement.classList.add('light', 'dark');
    document.documentElement.style.setProperty('--poffy-custom-main', '#123456', 'important');
    const { unmount } = render(
      <ThemeProvider
        defaultBrand="custom"
        customBrand={{ main: '#abcdef' }}
        defaultColorMode="dark"
        defaultLocale="ja-JP"
        defaultDir="rtl"
      >
        <span>Global theme</span>
      </ThemeProvider>,
    );

    await waitFor(() => {
      expect(document.documentElement).toHaveAttribute('data-brand', 'custom');
      expect(document.documentElement.style.getPropertyValue('--poffy-custom-main')).toBe(
        '#abcdef',
      );
    });
    unmount();

    expect(document.documentElement).toHaveAttribute('data-brand', 'external');
    expect(document.documentElement).toHaveAttribute('data-theme', 'external');
    expect(document.documentElement).toHaveAttribute('lang', 'external');
    expect(document.documentElement).toHaveAttribute('dir', 'external');
    expect(document.documentElement.classList).toContain('light');
    expect(document.documentElement.classList).toContain('dark');
    expect(document.documentElement.style.getPropertyValue('--poffy-custom-main')).toBe('#123456');
    expect(document.documentElement.style.getPropertyPriority('--poffy-custom-main')).toBe(
      'important',
    );
  });

  it('restores document ownership after StrictMode effect replay', async () => {
    document.documentElement.setAttribute('data-theme', 'external');
    document.documentElement.setAttribute('data-brand', 'external');
    document.documentElement.setAttribute('lang', 'external');
    document.documentElement.setAttribute('dir', 'external');
    const { unmount } = render(
      <StrictMode>
        <ThemeProvider
          defaultColorMode="dark"
          defaultBrand="pome"
          defaultLocale="ja-JP"
          defaultDir="rtl"
        >
          <span>Strict theme</span>
        </ThemeProvider>
      </StrictMode>,
    );

    await waitFor(() => expect(document.documentElement).toHaveAttribute('data-theme', 'dark'));
    unmount();

    expect(document.documentElement).toHaveAttribute('data-theme', 'external');
    expect(document.documentElement).toHaveAttribute('data-brand', 'external');
    expect(document.documentElement).toHaveAttribute('lang', 'external');
    expect(document.documentElement).toHaveAttribute('dir', 'external');
  });

  it('persists and restores a custom brand palette', async () => {
    const palette = { main: '#123456', contrast: '#ffffff', mainDark: '#654321' };
    const { unmount } = render(
      <ThemeProvider defaultBrand="custom" customBrand={palette}>
        <span>Custom brand</span>
      </ThemeProvider>,
    );

    await waitFor(() => {
      expect(localStorage.getItem('poffy-brand')).toBe('custom');
      expect(localStorage.getItem('poffy-custom-brand')).toBe(JSON.stringify(palette));
    });
    unmount();

    render(
      <ThemeProvider>
        <ContextChecker />
      </ThemeProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('brand')).toHaveTextContent('custom');
      expect(document.documentElement.style.getPropertyValue('--poffy-custom-main')).toBe(
        '#123456',
      );
      expect(document.documentElement.style.getPropertyValue('--poffy-custom-main-dark')).toBe(
        '#654321',
      );
    });
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

  it('overrides existing token variables globally and restores the host value on unmount', async () => {
    document.documentElement.style.setProperty('--poffy-spacing-md', '2rem', 'important');
    const { unmount } = render(
      <ThemeProvider tokenOverrides={{ '--poffy-spacing-md': '0.75rem' }}>
        <span>Token override</span>
      </ThemeProvider>,
    );

    await waitFor(() => {
      expect(document.documentElement.style.getPropertyValue('--poffy-spacing-md')).toBe('0.75rem');
    });
    unmount();

    expect(document.documentElement.style.getPropertyValue('--poffy-spacing-md')).toBe('2rem');
    expect(document.documentElement.style.getPropertyPriority('--poffy-spacing-md')).toBe(
      'important',
    );
  });

  it('restores the previous global token override when a newer owner unmounts', async () => {
    document.documentElement.style.setProperty('--poffy-radii-md', '3px');
    const outer = render(
      <ThemeProvider tokenOverrides={{ '--poffy-radii-md': '8px' }}>
        <span>Outer token override</span>
      </ThemeProvider>,
    );
    const inner = render(
      <ThemeProvider tokenOverrides={{ '--poffy-radii-md': '12px' }}>
        <span>Inner token override</span>
      </ThemeProvider>,
    );

    await waitFor(() => {
      expect(document.documentElement.style.getPropertyValue('--poffy-radii-md')).toBe('12px');
    });
    inner.unmount();
    await waitFor(() => {
      expect(document.documentElement.style.getPropertyValue('--poffy-radii-md')).toBe('8px');
    });
    outer.unmount();

    expect(document.documentElement.style.getPropertyValue('--poffy-radii-md')).toBe('3px');
  });

  it('composes independent token keys from overlapping global providers', async () => {
    document.documentElement.style.setProperty('--poffy-spacing-md', '2rem');
    document.documentElement.style.setProperty('--poffy-radii-md', '3px');
    const outer = render(
      <ThemeProvider tokenOverrides={{ '--poffy-spacing-md': '0.75rem' }}>
        <span>Outer composed token override</span>
      </ThemeProvider>,
    );
    const inner = render(
      <ThemeProvider tokenOverrides={{ '--poffy-radii-md': '12px' }}>
        <span>Inner composed token override</span>
      </ThemeProvider>,
    );

    await waitFor(() => {
      expect(document.documentElement.style.getPropertyValue('--poffy-spacing-md')).toBe('0.75rem');
      expect(document.documentElement.style.getPropertyValue('--poffy-radii-md')).toBe('12px');
    });
    inner.unmount();
    await waitFor(() => {
      expect(document.documentElement.style.getPropertyValue('--poffy-radii-md')).toBe('3px');
    });
    outer.unmount();

    expect(document.documentElement.style.getPropertyValue('--poffy-spacing-md')).toBe('2rem');
  });

  it('restores removed token keys and applies added keys after a provider rerender', async () => {
    document.documentElement.style.setProperty('--poffy-spacing-md', '2rem');
    document.documentElement.style.setProperty('--poffy-radii-md', '3px');
    const { rerender } = render(
      <ThemeProvider tokenOverrides={{ '--poffy-spacing-md': '0.75rem' }}>
        <span>Changing token override</span>
      </ThemeProvider>,
    );

    await waitFor(() => {
      expect(document.documentElement.style.getPropertyValue('--poffy-spacing-md')).toBe('0.75rem');
    });
    rerender(
      <ThemeProvider tokenOverrides={{ '--poffy-radii-md': '12px' }}>
        <span>Changing token override</span>
      </ThemeProvider>,
    );

    await waitFor(() => {
      expect(document.documentElement.style.getPropertyValue('--poffy-spacing-md')).toBe('2rem');
      expect(document.documentElement.style.getPropertyValue('--poffy-radii-md')).toBe('12px');
    });
  });

  it('scopes token overrides to a non-global provider boundary and includes them in SSR output', () => {
    const markup = renderToString(
      <ThemeProvider global={false} tokenOverrides={{ '--poffy-fonts-body': 'Inter, sans-serif' }}>
        <span>Scoped token override</span>
      </ThemeProvider>,
    );
    expect(markup).toContain('--poffy-fonts-body:Inter, sans-serif');

    render(
      <ThemeProvider global={false} tokenOverrides={{ '--poffy-fonts-body': 'Inter, sans-serif' }}>
        <span>Scoped token override</span>
      </ThemeProvider>,
    );

    const boundary = screen.getByText('Scoped token override').closest('[data-theme-boundary]');
    expect(boundary).toHaveStyle({ '--poffy-fonts-body': 'Inter, sans-serif' });
    expect(document.documentElement.style.getPropertyValue('--poffy-fonts-body')).toBe('');
  });

  it('does not promote a parent scoped token override through a nested global provider', async () => {
    document.documentElement.style.removeProperty('--poffy-spacing-md');
    render(
      <ThemeProvider global={false} tokenOverrides={{ '--poffy-spacing-md': '0.75rem' }}>
        <ThemeProvider tokenOverrides={{ '--poffy-radii-md': '12px' }}>
          <span>Nested global theme</span>
        </ThemeProvider>
      </ThemeProvider>,
    );

    await waitFor(() => {
      expect(document.documentElement.style.getPropertyValue('--poffy-radii-md')).toBe('12px');
    });
    expect(document.documentElement.style.getPropertyValue('--poffy-spacing-md')).toBe('');
    expect(screen.getByText('Nested global theme').closest('[data-theme-boundary]')).toHaveStyle(
      '--poffy-spacing-md: 0.75rem',
    );
  });

  it('carries parent scoped overrides into portals below a nested global provider', async () => {
    document.documentElement.style.removeProperty('--poffy-spacing-md');
    render(
      <ThemeProvider global={false} tokenOverrides={{ '--poffy-spacing-md': '0.75rem' }}>
        <ThemeProvider tokenOverrides={{ '--poffy-radii-md': '12px' }}>
          <Portal scopeProviders>
            <span>Nested global portalled token override</span>
          </Portal>
        </ThemeProvider>
      </ThemeProvider>,
    );

    const content = await screen.findByText('Nested global portalled token override');
    const portalScope = content.parentElement;
    expect(document.documentElement.style.getPropertyValue('--poffy-spacing-md')).toBe('');
    expect(document.documentElement.style.getPropertyValue('--poffy-radii-md')).toBe('12px');
    expect(portalScope).toHaveStyle('--poffy-spacing-md: 0.75rem');
    expect(portalScope).toHaveStyle('--poffy-radii-md: 12px');
  });

  it('reserves custom brand variables for the customBrand API', () => {
    render(
      <ThemeProvider
        global={false}
        defaultBrand="custom"
        customBrand={{ main: '#8B5CF6' }}
        tokenOverrides={{ '--poffy-custom-main': '#DC2626', '--poffy-custom-accent': '#F97316' }}
      >
        <span>Custom brand token override</span>
      </ThemeProvider>,
    );

    const boundary = screen
      .getByText('Custom brand token override')
      .closest('[data-theme-boundary]');
    expect(boundary).toHaveStyle({ '--poffy-custom-main': '#8B5CF6' });
    expect(boundary).not.toHaveStyle({ '--poffy-custom-accent': '#F97316' });
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
