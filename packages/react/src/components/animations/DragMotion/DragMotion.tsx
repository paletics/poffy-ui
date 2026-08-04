'use client';

import { Slot } from '@radix-ui/react-slot';
import { forwardRef, Fragment, isValidElement, useMemo } from 'react';
import { useOptionalAnimation } from '@/providers/AnimationProvider';
import { applyMotionStyle } from '@/providers/motionStyle';
import {
  defineMotionSlotComponent,
  sanitizeControlledMotionProps,
  sanitizeStaticStyle,
} from '@/types/motion';
import { getMotionComponent } from '../utils';
import { DragMotionProps } from './DragMotion.types';

const DragMotionImpl = forwardRef<HTMLDivElement, DragMotionProps>(
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
      style,
      ...rest
    },
    ref,
  ) => {
    const { isAnimating, resolvedMotionStyle } = useOptionalAnimation();
    const canUseAsChild = Boolean(
      asChild && isValidElement(children) && children.type !== Fragment,
    );
    const Component = useMemo(
      () => getMotionComponent(canUseAsChild ? Slot : 'div'),
      [canUseAsChild],
    );

    const effectiveDrag = isAnimating ? drag : false;
    const styledDrag = applyMotionStyle({ dragElastic }, resolvedMotionStyle);
    const touchAction =
      !isAnimating || !drag ? undefined : drag === 'x' ? 'pan-y' : drag === 'y' ? 'pan-x' : 'none';

    return (
      // eslint-disable-next-line react-hooks/static-components -- Component is resolved through the shared motion cache for polymorphic asChild support.
      <Component
        ref={ref}
        style={{ touchAction, ...sanitizeStaticStyle(style) }}
        drag={effectiveDrag}
        dragConstraints={dragConstraints}
        dragElastic={isAnimating ? styledDrag.dragElastic : 0}
        dragPropagation={dragPropagation}
        dragMomentum={isAnimating ? inertia : false}
        dragSnapToOrigin={snapToOrigin}
        {...sanitizeControlledMotionProps(rest)}
      >
        {children}
      </Component>
    );
  },
);

DragMotionImpl.displayName = 'DragMotion';

/**
 * Adds Motion-managed dragging with optional constraints.
 *
 * It owns the temporary drag gesture, not controlled position state. Dragging,
 * momentum, and elastic distance are disabled when the animation policy is
 * off. While active it sets a direction-aware `touch-action` to avoid browser
 * scroll conflicts. `asChild` delegates to one non-Fragment child.
 */

export const DragMotion = defineMotionSlotComponent<HTMLDivElement, DragMotionProps>(
  DragMotionImpl,
);
