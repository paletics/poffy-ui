'use client';

import { Slot } from '@radix-ui/react-slot';
import { forwardRef, Fragment, isValidElement, type ReactNode, useContext, useMemo } from 'react';
import { useOptionalAnimation } from '@/providers/AnimationProvider';
import { applyMotionStyle } from '@/providers/motionStyle';
import {
  defineMotionSlotComponent,
  sanitizeControlledMotionProps,
  sanitizeStaticStyle,
} from '@/types/motion';
import { getMotionComponent, resolvePresetKey } from '../utils';
import { useHydrated } from '../useHydrated';
import { staggerItemVariants } from './StaggerTransition.presets';
import { StaggerContext } from './StaggerTransitionContext';
import type { StaggerItemType } from './StaggerTransition.presets';
import type { StaggerTransitionItemProps } from './StaggerTransition.types';

const StaggerTransitionItemImpl = forwardRef<HTMLDivElement, StaggerTransitionItemProps>(
  ({ asChild, children, animationType, customData, className, style, ...rest }, ref) => {
    const { itemAnimationType: parentType } = useContext(StaggerContext);
    const animationKey = resolvePresetKey<typeof staggerItemVariants, StaggerItemType>(
      staggerItemVariants,
      animationType ?? parentType,
      'fade',
    );

    const canUseAsChild = Boolean(
      asChild && isValidElement(children) && children.type !== Fragment,
    );
    const Component = useMemo(
      () => getMotionComponent(canUseAsChild ? Slot : 'div'),
      [canUseAsChild],
    );
    const { isAnimating, resolvedMotionStyle } = useOptionalAnimation();
    const isHydrated = useHydrated();
    const variants = staggerItemVariants[animationKey];
    const safeRest = sanitizeControlledMotionProps(rest);
    const fallbackChildren =
      asChild && isValidElement<{ children?: ReactNode }>(children) && children.type !== Fragment
        ? children.props.children
        : children;

    return (
      // eslint-disable-next-line react-hooks/static-components -- Component is resolved through the shared motion cache for polymorphic asChild support.
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
        custom={customData}
      >
        {(canUseAsChild ? children : fallbackChildren) as ReactNode}
      </Component>
    );
  },
);

StaggerTransitionItemImpl.displayName = 'StaggerTransition.Item';

/** Renders one generic child using the entrance timing supplied by `StaggerTransition`. */

export const StaggerTransitionItem = defineMotionSlotComponent<
  HTMLDivElement,
  StaggerTransitionItemProps
>(StaggerTransitionItemImpl);
