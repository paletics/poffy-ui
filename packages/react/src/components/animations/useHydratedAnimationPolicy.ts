'use client';

import { useOptionalAnimation } from '@/providers/AnimationProvider';
import { useHydrated } from './useHydrated';

/** Combines the resolved animation preference with client hydration readiness. */
export const useHydratedAnimationPolicy = () => {
  const animationPolicy = useOptionalAnimation();
  const isHydrated = useHydrated();

  return {
    ...animationPolicy,
    isHydrated,
    shouldAnimate: animationPolicy.isAnimating && isHydrated,
  };
};
