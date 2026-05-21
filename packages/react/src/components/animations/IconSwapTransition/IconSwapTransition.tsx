'use client';

import { Slot } from '@radix-ui/react-slot';
import { AnimatePresence } from 'motion/react';
import { useOptionalAnimation } from '@/providers/AnimationProvider';
import { forwardRef, ReactNode, useMemo } from 'react';
import { getMotionComponent } from '../utils';
import { iconSwapVariants } from './IconSwapTransition.presets';
import { IconSwapAnimationType, IconSwapTransitionProps } from './IconSwapTransition.types';

/**
 * A keyed transition wrapper for replacing compact icon or status content.
 * ### AI Context & Architecture
 * - Tier: Atoms, Stack: Framer Motion (`AnimatePresence`), Radix Slot
 * ### Design Tokens
 * - transition: Uses Silver Ratio springs and durations from `iconSwapVariants`.
 * ### Variant Logic
 * - `fade`: low-emphasis replacement.
 * - `pop`: default feedback for success/error icon swaps.
 * - `rotate`: directional icon replacement such as disclosure or refresh states.
 * - `slide`: compact vertical status replacement.
 * @example
 * ```tsx
 * import { IconSwapTransition } from '@poffy-ui/react';
 *
 * <IconSwapTransition transitionKey={copied ? 'copied' : 'copy'}>
 *   {copied ? <CheckIcon /> : <CopyIcon />}
 * </IconSwapTransition>
 * ```
 * ### Notes
 * The `transitionKey` must change when the visual child changes. Without a stable
 * key boundary, React reuses the previous child and no exit animation can run.
 * ### Accessibility
 * - Respects `prefers-reduced-motion`.
 * - Does not announce status changes by itself; pair with `aria-label`, `aria-live`, or
 *   visible text on the owning component when the state change is meaningful.
 * ### AI Usage
 * - **DO**: Use in CopyButton, CloseButton variants, Stepper completion indicators, and other
 *   small icon/status replacements.
 * - **DON'T**: Omit `transitionKey` when the child visual meaning changes.
 */
export const IconSwapTransition = forwardRef<HTMLSpanElement, IconSwapTransitionProps>(
  (
    {
      asChild,
      transitionKey,
      animationType = 'pop',
      initial = false,
      children,
      className,
      style,
      ...rest
    },
    ref,
  ) => {
    const { isAnimating } = useOptionalAnimation();
    const Component = useMemo(() => getMotionComponent(asChild ? Slot : 'span'), [asChild]);
    const variants = iconSwapVariants[animationType as IconSwapAnimationType];

    return (
      <AnimatePresence mode="wait" initial={initial}>
        {/* eslint-disable-next-line react-hooks/static-components -- Component is resolved through the shared motion cache for polymorphic asChild support. */}
        <Component
          key={String(transitionKey)}
          ref={ref}
          className={className}
          style={style}
          initial={isAnimating ? 'initial' : false}
          animate={isAnimating ? 'animate' : undefined}
          exit={isAnimating ? 'exit' : undefined}
          variants={isAnimating ? variants : undefined}
          transition={variants.transition}
          {...rest}
        >
          {children as ReactNode}
        </Component>
      </AnimatePresence>
    );
  },
);

IconSwapTransition.displayName = 'IconSwapTransition';
