'use client';

import { Slot } from '@radix-ui/react-slot';
import { useOptionalAnimation } from '@/providers/AnimationProvider';
import { applyMotionStyle } from '@/providers/motionStyle';
import {
  createNoMotionStyle,
  defineMotionSlotComponent,
  sanitizeControlledMotionProps,
  sanitizeStaticStyle,
} from '@/types/motion';
import { forwardRef, Fragment, isValidElement, type ReactNode, useMemo } from 'react';
import { withNoMotionStyle } from '@/components/shared/withNoMotionStyle';
import { getMotionComponent, resolvePresetKey } from '../utils';
import { layoutVariants } from './LayoutTransition.presets';
import { LayoutAnimationType, LayoutTransitionProps } from './LayoutTransition.types';

const LayoutTransitionImpl = forwardRef<HTMLDivElement, LayoutTransitionProps>(
  (
    {
      asChild,
      animationType = 'reorder',
      customData,
      layout = true,
      layoutId,
      children,
      className,
      style,
      ...rest
    },
    ref,
  ) => {
    const canUseAsChild = Boolean(
      asChild && isValidElement(children) && children.type !== Fragment,
    );
    const Component = useMemo(
      () => getMotionComponent(canUseAsChild ? Slot : 'div'),
      [canUseAsChild],
    );
    const { isAnimating, resolvedMotionStyle } = useOptionalAnimation();

    const animationKey = resolvePresetKey<typeof layoutVariants, LayoutAnimationType>(
      layoutVariants,
      animationType,
      'reorder',
    );
    const variants = layoutVariants[animationKey];
    const transition =
      typeof variants.transition === 'function'
        ? variants.transition(customData)
        : variants.transition;
    const staticChildren = withNoMotionStyle(children as ReactNode, !isAnimating && canUseAsChild);

    return (
      // eslint-disable-next-line react-hooks/static-components -- Component is resolved through the shared motion cache for polymorphic asChild support.
      <Component
        ref={ref}
        className={className}
        style={isAnimating ? sanitizeStaticStyle(style) : createNoMotionStyle(style)}
        layout={isAnimating ? layout : false}
        layoutId={isAnimating ? layoutId : undefined}
        {...sanitizeControlledMotionProps(rest)}
        transition={isAnimating ? applyMotionStyle(transition, resolvedMotionStyle) : undefined}
      >
        {staticChildren as ReactNode}
      </Component>
    );
  },
);

LayoutTransitionImpl.displayName = 'LayoutTransition';

/**
 * Animates layout geometry changes caused by parent rendering.
 *
 * Unlike presence transitions, it does not control mounting or exiting. The
 * nearest animation policy can reduce it to a static layout update. `asChild`
 * delegates to one non-Fragment child; otherwise it uses a `div` motion host.
 */

export const LayoutTransition = defineMotionSlotComponent<HTMLDivElement, LayoutTransitionProps>(
  LayoutTransitionImpl,
);
