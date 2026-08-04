'use client';

import { Slot } from '@radix-ui/react-slot';
import type { AnimationDefinition } from 'motion/react';
import { forwardRef, Fragment, isValidElement, ReactNode, useMemo } from 'react';
import { useOptionalAnimation } from '@/providers/AnimationProvider';
import { applyMotionStyle } from '@/providers/motionStyle';
import {
  defineMotionSlotComponent,
  sanitizeControlledMotionProps,
  sanitizeStaticStyle,
} from '@/types/motion';
import { getMotionComponent, resolvePresetKey } from '../utils';
import { useOneShotEntranceVariant } from '../useOneShotEntranceVariant';
import { listContainerVariants } from './ListTransition.presets';
import { ListAnimationType, ListTransitionProps } from './ListTransition.types';
import { ListTransitionItem } from './ListTransitionItem';

const isListHost = (children: unknown) =>
  isValidElement(children) &&
  children.type !== Fragment &&
  ['ul', 'ol'].includes(children.type as string);

const getFallbackChildren = (children: unknown) =>
  isValidElement<{ children?: ReactNode }>(children) && children.type !== Fragment
    ? children.props.children
    : children;

const ListTransitionRootImpl = forwardRef<HTMLUListElement, ListTransitionProps>(
  (
    {
      asChild,
      animationType = 'flow',
      customData,
      children,
      className,
      style,
      onAnimationComplete: consumerAnimationComplete,
      ...rest
    },
    ref,
  ) => {
    const canUseAsChild = Boolean(asChild && isListHost(children));
    const Component = useMemo(
      () => getMotionComponent(canUseAsChild ? Slot : 'ul'),
      [canUseAsChild],
    );

    const { isAnimating, resolvedMotionStyle } = useOptionalAnimation();
    const animationKey = resolvePresetKey<typeof listContainerVariants, ListAnimationType>(
      listContainerVariants,
      animationType,
      'flow',
    );
    const variants = listContainerVariants[animationKey];
    const { completeSettlement, isHydrated, settleEntrance, target } = useOneShotEntranceVariant({
      enabled: isAnimating,
      enter: '__poffyListEnter',
      entranceIdentity: animationKey,
      settled: '__poffyListSettled',
    });
    const handleAnimationComplete = (definition: AnimationDefinition) => {
      if (definition === '__poffyListEnter') settleEntrance();
      if (definition === '__poffyListSettled') {
        completeSettlement();
        return;
      }
      consumerAnimationComplete?.(definition);
    };

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
        initial={false}
        animate={target}
        onAnimationComplete={handleAnimationComplete}
        custom={customData}
        {...sanitizeControlledMotionProps(rest)}
      >
        {
          (canUseAsChild
            ? children
            : asChild
              ? getFallbackChildren(children)
              : children) as ReactNode
        }
      </Component>
    );
  },
);

ListTransitionRootImpl.displayName = 'ListTransition';

const ListTransitionRoot = defineMotionSlotComponent<
  HTMLUListElement,
  ListTransitionProps,
  HTMLUListElement | HTMLOListElement
>(ListTransitionRootImpl);

/**
 * Coordinates entrance animation for semantic list items.
 *
 * The root retains native `ul`/`ol` semantics, and `ListTransition.Item`
 * renders each animated `li`. It does not create or announce collection
 * changes; the caller owns that state. Motion policy can render the list
 * without animation.
 */
export const ListTransition = Object.assign(ListTransitionRoot, {
  Item: ListTransitionItem,
});
