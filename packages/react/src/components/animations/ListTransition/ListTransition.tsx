'use client';

import { Slot } from '@radix-ui/react-slot';
import { forwardRef, ReactNode, useMemo } from 'react';
import { useOptionalAnimation } from '@/providers/AnimationProvider';
import { getMotionComponent } from '../utils';
import { listContainerVariants } from './ListTransition.presets';
import { ListAnimationType, ListTransitionProps } from './ListTransition.types';
import { ListTransitionItem } from './ListTransitionItem';

const ListTransitionRoot = forwardRef<HTMLUListElement, ListTransitionProps>(
  ({ asChild, animationType = 'flow', children, className, style, ...rest }, ref) => {
    const Component = useMemo(() => getMotionComponent(asChild ? Slot : 'ul'), [asChild]);

    const { isAnimating } = useOptionalAnimation();
    const animationKey = animationType as ListAnimationType;
    const variants = listContainerVariants[animationKey];

    return (
      // eslint-disable-next-line react-hooks/static-components -- Component is resolved through the shared motion cache for polymorphic asChild support.
      <Component
        ref={ref}
        className={className}
        style={style}
        variants={isAnimating ? variants : undefined}
        initial={isAnimating ? 'hidden' : false}
        animate={isAnimating ? 'visible' : undefined}
        exit={isAnimating ? 'exit' : undefined}
        {...rest}
      >
        {children as ReactNode}
      </Component>
    );
  },
);

ListTransitionRoot.displayName = 'ListTransition';

/**
 * Compound list transition component with an item subcomponent.
 * Use for semantic lists whose children should animate in a coordinated sequence.
 *
 * ### AI Context & Architecture
 * - Tier: Molecules
 * - Stack: Framer Motion variants, compound `ListTransition.Item`
 *
 * ### Design Tokens
 * - Motion timing and offsets come from `listContainerVariants` and `listItemVariants`.
 * - Layout spacing remains owned by the list content or surrounding layout component.
 *
 * ### Variant Logic
 * - `animationType`: Controls the container cadence for list entrance.
 * - `ListTransition.Item animationType`: Controls the individual item entrance style.
 *
 * ### Accessibility
 * - Renders list semantics through the root and item elements; keep `ListTransition.Item` aligned with list children.
 * - Honors reduced-motion handling through the underlying motion primitives.
 *
 * ### AI Usage
 * - Use for list entrance choreography where children should animate as items.
 * - Do not use for non-list grids when `StaggerTransition` better matches the markup.
 *
 * @example
 * ```tsx
 * import { ListTransition } from '@poffy-ui/react';
 *
 * <ListTransition animationType="flow">
 *   <ListTransition.Item>First</ListTransition.Item>
 *   <ListTransition.Item>Second</ListTransition.Item>
 * </ListTransition>
 * ```
 */
export const ListTransition = Object.assign(ListTransitionRoot, {
  Item: ListTransitionItem,
});
