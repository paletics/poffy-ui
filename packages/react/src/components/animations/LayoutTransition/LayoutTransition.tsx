'use client';

import { Slot } from '@radix-ui/react-slot';
import { forwardRef, ReactNode, useMemo } from 'react';
import { getMotionComponent } from '../utils';
import { layoutVariants } from './LayoutTransition.presets';
import { LayoutAnimationType, LayoutTransitionProps } from './LayoutTransition.types';

/**
 * A layout animation wrapper that automatically interpolates changes in bounding boxes.
 * ### AI Context & Architecture
 * - Tier: Atoms, Stack: Framer Motion (`layout` prop), Radix Slot
 * ### Design Tokens
 * - transition: Maps directly to Silver Ratio spring constants ('smooth', 'bouncy', etc. from presets).
 * ### Variant Logic
 * - animationType: Governs the interpolation curve when the element's DOM Rect changes.
 * @example
 * ```tsx
 * import { LayoutTransition } from '@poffy-ui/react';
 *
 * <LayoutTransition animationType="reorder">
 *   <div className={`w-${isExpanded ? 'full' : '1/2'}`} />
 * </LayoutTransition>
 * ```
 * ### Notes
 * By utilizing Framer Motion's `layout` prop, this component bypasses expensive browser reflow repaints and instead animates transforms cheaply on the composite layer.
 * ### Accessibility
 * - As an animation-only wrapper, it has no native semantic footprint. Rely on children for semantics.
 * ### AI Usage
 * - **DO**: Wrap elements that change size or position dynamically, such as expandable cards and reflowing grids.
 * - **DON'T**: Use as a substitute for enter/exit mounting wrappers.
 */
export const LayoutTransition = forwardRef<HTMLDivElement, LayoutTransitionProps>(
  (
    { asChild, animationType = 'reorder', customData, children, className, style, ...rest },
    ref,
  ) => {
    const Component = useMemo(() => getMotionComponent(asChild ? Slot : 'div'), [asChild]);

    const animationKey = animationType as LayoutAnimationType;
    const variants = layoutVariants[animationKey];
    const transition =
      typeof variants.transition === 'function'
        ? variants.transition(customData)
        : variants.transition;

    return (
      // eslint-disable-next-line react-hooks/static-components -- Component is resolved through the shared motion cache for polymorphic asChild support.
      <Component
        ref={ref}
        className={className}
        style={style}
        layout
        {...rest}
        transition={transition}
      >
        {children as ReactNode}
      </Component>
    );
  },
);

LayoutTransition.displayName = 'LayoutTransition';
