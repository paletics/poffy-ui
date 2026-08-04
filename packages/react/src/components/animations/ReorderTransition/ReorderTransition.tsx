'use client';

import { Slot } from '@radix-ui/react-slot';
import { AnimatePresence } from 'motion/react';
import { applyMotionStyle } from '@/providers/motionStyle';
import {
  createNoMotionStyle,
  defineMotionSlotComponent,
  sanitizeControlledMotionProps,
  sanitizeStaticStyle,
} from '@/types/motion';
import {
  Children,
  cloneElement,
  forwardRef,
  Fragment,
  isValidElement,
  type ReactNode,
  useMemo,
} from 'react';
import { withNoMotionStyle } from '@/components/shared/withNoMotionStyle';
import { getMotionComponent } from '../utils';
import { useHydratedAnimationPolicy } from '../useHydratedAnimationPolicy';
import { orderLayoutTransition } from './ReorderTransition.presets';
import { OrderContext } from './ReorderTransitionContext';
import { ReorderTransitionItem } from './ReorderTransitionItem';
import type { ReorderTransitionProps } from './ReorderTransition.types';
import { materializeReactNodeTree } from '@/components/shared/flattenFragmentChildren';

const ReorderTransitionRootImpl = forwardRef<HTMLDivElement, ReorderTransitionProps>(
  (
    { asChild, animationType = 'pop', exitMode = 'popLayout', children, className, style, ...rest },
    ref,
  ) => {
    const materializedChildren = materializeReactNodeTree(children as ReactNode);
    const canUseAsChild = Boolean(
      asChild && isValidElement(materializedChildren) && materializedChildren.type !== Fragment,
    );
    const Component = useMemo(
      () => getMotionComponent(canUseAsChild ? Slot : 'div'),
      [canUseAsChild],
    );
    const { resolvedMotionStyle, shouldAnimate } = useHydratedAnimationPolicy();
    const safeRest = sanitizeControlledMotionProps(rest);
    const contextValue = useMemo(() => ({ animationType }), [animationType]);
    const transitionChildren: ReactNode =
      isValidElement<{ children?: ReactNode }>(materializedChildren) &&
      materializedChildren.type === Fragment
        ? materializedChildren.props.children
        : materializedChildren;
    const presenceChildrenSource: ReactNode =
      canUseAsChild && isValidElement<{ children?: ReactNode }>(materializedChildren)
        ? materializedChildren.props.children
        : transitionChildren;
    const canAnimatePresence = Children.toArray(presenceChildrenSource).every(isValidElement);
    const presenceChildren = canAnimatePresence ? (
      <AnimatePresence initial={false} mode={exitMode}>
        {presenceChildrenSource}
      </AnimatePresence>
    ) : (
      presenceChildrenSource
    );
    const staticChildren = withNoMotionStyle(materializedChildren, !shouldAnimate && canUseAsChild);
    const renderedChildren =
      canUseAsChild && isValidElement<{ children?: ReactNode }>(staticChildren)
        ? cloneElement(staticChildren, {
            children: presenceChildren,
          })
        : presenceChildren;

    return (
      <OrderContext.Provider value={contextValue}>
        {/* eslint-disable-next-line react-hooks/static-components -- Component is resolved through the shared motion cache for polymorphic asChild support. */}
        <Component
          ref={ref}
          {...safeRest}
          layout={shouldAnimate}
          transition={
            shouldAnimate
              ? applyMotionStyle({ layout: orderLayoutTransition }, resolvedMotionStyle)
              : undefined
          }
          className={className}
          style={shouldAnimate ? sanitizeStaticStyle(style) : createNoMotionStyle(style)}
        >
          {renderedChildren}
        </Component>
      </OrderContext.Provider>
    );
  },
);

ReorderTransitionRootImpl.displayName = 'ReorderTransition';

const ReorderTransitionRoot = defineMotionSlotComponent<HTMLDivElement, ReorderTransitionProps>(
  ReorderTransitionRootImpl,
);

/**
 * Coordinates animation for keyed additions, removals, and reorders.
 *
 * Keys identify items across renders. The caller retains collection state,
 * persistence, keyboard reordering, and live announcements. Use the compound
 * `Item` for individual animated children; policy-disabled motion settles
 * without animation.
 */
export const ReorderTransition = Object.assign(ReorderTransitionRoot, {
  Item: ReorderTransitionItem,
});
