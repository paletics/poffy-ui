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
import { isolatePresenceChild } from '../presenceIsolation';
import { getMotionComponent, resolvePresetKey } from '../utils';
import { useHydratedAnimationPolicy } from '../useHydratedAnimationPolicy';
import { selectionVariants } from './SelectionTransition.presets';
import { SelectionAnimationType, SelectionTransitionProps } from './SelectionTransition.types';
import { SelectionTransitionPresence } from './SelectionTransitionPresence';

const SelectionTransitionImpl = forwardRef<HTMLSpanElement, SelectionTransitionProps>(
  (
    {
      asChild,
      isSelected,
      animationType = 'check',
      transitionKey,
      keepMounted = false,
      initial = false,
      children,
      className,
      style,
      ...rest
    },
    ref,
  ) => {
    const { isHydrated, resolvedMotionStyle, shouldAnimate } = useHydratedAnimationPolicy();
    const canUseAsChild = Boolean(
      asChild && isValidElement(children) && children.type !== Fragment,
    );
    const Component = useMemo(
      () => getMotionComponent(canUseAsChild ? Slot : 'span'),
      [canUseAsChild],
    );
    const animationKey = resolvePresetKey<typeof selectionVariants, SelectionAnimationType>(
      selectionVariants,
      animationType,
      'check',
    );
    const variants = selectionVariants[animationKey];
    const safeRest = sanitizeControlledMotionProps(rest);
    const transition = applyMotionStyle(variants.transition, resolvedMotionStyle);
    const styledVariants = applyMotionStyle(variants, resolvedMotionStyle);
    const staticStyle = sanitizeStaticStyle(style);
    const hiddenStyle =
      !isSelected && !shouldAnimate
        ? {
            ...staticStyle,
            ...sanitizeStaticStyle(styledVariants.exit),
            visibility: 'hidden' as const,
          }
        : staticStyle;
    const renderedChildren = isolatePresenceChild(
      children as ReactNode,
      canUseAsChild && !isSelected,
      !shouldAnimate ? hiddenStyle : undefined,
    );

    if (keepMounted) {
      return (
        // eslint-disable-next-line react-hooks/static-components -- Component is resolved through the shared motion cache for polymorphic asChild support.
        <Component
          ref={ref}
          className={className}
          style={hiddenStyle}
          data-selected={isSelected ? '' : undefined}
          {...safeRest}
          aria-hidden={!isSelected ? true : safeRest['aria-hidden']}
          inert={!isSelected ? true : safeRest.inert}
          initial={false}
          animate={shouldAnimate ? (isSelected ? 'animate' : 'exit') : undefined}
          variants={shouldAnimate ? styledVariants : undefined}
          transition={shouldAnimate ? transition : undefined}
        >
          {renderedChildren}
        </Component>
      );
    }

    return (
      <AnimatePresence mode="wait" initial={isHydrated && initial}>
        {isSelected && (
          <SelectionTransitionPresence
            Component={Component}
            key={transitionKey ?? 'selected'}
            ref={ref}
            className={className}
            safeRest={safeRest}
            staticStyle={staticStyle}
            isolateAsChild={canUseAsChild}
            shouldAnimate={shouldAnimate}
            variants={styledVariants}
            transition={transition}
          >
            {children as ReactNode}
          </SelectionTransitionPresence>
        )}
      </AnimatePresence>
    );
  },
);

SelectionTransitionImpl.displayName = 'SelectionTransition';

/**
 * Animates a caller-controlled selected indicator.
 *
 * The owning option retains selection state and ARIA semantics. When
 * `keepMounted` is false, an unselected indicator exits and unmounts; when
 * true, it remains mounted but is inert and `aria-hidden`. `transitionKey`
 * identifies replacement indicators, and reduced motion renders the selected
 * state without animation. `asChild` delegates to one non-Fragment child.
 */

export const SelectionTransition = defineMotionSlotComponent<
  HTMLSpanElement,
  SelectionTransitionProps
>(SelectionTransitionImpl);
