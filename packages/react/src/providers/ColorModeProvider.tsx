'use client';

import { createContext, ReactElement, useCallback, useContext, useMemo, useState } from 'react';
import { useMediaQuery } from '@poffy-ui/behavior/hooks';
import type {
  ColorModeContextType,
  ColorModeProviderProps,
  PoffyResolvedColorMode,
} from './ColorModeProvider.types';
import { createGlobalDocumentOwnerStack } from './globalDocumentOwnership';
import { ProviderScope } from './ProviderScope';
import { useGlobalDocumentOwner } from './useGlobalDocumentOwner';
import { useGlobalPreferenceRestoreGate } from './useGlobalPreferenceRestoreGate';

/**
 * Public color mode provider context and props types.
 */
export type {
  PoffyColorMode,
  PoffyResolvedColorMode,
  ColorModeContextType,
} from './ColorModeProvider.types';

const ColorModeContext = createContext<ColorModeContextType | undefined>(undefined);
const COLOR_MODE_STORAGE_KEY = 'poffy-color-mode';

interface ColorModeDocumentState {
  colorMode: ColorModeContextType['colorMode'];
  resolvedColorMode: PoffyResolvedColorMode;
}

const colorModeOwnerStack = createGlobalDocumentOwnerStack<
  ColorModeDocumentState,
  { theme: string | null; light: boolean; dark: boolean }
>({
  capture: (targetDocument) => ({
    theme: targetDocument.documentElement.getAttribute('data-theme'),
    light: targetDocument.documentElement.classList.contains('light'),
    dark: targetDocument.documentElement.classList.contains('dark'),
  }),
  apply: (targetDocument, { resolvedColorMode }) => {
    targetDocument.documentElement.setAttribute('data-theme', resolvedColorMode);
    targetDocument.documentElement.classList.remove('light', 'dark');
    targetDocument.documentElement.classList.add(resolvedColorMode);
  },
  restore: (targetDocument, { theme, light, dark }) => {
    if (theme === null) targetDocument.documentElement.removeAttribute('data-theme');
    else targetDocument.documentElement.setAttribute('data-theme', theme);
    targetDocument.documentElement.classList.toggle('light', light);
    targetDocument.documentElement.classList.toggle('dark', dark);
  },
  onActiveChange: (targetDocument, { colorMode }) => {
    try {
      targetDocument.defaultView?.localStorage.setItem(COLOR_MODE_STORAGE_KEY, colorMode);
    } catch {
      // localStorage unavailable (e.g. private browsing, storage quota exceeded)
    }
  },
});

const DARK_MODE_QUERY = '(prefers-color-scheme: dark)';

/**
 * Provides light, dark, or system color mode to a subtree. At the application root, `global`
 * synchronizes the resolved mode to the owner document and restores the persisted preference after
 * hydration; with `global={false}` and `scope`, it applies only to the local subtree.
 */
export const ColorModeProvider = ({
  children,
  defaultColorMode = 'light',
  global = true,
  ownerDocument,
  scope = false,
}: ColorModeProviderProps): ReactElement => {
  const [colorMode, setColorModeState] = useState(defaultColorMode);

  const resolvedOwnerDocument =
    ownerDocument ?? (typeof document === 'undefined' ? undefined : document);
  const mediaWindow = resolvedOwnerDocument?.defaultView ?? null;
  const systemTheme: PoffyResolvedColorMode = useMediaQuery(DARK_MODE_QUERY, {
    targetWindow: mediaWindow,
  })
    ? 'dark'
    : 'light';

  const resolvedColorMode: PoffyResolvedColorMode = useMemo(
    () => (colorMode === 'system' ? systemTheme : colorMode),
    [colorMode, systemTheme],
  );

  const restorePreferences = useCallback(() => {
    try {
      const saved =
        resolvedOwnerDocument?.defaultView?.localStorage.getItem(COLOR_MODE_STORAGE_KEY);
      if (saved === 'light' || saved === 'dark' || saved === 'system') setColorModeState(saved);
    } catch {
      // localStorage unavailable (e.g. private browsing, storage quota exceeded)
    }
  }, [resolvedOwnerDocument]);

  const documentState = useMemo(
    () => ({ colorMode, resolvedColorMode }),
    [colorMode, resolvedColorMode],
  );
  const canOwnDocument = useGlobalPreferenceRestoreGate({
    enabled: global,
    restore: restorePreferences,
    restoreKey: resolvedOwnerDocument,
  });
  useGlobalDocumentOwner(colorModeOwnerStack, documentState, canOwnDocument, resolvedOwnerDocument);

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

  return (
    <ColorModeContext.Provider value={value}>
      {!global && scope ? (
        <ProviderScope colorMode={resolvedColorMode}>{children}</ProviderScope>
      ) : (
        children
      )}
    </ColorModeContext.Provider>
  );
};

/** Returns the nearest color-mode state and controls, or throws when no provider is present. */
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
