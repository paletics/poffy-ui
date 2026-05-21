'use client';

import { Slot } from '@radix-ui/react-slot';
import { forwardRef, useContext, useMemo } from 'react';
import { useOptionalAnimation } from '@/providers/AnimationProvider';
import { getMotionComponent } from '../utils';
import { staggerItemVariants } from './StaggerTransition.presets';
import { StaggerContext } from './StaggerTransitionContext';
import type { StaggerItemType } from './StaggerTransition.presets';
import type { StaggerTransitionItemProps } from './StaggerTransition.types';

/**
 * Individual item that follows the stagger orchestration rhythm established by its parent container.
 * ### AI Context & Architecture
 * - Tier: Atoms, Stack: Framer Motion (Variant propagation), Radix Slot
 * ### Design Tokens
 * - inherits from parent Container presets.
 * ### Variant Logic
 * - animationType: Can optionally override the parent's `itemAnimationType` for a specific child.
 * @example
 * ```tsx
 * import { StaggerTransition } from '@poffy-ui/react';
 *
 * <StaggerTransition.Item animationType="reveal" asChild>
 *   <Card>Content</Card>
 * </StaggerTransition.Item>
 * ```
 * ### Notes
 * Must be rendered inside a parent `<StaggerTransition>`.
 * ### Accessibility
 * - Renders as a `<div>` by default.
 * ### AI Usage
 * - **DO**: Designate the specific DOM node that receives the staggered entrance trigger.
 */
export const StaggerTransitionItem = forwardRef<HTMLDivElement, StaggerTransitionItemProps>(
  ({ asChild, children, animationType, customData, className, style, ...rest }, ref) => {
    const { itemAnimationType: parentType } = useContext(StaggerContext);
    const effectiveType = (animationType ?? parentType) as StaggerItemType;

    const Component = useMemo(() => getMotionComponent(asChild ? Slot : 'div'), [asChild]);
    const { isAnimating } = useOptionalAnimation();
    const variants = staggerItemVariants[effectiveType];

    return (
      // eslint-disable-next-line react-hooks/static-components -- Component is resolved through the shared motion cache for polymorphic asChild support.
      <Component
        ref={ref}
        className={className}
        style={style}
        variants={isAnimating ? variants : undefined}
        custom={customData}
        {...rest}
      >
        {children}
      </Component>
    );
  },
);

StaggerTransitionItem.displayName = 'StaggerTransition.Item';
