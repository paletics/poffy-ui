'use client';

import { Slot } from '@radix-ui/react-slot';
import { forwardRef, useMemo } from 'react';
import { useOptionalAnimation } from '@/providers/AnimationProvider';
import { getMotionComponent } from '../utils';
import { staggerContainerVariants } from './StaggerTransition.presets';
import { StaggerTransitionItem } from './StaggerTransitionItem';
import { StaggerContext } from './StaggerTransitionContext';
import type { StaggerTransitionType } from './StaggerTransition.presets';
import type { StaggerTransitionProps } from './StaggerTransition.types';

const StaggerTransitionRoot = forwardRef<HTMLDivElement, StaggerTransitionProps>(
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
      ...rest
    },
    ref,
  ) => {
    const Component = useMemo(() => getMotionComponent(asChild ? Slot : 'div'), [asChild]);
    const { isAnimating } = useOptionalAnimation();
    const animationKey = animationType as StaggerTransitionType;
    const variants = staggerContainerVariants[animationKey];

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
          style={style}
          variants={isAnimating ? variants : undefined}
          initial={isAnimating && initial ? 'hidden' : false}
          animate={isAnimating ? 'visible' : undefined}
          exit={isAnimating ? 'exit' : undefined}
          custom={combinedCustom}
          {...rest}
        >
          {children}
        </Component>
      </StaggerContext.Provider>
    );
  },
);

StaggerTransitionRoot.displayName = 'StaggerTransition';

/**
 * Compound stagger transition component with an item subcomponent.
 * Use for non-semantic groups such as card grids, masonry layouts, and generic flow content.
 *
 * ### AI Context & Architecture
 * - Tier: Molecules
 * - Stack: Framer Motion variant propagation, React Context, compound `StaggerTransition.Item`
 *
 * ### Design Tokens
 * - Motion cadence comes from `staggerContainerVariants` and `staggerItemVariants`.
 * - Layout spacing stays with the grid, stack, or owning layout component.
 *
 * ### Variant Logic
 * - `animationType`: Controls the parent stagger rhythm (`base`, `burst`, or `lazy`).
 * - `itemAnimationType`: Sets the default child entrance style.
 *
 * ### Accessibility
 * - Renders a `div` by default and does not add list semantics.
 * - Honors reduced-motion handling through the underlying motion primitives.
 *
 * ### AI Usage
 * - Use for one-time entrance choreography across a static group of children.
 * - Do not use for semantic lists when `ListTransition` better matches the markup.
 *
 * @example
 * ```tsx
 * import { StaggerTransition } from '@poffy-ui/react';
 *
 * <StaggerTransition animationType="burst" itemAnimationType="pop">
 *   <StaggerTransition.Item>Card A</StaggerTransition.Item>
 *   <StaggerTransition.Item>Card B</StaggerTransition.Item>
 * </StaggerTransition>
 * ```
 */
export const StaggerTransition = Object.assign(StaggerTransitionRoot, {
  Item: StaggerTransitionItem,
});
