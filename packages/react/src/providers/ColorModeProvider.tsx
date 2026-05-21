'use client';

import {
  createContext,
  ReactElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from 'react';
import type {
  ColorModeContextType,
  ColorModeProviderProps,
  PoffyResolvedColorMode,
} from './ColorModeProvider.types';

/**
 * Public color mode provider context and props types.
 */
export type {
  PoffyColorMode,
  PoffyResolvedColorMode,
  ColorModeContextType,
} from './ColorModeProvider.types';

const ColorModeContext = createContext<ColorModeContextType | undefined>(undefined);

const subscribe = (callback: () => void): (() => void) => {
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  mq.addEventListener('change', callback);
  return () => mq.removeEventListener('change', callback);
};

const getSnapshot = (): PoffyResolvedColorMode =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

const getServerSnapshot = (): PoffyResolvedColorMode => 'light';

/**
 * Injects color mode state (`light` / `dark` / `system`) into the component tree
 * and exposes controls for runtime switching.
 *
 * ### AI Context & Architecture
 * - **Tier**: Provider / Infrastructure
 * - **Scope**: App Root — place once in `_app.tsx` or `layout.tsx`
 * - **SSR Safety**: `colorMode` lazy-initializes from `localStorage` (client-only, SSR guard applied).
 *   `systemTheme` uses `useSyncExternalStore` with a `'light'` server snapshot — no hydration mismatch.
 * - **Persistence**: `localStorage` write only occurs when `global=true`.
 *
 * ### AI Usage
 * - **DO**: Place at the top of the React tree, outside any routing or layout component.
 * - **DON'T**: Do not nest two `ColorModeProvider` instances — the inner one silently overrides the outer.
 * - **DON'T**: Set `global={false}` at the app root — CSS tokens will not resolve on `document.documentElement`.
 *
 * @example
 * ```tsx
 * import { ColorModeProvider } from '@poffy-ui/react';
 *
 * // App root — global mode (default)
 * <ColorModeProvider defaultColorMode="system">
 *   <App />
 * </ColorModeProvider>
 * ```
 *
 * @example
 * ```tsx
 * import { ColorModeProvider } from '@poffy-ui/react';
 *
 * // Scoped mode — does not touch document.documentElement
 * <ColorModeProvider defaultColorMode="dark" global={false}>
 *   <Widget />
 * </ColorModeProvider>
 * ```
 */
export const ColorModeProvider = ({
  children,
  defaultColorMode = 'light',
  global = true,
}: ColorModeProviderProps): ReactElement => {
  const [colorMode, setColorModeState] = useState(() => {
    if (typeof window === 'undefined') return defaultColorMode;
    if (!global) return defaultColorMode;
    try {
      const saved = localStorage.getItem('poffy-color-mode');
      if (saved === 'light' || saved === 'dark' || saved === 'system') return saved;
    } catch {
      // localStorage unavailable (e.g. private browsing, storage quota exceeded)
    }
    return defaultColorMode;
  });

  const systemTheme = useSyncExternalStore<PoffyResolvedColorMode>(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const resolvedColorMode: PoffyResolvedColorMode = useMemo(
    () => (colorMode === 'system' ? systemTheme : colorMode),
    [colorMode, systemTheme],
  );

  useEffect(() => {
    if (!global) return;

    document.documentElement.setAttribute('data-theme', resolvedColorMode);
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(resolvedColorMode);

    try {
      localStorage.setItem('poffy-color-mode', colorMode);
    } catch {
      // localStorage unavailable (e.g. private browsing, storage quota exceeded)
    }
  }, [resolvedColorMode, colorMode, global]);

  // Toggle based on resolvedColorMode — prevents 'system' being misread as 'light'
  const toggleColorMode = useCallback(() => {
    setColorModeState(resolvedColorMode === 'dark' ? 'light' : 'dark');
  }, [resolvedColorMode]);

  const value = useMemo(
    () => ({
      colorMode,
      resolvedColorMode,
      setColorMode: setColorModeState,
      toggleColorMode,
    }),
    [colorMode, resolvedColorMode, toggleColorMode],
  );

  return <ColorModeContext.Provider value={value}>{children}</ColorModeContext.Provider>;
};

/**
 * Returns the current color mode and controls from the nearest `ColorModeProvider`.
 *
 * ### AI Usage
 * - **DON'T**: Do not call outside a `ColorModeProvider` tree — throws at runtime
 *
 * @returns `{ colorMode, resolvedColorMode, setColorMode, toggleColorMode }`
 *
 * @example
 * ```tsx
 * import { useColorMode } from '@poffy-ui/react';
 *
 * const { colorMode, resolvedColorMode, setColorMode, toggleColorMode } = useColorMode();
 * ```
 */
export const useColorMode = (): ColorModeContextType => {
  const context = useContext(ColorModeContext);
  if (!context) {
    throw new Error('useColorMode must be used within a ColorModeProvider.');
  }
  return context;
};

/**
 * Returns the nearest color mode context when one exists.
 *
 * Use this only for provider-tolerant components that can fall back to their
 * own defaults. Application code should use `useColorMode()` so missing
 * providers fail loudly.
 */
export const useOptionalColorMode = (): ColorModeContextType | undefined =>
  useContext(ColorModeContext);
