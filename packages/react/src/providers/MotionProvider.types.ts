import type { ReactNode } from 'react';
import type { FeatureBundle, LazyFeatureBundle } from 'motion/react';

/**
 * Props for the `MotionProvider` component.
 *
 * ### Notes
 * Most applications should receive this through `ThemeProvider`.
 * Configure directly only when embedding motion-enabled components without the
 * full theme provider stack.
 *
 * When paired with `AnimationProvider`, `MotionProvider` maps app-level
 * animation preferences to Motion's native `MotionConfig reducedMotion` policy.
 *
 * ### AI Usage
 * - **DO**: Keep the default async `domMax` unless bundle strategy requires a different feature loader.
 * - **DON'T**: Switch to `domAnimation` when using layout, drag, or `layoutId` animations.
 */
export interface MotionProviderProps {
  /** The React subtree that receives Framer Motion's feature context. */
  children: ReactNode;
  /**
   * The Framer Motion feature bundle to load.
   *
   * Pass a synchronous `FeatureBundle` (e.g. `domMax`) or an async loader function
   * `() => Promise<FeatureBundle>` to defer feature loading off the critical path.
   *
   * **Default**: async `domMax` — loaded after initial render to keep the critical-path bundle lean.
   * `domMax` is required because core components use `layout` and `drag` props
   * (e.g. `LayoutTransition`, `DragMotion`, `Puff`, `ExpandableCard`).
   *
   * Override with `domAnimation` only when your application does not use any of those components,
   * accepting that `layout` animations will silently degrade.
   *
   * @example Explicit async domMax (same as default)
   * ```tsx
   * import { MotionProvider } from '@poffy-ui/react';
   * import { domMax } from 'motion/react';
   *
   * const loadFeatures = () => Promise.resolve(domMax);
   * <MotionProvider features={loadFeatures}>…</MotionProvider>
   * ```
   *
   * @example Synchronous domMax (simpler, no deferral)
   * ```tsx
   * import { MotionProvider } from '@poffy-ui/react';
   * import { domMax } from 'motion/react';
   *
   * <MotionProvider features={domMax}>…</MotionProvider>
   * ```
   */
  features?: FeatureBundle | LazyFeatureBundle;
}
