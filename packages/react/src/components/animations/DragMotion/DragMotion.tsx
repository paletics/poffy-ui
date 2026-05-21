'use client';

import { Slot } from '@radix-ui/react-slot';
import { forwardRef, useMemo } from 'react';
import { useOptionalAnimation } from '@/providers/AnimationProvider';
import { getMotionComponent } from '../utils';
import { DragMotionProps } from './DragMotion.types';

/**
 * A wrapper component that adds 2D drag capabilities with physics boundaries.
 * ### AI Context & Architecture
 * - Tier: Atoms, Stack: Framer Motion (Gestures), Radix Slot
 * ### Design Tokens
 * - dragElastic: Default limits adhere to bouncy physics presets.
 * ### Variant Logic
 * - drag: Defines axial constraints ('x', 'y', or true for both). snapToOrigin: dictates post-drag kinetic response.
 * @example
 * ```tsx
 * import { DragMotion } from '@poffy-ui/react';
 *
 * <DragMotion drag="x" dragConstraints={{ left: 0, right: 300 }}>
 *   <div className="slider-thumb" />
 * </DragMotion>
 * ```
 * ### Notes
 * Binds Framer Motion's Pan gesture recognizers. Suppresses default browser drag events.
 * ### Accessibility
 * - Automatically disables all drag interactions when `prefers-reduced-motion` is enabled at the OS level. Must provide keyboard alternatives for drag interfaces (e.g. arrow keys for sliders).
 * ### AI Usage
 * - **DO**: Use to build interactive sliders, carousels, or sortable handles.
 * - **DO**: Provide a keyboard equivalent for every drag-only interaction.
 * - **DON'T**: Nest `DragMotion` components deeply unless `dragPropagation` is explicitly handled.
 */
export const DragMotion = forwardRef<HTMLDivElement, DragMotionProps>(
  (
    {
      asChild,
      children,
      drag = true,
      inertia = true,
      dragConstraints,
      dragElastic = 0.5,
      snapToOrigin = false,
      dragPropagation = false,
      ...rest
    },
    ref,
  ) => {
    const { isAnimating } = useOptionalAnimation();
    const Component = useMemo(() => getMotionComponent(asChild ? Slot : 'div'), [asChild]);

    const effectiveDrag = isAnimating ? drag : false;

    return (
      // eslint-disable-next-line react-hooks/static-components -- Component is resolved through the shared motion cache for polymorphic asChild support.
      <Component
        ref={ref}
        drag={effectiveDrag}
        dragConstraints={dragConstraints}
        dragElastic={dragElastic}
        dragPropagation={dragPropagation}
        dragMomentum={inertia}
        dragSnapToOrigin={snapToOrigin}
        {...rest}
      >
        {children}
      </Component>
    );
  },
);

DragMotion.displayName = 'DragMotion';
