import type { ReactNode } from 'react';

/**
 * The visual character used for Poffy UI motion.
 *
 * `none` disables app animation; system reduced-motion preferences also resolve
 * to `none` regardless of this preference.
 */
export type PoffyMotionStyle = 'subtle' | 'standard' | 'pop' | 'none';

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
   * `true` only when `animationEnabled` is `true`, `motionStyle` is not `none`,
   * and `reducedMotion` is `false`.
   * Use this as the single source of truth in FX components.
   */
  isAnimating: boolean;
  /** The app or user-selected motion style before accessibility resolution. */
  motionStyle: PoffyMotionStyle;
  /**
   * The effective motion style. This is always `none` when animation is disabled
   * or the operating system requests reduced motion.
   */
  resolvedMotionStyle: PoffyMotionStyle;
  /**
   * Explicitly enable or disable animations. Overrides the default but is always
   * superseded by `reducedMotion` when computing `isAnimating`.
   */
  setAnimationEnabled: (enabled: boolean) => void;
  /** Toggles `animationEnabled` between `true` and `false`. */
  toggleAnimation: () => void;
  /** Sets the visual character used by animation primitives. */
  setMotionStyle: (style: PoffyMotionStyle) => void;
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
   * The visual character used by animation primitives before a persisted global
   * user preference is restored after hydration.
   *
   * @defaultValue `'standard'`
   */
  defaultMotionStyle?: PoffyMotionStyle;
  /**
   * When `true`, syncs `data-animation` to `document.documentElement` and
   * persists animation preferences to `localStorage`.
   * Set to `false` when scoping animation control to a subtree only.
   *
   * @defaultValue `true`
   */
  global?: boolean;
  /**
   * Document whose Window supplies reduced-motion preferences and whose root
   * and storage receive global motion state.
   */
  ownerDocument?: Document;
  /**
   * Adds a neutral DOM boundary carrying resolved CSS motion attributes when
   * `global={false}`. Has no effect when `global={true}`.
   * @defaultValue `false`
   */
  scope?: boolean;
}
