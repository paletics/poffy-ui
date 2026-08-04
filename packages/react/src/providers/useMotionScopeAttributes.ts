'use client';

import { useHydrated } from '@/components/animations/useHydrated';
import type { PoffyMotionStyle } from './AnimationProvider.types';

/**
 * Resolves the motion attributes consumed by recipe CSS at a DOM scope boundary.
 * The fallback state intentionally begins as false for SSR parity and is checked
 * after mount only when browser CSS APIs are available.
 */
export const useMotionScopeAttributes = (isAnimating: boolean, motionStyle: PoffyMotionStyle) => {
  const isHydrated = useHydrated();
  const usesScopeFallback = isHydrated && typeof CSSScopeRule === 'undefined';

  return {
    'data-animation': isAnimating ? 'enabled' : 'disabled',
    'data-motion-scope-fallback': usesScopeFallback && !isAnimating ? 'disabled' : undefined,
    'data-motion-style': motionStyle,
  };
};
