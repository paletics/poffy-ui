import type { ReactNode } from 'react';

/**
 * Possible color modes for the application.
 */
export type PoffyColorMode = 'light' | 'dark' | 'system';

/**
 * The resolved color mode after `'system'` is evaluated against the OS preference.
 * Always `'light'` or `'dark'` — never `'system'`.
 */
export type PoffyResolvedColorMode = 'light' | 'dark';

/**
 * Shape of the value exposed by `ColorModeContext`.
 * Use to type the return value of `useColorMode()` or when extending the context.
 */
export interface ColorModeContextType {
  /** The current user-selected color mode (may be `'system'`). */
  colorMode: PoffyColorMode;
  /** The resolved color mode — always `'light'` or `'dark'`, never `'system'`. */
  resolvedColorMode: PoffyResolvedColorMode;
  /** Sets the color mode explicitly. */
  setColorMode: (mode: PoffyColorMode) => void;
  /** Toggles between `'light'` and `'dark'` based on the current resolved mode. */
  toggleColorMode: () => void;
}

/**
 * Props for the `ColorModeProvider` component.
 */
export interface ColorModeProviderProps {
  /** The React subtree that receives color mode context. */
  children: ReactNode;
  /**
   * The color mode applied on first render.
   *
   * @defaultValue `'light'`
   */
  defaultColorMode?: PoffyColorMode;
  /**
   * When `true`, syncs `data-theme` / class to `document.documentElement` and persists to `localStorage`.
   * Set to `false` when scoping theming to a subtree only.
   *
   * @defaultValue `true`
   */
  global?: boolean;
  /**
   * Document whose Window supplies system color preferences and whose root and
   * storage receive global color-mode state.
   */
  ownerDocument?: Document;
  /**
   * When `global={false}`, renders a local DOM boundary with the resolved
   * `data-theme` attribute and matching `light` / `dark` class.
   *
   * @defaultValue `false`
   */
  scope?: boolean;
}
