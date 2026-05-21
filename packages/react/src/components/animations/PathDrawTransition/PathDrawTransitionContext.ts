'use client';

import { useOptionalAnimation } from '@/providers/AnimationProvider';
import { createContext, useContext, useMemo } from 'react';
import { pathDrawVariants, type PathDrawTransitionType } from './PathDrawTransition.presets';

/** Context for inherited PathDrawTransition animation defaults. */
export const PathDrawContext = createContext<{
  animationType: PathDrawTransitionType;
  customData?: Record<string, unknown>;
}>({
  animationType: 'draw',
});

/**
 * Resolves inherited path drawing animation props for SVG stroke primitives.
 */
export const usePathDrawAnimation = (
  animationType: PathDrawTransitionType | undefined,
  customData: Record<string, unknown> | undefined,
) => {
  const parent = useContext(PathDrawContext);
  const { isAnimating } = useOptionalAnimation();
  const effectiveType = animationType ?? parent.animationType;
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
    animate: isAnimating ? 'animate' : undefined,
    exit: isAnimating ? 'exit' : undefined,
    initial: isAnimating ? 'initial' : false,
    transition,
    variants: isAnimating ? preset : undefined,
  };
};
