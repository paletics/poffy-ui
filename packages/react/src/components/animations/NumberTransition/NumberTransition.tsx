'use client';

import { useMotionValue, useTransform, animate, useInView } from 'motion/react';
import { forwardRef, ElementType, useEffect, useRef, useMemo, useCallback } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { useOptionalAnimation } from '@/providers/AnimationProvider';
import { getMotionComponent } from '../utils';
import { NumberTransitionProps } from './NumberTransition.types';

/**
 * An animated counter element that smoothly interpolates numerical values upon mounting or viewport entry.
 * ### AI Context & Architecture
 * - Tier: Atoms, Stack: Framer Motion (useMotionValue, animate), Radix Slot
 * ### Design Tokens
 * - duration: Defaults to 1.414s (Silver Ratio derived) if left unspecified, ensuring harmonic pacing.
 * ### Variant Logic
 * - No variants. Configuration relies on 'format', 'decimals', and 'to'/'from' props.
 * @example
 * ```tsx
 * import { NumberTransition } from '@poffy-ui/react';
 *
 * <NumberTransition from={0} to={100} duration={1.414} />
 * ```
 * ### Notes
 * Utilizes React refs and `useInView` to delay the counting animation until the numbers are actually visible on screen.
 * ### Accessibility
 * - Bypasses interpolation completely and jumps directly to the target value when the user's OS has "prefer-reduced-motion" enabled.
 * ### AI Usage
 * - **DO**: Use for statistics sections, dashboard widgets, and impact metrics.
 * - **DO**: Pass a `format` function for currency, units, percentages, or locale-specific output.
 * - **DON'T**: Use as the only source of live-region updates; add explicit ARIA behavior in the owning component when announcements matter.
 */
export const NumberTransition = forwardRef<HTMLElement, NumberTransitionProps<ElementType>>(
  (
    {
      from = 0,
      to,
      decimals = 0,
      format,
      duration = 1.414,
      easing = 'easeOut',
      animateOnView = true,
      delay = 0,
      asChild,
      ...rest
    },
    ref,
  ) => {
    const count = useMotionValue(from);
    const { isAnimating } = useOptionalAnimation();
    const internalRef = useRef<HTMLElement>(null);
    const isInView = useInView(internalRef, { once: true, margin: '-10%' });
    const hasStartedRef = useRef(false);
    const targetRef = useRef(to);

    const displayValue = useTransform(count, (latest) => {
      return format ? format(latest) : latest.toFixed(decimals);
    });

    useEffect(() => {
      if (targetRef.current !== to) {
        targetRef.current = to;
        hasStartedRef.current = false;
      }

      if (!isAnimating) {
        count.set(to);
        return;
      }

      if ((!animateOnView || isInView) && !hasStartedRef.current) {
        hasStartedRef.current = true;
        const controls = animate(count, to, {
          duration,
          ease: easing,
          delay,
        });
        return () => controls.stop();
      }
    }, [count, to, duration, isInView, animateOnView, isAnimating, delay, easing]);

    const Component = useMemo(() => getMotionComponent(asChild ? Slot : 'span'), [asChild]);

    const mergedRef = useCallback(
      (node: HTMLElement | null) => {
        internalRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.RefObject<HTMLElement | null>).current = node;
      },
      [ref],
    );

    return (
      // eslint-disable-next-line react-hooks/static-components -- Component is resolved through the shared motion cache for polymorphic asChild support.
      <Component ref={mergedRef} {...rest}>
        {displayValue}
      </Component>
    );
  },
);

NumberTransition.displayName = 'NumberTransition';
