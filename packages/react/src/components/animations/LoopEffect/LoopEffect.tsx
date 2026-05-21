'use client';

import { Slot } from '@radix-ui/react-slot';
import { forwardRef, ReactNode, useMemo } from 'react';
import { Variants } from 'motion/react';
import { useOptionalAnimation } from '@/providers/AnimationProvider';
import { getMotionComponent } from '../utils';
import { loopVariants } from './LoopEffect.presets';
import { LoopAnimationType, LoopEffectProps } from './LoopEffect.types';

/**
 * A component that applies continuous, repeating animations (e.g. floating, spinning) to its children.
 * ### AI Context & Architecture
 * - Tier: Atoms, Stack: Framer Motion (Infinite animations), Radix Slot
 * ### Design Tokens
 * - duration: Animation cycles are inherently tied to Silver Ratio durations (e.g., 2.8s) to maintain system rhythm.
 * ### Variant Logic
 * - animationType: 'float', 'pulse', 'spin', 'shake', 'bounce'.
 * @example
 * ```tsx
 * import { LoopEffect } from '@poffy-ui/react';
 *
 * <LoopEffect animationType="float" asChild>
 *   <div className="icon">Status</div>
 * </LoopEffect>
 * ```
 * ### Notes
 * Utilizes Framer Motion's `repeat: Infinity` mechanics. Pausable via the `isPaused` prop to save CPU cycles.
 * ### Accessibility
 * - Continuous motion can trigger vestibular disorders. Consider tying `isPaused` to user preference or viewport visibility.
 * ### AI Usage
 * - **DO**: Use for ambient, non-interactive visual flair such as loaders, badges, and floating hero images.
 * - **DO**: Pause with `isPaused` when the effect is offscreen or no longer relevant.
 * - **DON'T**: Use on large layout containers; restrict to isolated visual atoms.
 */
export const LoopEffect = forwardRef<HTMLDivElement, LoopEffectProps>(
  (
    {
      asChild,
      animationType = 'float',
      isPaused = false,
      duration,
      customData,
      children,
      className,
      style,
      ...rest
    },
    ref,
  ) => {
    const Component = useMemo(() => getMotionComponent(asChild ? Slot : 'div'), [asChild]);
    const { isAnimating } = useOptionalAnimation();

    const animationKey = animationType as LoopAnimationType;
    const variants = loopVariants[animationKey];

    const isStatic = [isPaused, animationType === 'none', !isAnimating].some(Boolean);

    return (
      // eslint-disable-next-line react-hooks/static-components -- Component is resolved through the shared motion cache for polymorphic asChild support.
      <Component
        ref={ref}
        className={className}
        style={style}
        {...rest}
        variants={isStatic ? undefined : (variants as unknown as Variants)}
        animate={isStatic ? undefined : 'animate'}
        custom={isStatic ? undefined : { ...customData, duration }}
      >
        {children as ReactNode}
      </Component>
    );
  },
);

LoopEffect.displayName = 'LoopEffect';
