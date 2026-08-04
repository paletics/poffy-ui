'use client';

import { Slot } from '@radix-ui/react-slot';
import type { AnimationDefinition } from 'motion/react';
import { forwardRef, Fragment, isValidElement, type ReactNode, useMemo } from 'react';
import { useOptionalAnimation } from '@/providers/AnimationProvider';
import { applyMotionStyle } from '@/providers/motionStyle';
import {
  defineMotionSlotComponent,
  sanitizeControlledMotionProps,
  sanitizeStaticStyle,
} from '@/types/motion';
import { getMotionComponent, resolvePresetKey } from '../utils';
import { useOneShotEntranceVariant } from '../useOneShotEntranceVariant';
import { staggerContainerVariants } from './StaggerTransition.presets';
import { StaggerTransitionItem } from './StaggerTransitionItem';
import { StaggerContext } from './StaggerTransitionContext';
import type { StaggerTransitionType } from './StaggerTransition.presets';
import type { StaggerTransitionProps } from './StaggerTransition.types';

const StaggerTransitionRootImpl = forwardRef<HTMLDivElement, StaggerTransitionProps>(
  (
    {
      asChild,
      children,
      animationType = 'base',
      itemAnimationType = 'fade',
      delay = 0,
      stagger,
      customData,
      initial = true,
      className,
      style,
      onAnimationComplete: consumerAnimationComplete,
      ...rest
    },
    ref,
  ) => {
    const canUseAsChild = Boolean(
      asChild && isValidElement(children) && children.type !== Fragment,
    );
    const Component = useMemo(
      () => getMotionComponent(canUseAsChild ? Slot : 'div'),
      [canUseAsChild],
    );
    const { isAnimating, resolvedMotionStyle } = useOptionalAnimation();
    const safeRest = sanitizeControlledMotionProps(rest);
    const animationKey = resolvePresetKey<typeof staggerContainerVariants, StaggerTransitionType>(
      staggerContainerVariants,
      animationType,
      'base',
    );
    const variants = staggerContainerVariants[animationKey];
    const { completeSettlement, isHydrated, settleEntrance, target } = useOneShotEntranceVariant({
      enabled: isAnimating,
      enter: '__poffyStaggerEnter',
      entranceIdentity: animationKey,
      settled: '__poffyStaggerSettled',
      shouldEnter: initial,
    });
    const handleAnimationComplete = (definition: AnimationDefinition) => {
      if (definition === '__poffyStaggerEnter') settleEntrance();
      if (definition === '__poffyStaggerSettled') {
        completeSettlement();
        return;
      }
      consumerAnimationComplete?.(definition);
    };
    const fallbackChildren =
      asChild && isValidElement<{ children?: ReactNode }>(children) && children.type !== Fragment
        ? children.props.children
        : children;

    const contextValue = useMemo(() => ({ itemAnimationType }), [itemAnimationType]);

    const combinedCustom = useMemo(
      () => ({
        ...customData,
        delay,
        stagger,
      }),
      [customData, delay, stagger],
    );

    return (
      <StaggerContext.Provider value={contextValue}>
        {/* eslint-disable-next-line react-hooks/static-components -- Component is resolved through the shared motion cache for polymorphic asChild support. */}
        <Component
          ref={ref}
          className={className}
          style={sanitizeStaticStyle(style)}
          {...safeRest}
          variants={
            isHydrated
              ? applyMotionStyle(variants, isAnimating ? resolvedMotionStyle : 'none')
              : undefined
          }
          initial={false}
          animate={target}
          onAnimationComplete={handleAnimationComplete}
          exit={isHydrated && isAnimating ? 'exit' : undefined}
          custom={combinedCustom}
        >
          {(canUseAsChild ? children : fallbackChildren) as ReactNode}
        </Component>
      </StaggerContext.Provider>
    );
  },
);

StaggerTransitionRootImpl.displayName = 'StaggerTransition';

const StaggerTransitionRoot = defineMotionSlotComponent<HTMLDivElement, StaggerTransitionProps>(
  StaggerTransitionRootImpl,
);

/**
 * Coordinates a one-time staggered entrance for a generic child group.
 *
 * It intentionally adds no list semantics or item roles. Use `Item` for
 * descendants that should receive the parent’s timing; collection state and
 * announcements remain caller-owned. Motion policy can reduce the group to a
 * static render.
 */
export const StaggerTransition = Object.assign(StaggerTransitionRoot, {
  Item: StaggerTransitionItem,
});
