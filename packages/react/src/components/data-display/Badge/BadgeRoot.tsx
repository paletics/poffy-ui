'use client';

import { Slot, Slottable } from '@radix-ui/react-slot';
import { cx } from '@/styled-system/css';
import { badge } from '@/styled-system/recipes';
import { Children, ElementType, forwardRef, isValidElement, type ReactNode, useMemo } from 'react';
import { BadgeContext } from './BadgeContext';
import { BadgeIndicator } from './BadgeIndicator';
import type { BadgeRootComponent, BadgeRootProps } from './Badge.types';
import { isBadgeRootAsChildHost } from './Badge.utils';
import { materializeReactNodeTree } from '@/components/shared/flattenFragmentChildren';

const isBadgeIndicatorElement = (child: ReactNode) =>
  isValidElement(child) && child.type === BadgeIndicator;

const BadgeRootImpl = forwardRef<HTMLElement, BadgeRootProps>((props, ref) => {
  const { asChild, size, placement, intent, appearance, shape, children, className, ...rest } =
    props;
  const classes = useMemo(
    () => badge({ size, placement, intent, appearance, shape }),
    [size, placement, intent, appearance, shape],
  );
  const childArray = Children.toArray(materializeReactNodeTree(children));
  const [anchor, ...indicatorChildren] = childArray;
  const canUseAsChild = Boolean(
    asChild && isBadgeRootAsChildHost(anchor) && indicatorChildren.every(isBadgeIndicatorElement),
  );
  const Component = (canUseAsChild ? Slot : 'div') as ElementType;

  const contextValue = useMemo(
    () => ({ size, placement, intent, appearance, shape, classes, isDelegated: canUseAsChild }),
    [size, placement, intent, appearance, shape, classes, canUseAsChild],
  );

  return (
    <BadgeContext.Provider value={contextValue}>
      <Component ref={ref} className={cx(classes.root, className)} {...rest}>
        {canUseAsChild ? <Slottable>{anchor}</Slottable> : <Slottable>{childArray}</Slottable>}
        {canUseAsChild ? indicatorChildren : null}
      </Component>
    </BadgeContext.Provider>
  );
});

BadgeRootImpl.displayName = 'Badge.Root';

/**
 * Provides badge placement and visual variants to `Badge.Indicator` children.
 *
 * The default `div` can contain arbitrary content. With `asChild`, its first
 * child becomes the anchor and every remaining child must be a
 * `Badge.Indicator`; otherwise it safely falls back to the default root.
 */

export const BadgeRoot = BadgeRootImpl as BadgeRootComponent;
