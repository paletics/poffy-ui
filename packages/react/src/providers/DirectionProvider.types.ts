import type { ReactNode } from 'react';

/**
 * Text directionality for the component tree.
 * - `'ltr'`: Left-to-right (default for most Western languages).
 * - `'rtl'`: Right-to-left (Arabic, Hebrew, Persian, etc.).
 * Pair with CSS logical properties (e.g. `margin-inline-start`) to handle both directions automatically.
 */
export type PoffyDirection = 'ltr' | 'rtl';

/**
 * Shape of the value exposed by `DirectionContext`.
 * Use to type the return value of `useDirection()` or when extending the context.
 */
export interface DirectionContextType {
  /** The currently active text direction. */
  dir: PoffyDirection;
  /** Sets the active text direction. */
  setDir: (dir: PoffyDirection) => void;
}

/**
 * Props for the `DirectionProvider` component.
 */
export interface DirectionProviderProps {
  /** The React subtree that receives direction context. */
  children: ReactNode;
  /**
   * The text direction applied on first render.
   *
   * @defaultValue `'ltr'`
   */
  defaultDir?: PoffyDirection;
  /**
   * When `true`, syncs the `dir` attribute to `document.documentElement`.
   * Set to `false` when scoping direction to a subtree only.
   *
   * @defaultValue `true`
   */
  global?: boolean;
  /**
   * Document whose root receives the global `dir` attribute. Use when rendering
   * into an iframe or another document. Defaults to the current document.
   */
  ownerDocument?: Document;
  /**
   * When `global={false}`, renders a local DOM boundary with the active `dir`.
   *
   * @defaultValue `false`
   */
  scope?: boolean;
}
