'use client';

import { Slot } from '@radix-ui/react-slot';
import { forwardRef, ReactNode, useMemo } from 'react';
import { useOptionalAnimation } from '@/providers/AnimationProvider';
import { getMotionComponent } from '../utils';
import { listItemVariants } from './ListTransition.presets';
import { ListItemAnimationType, ListTransitionItemProps } from './ListTransition.types';

/**
 * An individual list item designed to receive staggered animation triggers from `ListTransition`.
 * ### AI Context & Architecture
 * - Tier: Atoms, Stack: Framer Motion (Variant propagation), Radix Slot
 * ### Design Tokens
 * - scale/offset: Driven by `motionOffsets` and `motionScales` (Silver Law compliance).
 * ### Variant Logic
 * - animationType: 'fade', 'slide', or 'pop' determines the specific visual entry style.
 * @example
 * ```tsx
 * import { ListTransition } from '@poffy-ui/react';
 *
 * <ListTransition.Item animationType="pop">
 *   List Content
 * </ListTransition.Item>
 * ```
 * ### Notes
 * Relies on matching variant string keys (`hidden` -> `visible`) dispatched by the parent container.
 * ### Accessibility
 * - Renders as an `<li>`.
 * ### AI Usage
 * - **DO**: Represent a single node in a staggered animation sequence.
 * - **DON'T**: Use in isolation outside of a `<ListTransition>` parent.
 */
export const ListTransitionItem = forwardRef<HTMLLIElement, ListTransitionItemProps>(
  ({ asChild, animationType = 'pop', children, className, style, ...rest }, ref) => {
    const Component = useMemo(() => getMotionComponent(asChild ? Slot : 'li'), [asChild]);
    const { isAnimating } = useOptionalAnimation();

    const animationKey = animationType as ListItemAnimationType;
    const variants = listItemVariants[animationKey];

    return (
      // eslint-disable-next-line react-hooks/static-components -- Component is resolved through the shared motion cache for polymorphic asChild support.
      <Component
        ref={ref}
        className={className}
        style={style}
        variants={isAnimating ? variants : undefined}
        {...rest}
      >
        {children as ReactNode}
      </Component>
    );
  },
);

ListTransitionItem.displayName = 'ListTransitionItem';
