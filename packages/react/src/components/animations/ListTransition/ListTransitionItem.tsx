'use client';

import { Slot } from '@radix-ui/react-slot';
import { forwardRef, Fragment, isValidElement, type ReactNode, useMemo } from 'react';
import { useOptionalAnimation } from '@/providers/AnimationProvider';
import { applyMotionStyle } from '@/providers/motionStyle';
import { sanitizeControlledMotionProps, sanitizeStaticStyle } from '@/types/motion';
import { getMotionComponent, resolvePresetKey } from '../utils';
import { useHydrated } from '../useHydrated';
import { listItemVariants } from './ListTransition.presets';
import { ListItemAnimationType, ListTransitionItemProps } from './ListTransition.types';

/**
 * Renders one animated native `li` for `ListTransition`.
 *
 * It receives its entrance timing from the parent and preserves list semantics;
 * it is not a polymorphic generic motion wrapper.
 */
export const ListTransitionItem = forwardRef<HTMLLIElement, ListTransitionItemProps>(
  (
    {
      asChild,
      animationType = 'pop',
      children,
      className,
      style,
      onAnimationComplete: consumerAnimationComplete,
      ...rest
    },
    ref,
  ) => {
    const canUseAsChild = Boolean(
      asChild && isValidElement(children) && children.type !== Fragment && children.type === 'li',
    );
    const fallbackChildren =
      asChild && isValidElement<{ children?: ReactNode }>(children) && children.type !== Fragment
        ? children.props.children
        : children;
    const Component = useMemo(
      () => getMotionComponent(canUseAsChild ? Slot : 'li'),
      [canUseAsChild],
    );
    const { isAnimating, resolvedMotionStyle } = useOptionalAnimation();
    const isHydrated = useHydrated();

    const animationKey = resolvePresetKey<typeof listItemVariants, ListItemAnimationType>(
      listItemVariants,
      animationType,
      'pop',
    );
    const variants = listItemVariants[animationKey];
    return (
      // eslint-disable-next-line react-hooks/static-components -- Component is resolved through the shared motion cache for polymorphic asChild support.
      <Component
        ref={ref}
        className={className}
        style={sanitizeStaticStyle(style)}
        variants={
          isHydrated
            ? applyMotionStyle(variants, isAnimating ? resolvedMotionStyle : 'none')
            : undefined
        }
        {...sanitizeControlledMotionProps(rest)}
        onAnimationComplete={consumerAnimationComplete}
      >
        {canUseAsChild ? children : fallbackChildren}
      </Component>
    );
  },
);

ListTransitionItem.displayName = 'ListTransitionItem';
