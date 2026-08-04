'use client';

import { useOptionalAnimation } from '@/providers/AnimationProvider';
import { applyMotionStyle } from '@/providers/motionStyle';
import { createContext, useContext, useMemo, useState } from 'react';
import { resolvePresetKey } from '../utils';
import { useHydrated } from '../useHydrated';
import { pathDrawVariants, type PathDrawTransitionType } from './PathDrawTransition.presets';

/** Context for inherited PathDrawTransition animation defaults. */
export const PathDrawContext = createContext<{
  animationType: PathDrawTransitionType;
  customData?: Record<string, unknown>;
  isVisible: boolean;
}>({
  animationType: 'draw',
  isVisible: true,
});

/**
 * Resolves inherited path drawing animation props for SVG stroke primitives.
 */
export const usePathDrawAnimation = (
  animationType: PathDrawTransitionType | undefined,
  customData: Record<string, unknown> | undefined,
) => {
  const parent = useContext(PathDrawContext);
  const { isAnimating, resolvedMotionStyle } = useOptionalAnimation();
  const isHydrated = useHydrated();
  const [animationState, setAnimationState] = useState<{
    isVisible: boolean;
    isAnimating: boolean;
    target: 'animate' | 'enter' | 'exit';
  }>(() => ({
    isVisible: parent.isVisible,
    isAnimating,
    target: parent.isVisible ? (isAnimating ? 'enter' : 'animate') : 'exit',
  }));

  if (
    animationState.isVisible !== parent.isVisible ||
    animationState.isAnimating !== isAnimating
  ) {
    setAnimationState({
      isVisible: parent.isVisible,
      isAnimating,
      target:
        animationState.isVisible !== parent.isVisible || !isAnimating
          ? parent.isVisible
            ? 'animate'
            : 'exit'
          : animationState.target,
    });
  }
  const effectiveType = resolvePresetKey(
    pathDrawVariants,
    animationType ?? parent.animationType,
    'draw',
  );
  const effectiveCustomData = customData ?? parent.customData;
  const preset = pathDrawVariants[effectiveType];
  const transition = useMemo(
    () =>
      typeof preset.transition === 'function'
        ? preset.transition(effectiveCustomData)
        : preset.transition,
    [preset, effectiveCustomData],
  );

  return {
    animate: isHydrated
      ? isAnimating
        ? animationState.target
        : parent.isVisible
          ? 'animate'
          : 'exit'
      : undefined,
    exit: isHydrated ? 'exit' : undefined,
    initial: parent.isVisible ? false : 'exit',
    transition: applyMotionStyle(transition, isAnimating ? resolvedMotionStyle : 'none'),
    variants: applyMotionStyle(preset, isAnimating ? resolvedMotionStyle : 'none'),
  };
};
