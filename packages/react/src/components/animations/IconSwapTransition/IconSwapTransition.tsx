'use client';

import { Slot } from '@radix-ui/react-slot';
import { AnimatePresence } from 'motion/react';
import { applyMotionStyle } from '@/providers/motionStyle';
import {
  defineMotionSlotComponent,
  sanitizeControlledMotionProps,
  sanitizeStaticStyle,
} from '@/types/motion';
import { forwardRef, Fragment, isValidElement, type ReactNode, useMemo } from 'react';
import { getMotionComponent, resolvePresetKey } from '../utils';
import { useHydratedAnimationPolicy } from '../useHydratedAnimationPolicy';
import { iconSwapVariants } from './IconSwapTransition.presets';
import { IconSwapAnimationType, IconSwapTransitionProps } from './IconSwapTransition.types';
import { IconSwapTransitionPresence } from './IconSwapTransitionPresence';

const IconSwapTransitionImpl = forwardRef<HTMLSpanElement, IconSwapTransitionProps>(
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
    const { resolvedMotionStyle, shouldAnimate } = useHydratedAnimationPolicy();
    const canUseAsChild = Boolean(
      asChild && isValidElement(children) && children.type !== Fragment,
    );
    const Component = useMemo(
      () => getMotionComponent(canUseAsChild ? Slot : 'span'),
      [canUseAsChild],
    );
    const animationKey = resolvePresetKey<typeof iconSwapVariants, IconSwapAnimationType>(
      iconSwapVariants,
      animationType,
      'pop',
    );
    const variants = iconSwapVariants[animationKey];
    const shouldPlayEntrance = shouldAnimate && initial;
    const motionKey = `${typeof transitionKey}:${String(transitionKey)}:${
      shouldPlayEntrance ? 'entrance' : 'static'
    }`;

    return (
      <AnimatePresence mode="wait" initial={false}>
        <IconSwapTransitionPresence
          key={motionKey}
          Component={Component}
          ref={ref}
          className={className}
          isAsChild={canUseAsChild}
          safeRest={sanitizeControlledMotionProps(rest)}
          shouldAnimate={shouldAnimate}
          staticStyle={sanitizeStaticStyle(style)}
          transition={applyMotionStyle(variants.transition, resolvedMotionStyle)}
          variants={applyMotionStyle(variants, resolvedMotionStyle)}
        >
          {children as ReactNode}
        </IconSwapTransitionPresence>
      </AnimatePresence>
    );
  },
);

IconSwapTransitionImpl.displayName = 'IconSwapTransition';

/**
 * Animates a compact icon or status replacement when `transitionKey` changes.
 *
 * Presence uses wait sequencing, so the exiting child is isolated before the
 * new child enters. The transition itself owns neither status state nor the
 * accessible name of the surrounding control. Reduced-motion policy renders a
 * static swap. `asChild` delegates to one non-Fragment child.
 */

export const IconSwapTransition = defineMotionSlotComponent<
  HTMLSpanElement,
  IconSwapTransitionProps
>(IconSwapTransitionImpl);
