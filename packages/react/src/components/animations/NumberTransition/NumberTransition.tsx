'use client';

import { useMotionValue, useTransform, animate, useInView } from 'motion/react';
import {
  cloneElement,
  forwardRef,
  Fragment,
  isValidElement,
  type ReactElement,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { Slot } from '@radix-ui/react-slot';
import { useMergeRefs } from '@poffy-ui/behavior/hooks';
import { useOptionalAnimation } from '@/providers/AnimationProvider';
import { applyMotionStyle } from '@/providers/motionStyle';
import { defineMotionSlotComponent, sanitizeControlledMotionProps } from '@/types/motion';
import { getMotionComponent } from '../utils';
import { NumberTransitionProps } from './NumberTransition.types';

const MotionSpan = getMotionComponent('span');

const NumberTransitionImpl = forwardRef<HTMLSpanElement, NumberTransitionProps>(
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
      children,
      ...rest
    },
    ref,
  ) => {
    const count = useMotionValue(from);
    const { isAnimating, resolvedMotionStyle } = useOptionalAnimation();
    const internalRef = useRef<HTMLElement>(null);
    const isInView = useInView(internalRef, { once: true, margin: '-10%' });
    const motionOptions = useMemo(
      () => applyMotionStyle({ duration, ease: easing, delay }, resolvedMotionStyle),
      [delay, duration, easing, resolvedMotionStyle],
    );
    const normalizedDecimals = Number.isFinite(decimals)
      ? Math.min(100, Math.max(0, Math.floor(decimals)))
      : 0;

    const displayValue = useTransform(count, (latest) => {
      return format ? format(latest) : latest.toFixed(normalizedDecimals);
    });

    useEffect(() => {
      if (!isAnimating) {
        count.set(to);
        return;
      }

      if (!animateOnView || isInView) {
        const controls = animate(count, to, motionOptions);
        return () => controls.stop();
      }
    }, [count, to, isInView, animateOnView, isAnimating, motionOptions]);

    const canUseAsChild = Boolean(
      asChild && isValidElement(children) && children.type !== Fragment,
    );
    const Component = useMemo(
      () => getMotionComponent(canUseAsChild ? Slot : 'span'),
      [canUseAsChild],
    );
    const mergedRef = useMergeRefs(internalRef, ref);

    return (
      // eslint-disable-next-line react-hooks/static-components -- Component is resolved through the shared motion cache for polymorphic asChild support.
      <Component ref={mergedRef} {...sanitizeControlledMotionProps(rest)}>
        {canUseAsChild
          ? cloneElement(
              children as ReactElement,
              undefined,
              <MotionSpan>{displayValue}</MotionSpan>,
            )
          : displayValue}
      </Component>
    );
  },
);

NumberTransitionImpl.displayName = 'NumberTransition';

/**
 * Interpolates from `from` to `to` and renders the formatted value.
 *
 * It starts once when visible by default; set `animateOnView={false}` to start
 * immediately. When animation is disabled by policy it jumps directly to
 * `to`. `decimals` is floored and clamped from 0 to 100 unless `format`
 * supplies the rendered text. `asChild` replaces one child’s contents.
 */

export const NumberTransition = defineMotionSlotComponent<HTMLSpanElement, NumberTransitionProps>(
  NumberTransitionImpl,
);
