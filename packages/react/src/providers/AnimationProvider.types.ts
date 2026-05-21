import type { ReactNode } from 'react';

/**
 * Shape of the value exposed by `AnimationContext`.
 * Use to type the return value of `useAnimation()` or when extending the context.
 */
export interface AnimationContextType {
  /**
   * Whether the user's OS has requested reduced motion (`prefers-reduced-motion: reduce`).
   * Read-only — derived from the system media query.
   */
  reducedMotion: boolean;
  /**
   * Whether animations are explicitly enabled by the app or user.
   * Controlled via `setAnimationEnabled`. Persisted to `localStorage` when `global=true`.
   */
  animationEnabled: boolean;
  /**
   * The resolved animation state.
   * `true` only when `animationEnabled` is `true` **and** `reducedMotion` is `false`.
   * Use this as the single source of truth in FX components.
   */
  isAnimating: boolean;
  /**
   * Explicitly enable or disable animations. Overrides the default but is always
   * superseded by `reducedMotion` when computing `isAnimating`.
   */
  setAnimationEnabled: (enabled: boolean) => void;
  /** Toggles `animationEnabled` between `true` and `false`. */
  toggleAnimation: () => void;
}

/**
 * Props for the `AnimationProvider` component.
 */
export interface AnimationProviderProps {
  /** The React subtree that receives animation context. */
  children: ReactNode;
  /**
   * Whether animations are enabled on first render.
   * If the OS reports `prefers-reduced-motion: reduce`, `isAnimating` will be `false`
   * regardless of this value.
   *
   * @defaultValue `true`
   */
  defaultAnimationEnabled?: boolean;
  /**
   * When `true`, syncs `data-animation` to `document.documentElement` and
   * persists `animationEnabled` to `localStorage`.
   * Set to `false` when scoping animation control to a subtree only.
   *
   * @defaultValue `true`
   */
  global?: boolean;
}
