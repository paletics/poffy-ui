'use client';

import { Slot } from '@radix-ui/react-slot';
import { forwardRef, ReactNode, useContext, useMemo } from 'react';
import { useOptionalAnimation } from '@/providers/AnimationProvider';
import { getMotionComponent } from '../utils';
import {
  orderItemVariants,
  orderLayoutTransition,
  type OrderItemAnimationType,
} from './ReorderTransition.presets';
import { OrderContext } from './ReorderTransitionContext';
import type { ReorderTransitionItemProps } from './ReorderTransition.types';

/**
 * An individual item within an `<ReorderTransition>` container.
 * Combines layout FLIP (reorder) with enter/exit animation variants.
 * ### AI Context & Architecture
 * - Tier: Atoms, Stack: motion/react (layout + variants)
 * ### Notes
 * Must be a direct child of `<ReorderTransition>`. Requires a stable `key` prop.
 * ### AI Usage
 * - **DO**: Pass the item's unique ID as `key` to guarantee correct FLIP identity tracking.
 * - **DO**: Use `animationType` to override the parent's default for a specific item.
 */
export const ReorderTransitionItem = forwardRef<HTMLDivElement, ReorderTransitionItemProps>(
  ({ asChild, animationType, children, className, style, ...rest }, ref) => {
    const { animationType: parentType } = useContext(OrderContext);
    const effectiveType = (animationType ?? parentType) as OrderItemAnimationType;
    const Component = useMemo(() => getMotionComponent(asChild ? Slot : 'div'), [asChild]);
    const variants = orderItemVariants[effectiveType];
    const { isAnimating } = useOptionalAnimation();

    return (
      // eslint-disable-next-line react-hooks/static-components -- Component is resolved through the shared motion cache for polymorphic asChild support.
      <Component
        ref={ref}
        layout
        transition={{ layout: orderLayoutTransition }}
        variants={isAnimating ? variants : undefined}
        initial={isAnimating ? 'initial' : false}
        animate={isAnimating ? 'animate' : undefined}
        exit={isAnimating ? 'exit' : undefined}
        className={className}
        style={style}
        {...rest}
      >
        {children as ReactNode}
      </Component>
    );
  },
);

ReorderTransitionItem.displayName = 'ReorderTransition.Item';
