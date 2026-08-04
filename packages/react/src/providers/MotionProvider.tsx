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
 * Provides Motion features and maps the nearest animation preference to Motion's reduced-motion
 * policy. `ThemeProvider` includes it; use it directly only for a motion-enabled embedded subtree.
 * Keep the default `domMax` loader when its layout or drag features are required.
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
