'use client';

import { Slot } from '@radix-ui/react-slot';
import { forwardRef, Fragment, isValidElement, type ReactNode, useContext, useMemo } from 'react';
import { withNoMotionStyle } from '@/components/shared/withNoMotionStyle';
import { applyMotionStyle } from '@/providers/motionStyle';
import {
  createNoMotionStyle,
  defineMotionSlotComponent,
  sanitizeControlledMotionProps,
  sanitizeStaticStyle,
} from '@/types/motion';
import { getMotionComponent } from '../utils';
import { useHydratedAnimationPolicy } from '../useHydratedAnimationPolicy';
import { useExitPresenceIsolation } from '../presenceIsolation';
import {
  orderItemVariants,
  orderLayoutTransition,
  type OrderItemAnimationType,
} from './ReorderTransition.presets';
import { OrderContext } from './ReorderTransitionContext';
import type { ReorderTransitionItemProps } from './ReorderTransition.types';

const ReorderTransitionItemImpl = forwardRef<HTMLDivElement, ReorderTransitionItemProps>(
  ({ asChild, animationType, children, className, style, ...rest }, ref) => {
    const { animationType: parentType } = useContext(OrderContext);
    const effectiveType = (animationType ?? parentType) as OrderItemAnimationType;
    const canUseAsChild = Boolean(
      asChild && isValidElement(children) && children.type !== Fragment,
    );
    const Component = useMemo(
      () => getMotionComponent(canUseAsChild ? Slot : 'div'),
      [canUseAsChild],
    );
    const variants = orderItemVariants[effectiveType];
    const { resolvedMotionStyle, shouldAnimate } = useHydratedAnimationPolicy();
    const safeRest = sanitizeControlledMotionProps(rest);
    const sanitizedStyle = sanitizeStaticStyle(style);
    const staticChildren = withNoMotionStyle(
      children as ReactNode,
      !shouldAnimate && canUseAsChild,
    );
    const { isPresent, renderedChildren } = useExitPresenceIsolation(
      staticChildren as ReactNode,
      canUseAsChild,
    );

    return (
      // eslint-disable-next-line react-hooks/static-components -- Component is resolved through the shared motion cache for polymorphic asChild support.
      <Component
        ref={ref}
        {...safeRest}
        layout={shouldAnimate}
        transition={
          shouldAnimate
            ? applyMotionStyle({ layout: orderLayoutTransition }, resolvedMotionStyle)
            : undefined
        }
        variants={shouldAnimate ? applyMotionStyle(variants, resolvedMotionStyle) : undefined}
        initial={shouldAnimate ? 'initial' : false}
        animate={shouldAnimate ? 'animate' : undefined}
        exit={shouldAnimate ? 'exit' : undefined}
        className={className}
        style={
          shouldAnimate
            ? {
                ...sanitizedStyle,
                pointerEvents: isPresent ? sanitizedStyle?.pointerEvents : 'none',
              }
            : createNoMotionStyle(style)
        }
        aria-hidden={isPresent ? safeRest['aria-hidden'] : true}
        inert={isPresent ? safeRest.inert : true}
      >
        {renderedChildren as ReactNode}
      </Component>
    );
  },
);

ReorderTransitionItemImpl.displayName = 'ReorderTransition.Item';

/** Renders one keyed item whose entrance, exit, and layout motion are coordinated by `ReorderTransition`. */

export const ReorderTransitionItem = defineMotionSlotComponent<
  HTMLDivElement,
  ReorderTransitionItemProps
>(ReorderTransitionItemImpl);
