'use client';

import { Slot } from '@radix-ui/react-slot';
import { AnimatePresence } from 'motion/react';
import { forwardRef, ReactNode, useMemo } from 'react';
import { getMotionComponent } from '../utils';
import { orderLayoutTransition } from './ReorderTransition.presets';
import { OrderContext } from './ReorderTransitionContext';
import { ReorderTransitionItem } from './ReorderTransitionItem';
import type { ReorderTransitionProps } from './ReorderTransition.types';

const ReorderTransitionRoot = forwardRef<HTMLDivElement, ReorderTransitionProps>(
  (
    { asChild, animationType = 'pop', exitMode = 'popLayout', children, className, style, ...rest },
    ref,
  ) => {
    const Component = useMemo(() => getMotionComponent(asChild ? Slot : 'div'), [asChild]);
    const contextValue = useMemo(() => ({ animationType }), [animationType]);

    return (
      <OrderContext.Provider value={contextValue}>
        {/* eslint-disable-next-line react-hooks/static-components -- Component is resolved through the shared motion cache for polymorphic asChild support. */}
        <Component
          ref={ref}
          layout
          transition={{ layout: orderLayoutTransition }}
          className={className}
          style={style}
          {...rest}
        >
          <AnimatePresence initial={false} mode={exitMode}>
            {children as ReactNode}
          </AnimatePresence>
        </Component>
      </OrderContext.Provider>
    );
  },
);

ReorderTransitionRoot.displayName = 'ReorderTransition';

/**
 * Compound transition component for add/remove/reorder list mutations.
 * Use when item identity changes at runtime and each child has a stable React key.
 *
 * ### AI Context & Architecture
 * - Tier: Molecules
 * - Stack: Framer Motion layout transitions, compound `ReorderTransition.Item`
 *
 * ### Design Tokens
 * - Motion timing comes from `orderItemVariants` and `orderLayoutTransition`.
 * - Spacing and item layout remain owned by the rendered children.
 *
 * ### Variant Logic
 * - `animationType`: Controls how items enter, exit, or shift during reorder operations.
 * - `layoutMode`: Controls the Framer Motion layout pop behavior for reorder-heavy lists.
 *
 * ### Accessibility
 * - Does not announce reordering by itself; add live-region messaging in the owning sortable pattern when needed.
 * - Keep stable keys so assistive technology and React preserve item identity.
 *
 * ### AI Usage
 * - **DO**: Use when item identity changes at runtime and each child has a stable React key.
 * - **DON'T**: Use for static entrance animation; prefer `ListTransition` or `StaggerTransition`.
 *
 * @example
 * ```tsx
 * import { ReorderTransition } from '@poffy-ui/react';
 *
 * <ReorderTransition>
 *   {items.map((item) => (
 *     <ReorderTransition.Item key={item.id}>{item.label}</ReorderTransition.Item>
 *   ))}
 * </ReorderTransition>
 * ```
 */
export const ReorderTransition = Object.assign(ReorderTransitionRoot, {
  Item: ReorderTransitionItem,
});
