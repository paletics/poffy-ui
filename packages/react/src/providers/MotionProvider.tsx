'use client';

import { LazyMotion, MotionConfig } from 'motion/react';
import { ReactElement } from 'react';
import { useOptionalAnimation } from './AnimationProvider';
import type { MotionProviderProps } from './MotionProvider.types';

/**
 * Public MotionProvider props.
 */
export type { MotionProviderProps } from './MotionProvider.types';

// Async loader for `domMax`. Deferred off the critical path so the initial bundle stays lean.
// `domMax` (not `domAnimation`) is required: core components use `layout`, `drag`, and `LayoutGroup`.
const loadDomMax = (): Promise<import('motion/react').FeatureBundle> =>
  import('motion/react').then((mod) => mod.domMax);

/**
 * Provides Motion's feature and reduced-motion contexts to the component tree.
 *
 * ### Why this provider exists
 * Raw `motion.*` components bundle every Framer Motion feature at import time.
 * By replacing them with `m.*` components (via `getMotionComponent`) and wrapping
 * the tree in `LazyMotion`, the feature set is loaded asynchronously — keeping the
 * critical-path bundle lean.
 *
 * It also maps `AnimationProvider`'s app-level animation preference into
 * Motion's native `MotionConfig reducedMotion` policy:
 *
 * - `isAnimating=true` -> `reducedMotion="user"` (respect the OS setting)
 * - `isAnimating=false` -> `reducedMotion="always"` (force reduced motion)
 *
 * ### AI Context & Architecture
 * - **Tier**: Provider / Infrastructure
 * - **Scope**: App Root — included automatically inside `ThemeProvider`
 * - **Strict mode**: disabled intentionally to allow gradual migration of any remaining
 *   `motion.*` direct imports without breaking dev warnings.
 *
 * ### AI Usage
 * - **DO**: Use `ThemeProvider` — it already includes this provider.
 * - **DO**: Use this standalone when embedding Poffy UI without `ThemeProvider`.
 * - **DO**: Pass `features={domMax}` (sync) if you need animations on the very first frame.
 * - **DON'T**: Pass `features={domAnimation}` unless you have verified that no components
 *   in your tree use `layout`, `drag`, `LayoutGroup`, or `layoutId` — they will silently degrade.
 *
 * @example Standalone usage (no ThemeProvider)
 * ```tsx
 * import { MotionProvider } from '@poffy-ui/react';
 *
 * export default function Layout({ children }) {
 *   return <MotionProvider>{children}</MotionProvider>;
 * }
 * ```
 *
 * @example Synchronous features (no deferral)
 * ```tsx
 * import { MotionProvider } from '@poffy-ui/react';
 * import { domMax } from 'motion/react';
 *
 * <MotionProvider features={domMax}>{children}</MotionProvider>
 * ```
 */
export const MotionProvider = ({
  children,
  features = loadDomMax,
}: MotionProviderProps): ReactElement => {
  const { isAnimating } = useOptionalAnimation();

  return (
    <LazyMotion features={features}>
      <MotionConfig reducedMotion={isAnimating ? 'user' : 'always'}>{children}</MotionConfig>
    </LazyMotion>
  );
};
