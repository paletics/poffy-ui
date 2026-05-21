'use client';

import { Slot } from '@radix-ui/react-slot';

import { cx } from '@/styled-system/css';
import { avatarGroup } from '@/styled-system/recipes';
import { Children, cloneElement, ElementType, forwardRef, isValidElement, useMemo } from 'react';
import { AvatarGroupRootProps } from './AvatarGroup.types';
import { AvatarGroupContext } from './AvatarGroupContext';
import { AvatarGroupExcess } from './AvatarGroupExcess';

interface AvatarGroupChildProps {
  className?: string;
  size?: AvatarGroupRootProps['size'];
}

/**
 * The root container for the AvatarGroup component.
 * ### AI Context & Architecture
 * - Tier: Atoms, Stack: Panda CSS (Recipe: avatarGroup), React Context, Radix Slot
 * ### Design Tokens
 * - spacing: silver-ratio tokens map to negative margins for overlap
 * ### Variant Logic
 * - size: Dictates visual hierarchy (sm, md, lg) passed down to children.
 * ### Notes
 * Responsible for calculating child overlap margin and injecting the excess indicator.
 * ### Accessibility
 * - Relies on child avatars for screen reader semantic meaning.
 * ### AI Usage
 * - Do not use this directly. Use `AvatarGroup` instead.
 */
export const AvatarGroupRoot = forwardRef<HTMLDivElement, AvatarGroupRootProps>((props, ref) => {
  const {
    asChild,
    children,
    className,
    size = 'md',
    max,
    spacing = '-sm',
    total,
    onExcessClick,
    ...rest
  } = props;

  const styles = avatarGroup({ size, spacing });
  const Component = asChild ? Slot : ('div' as ElementType);

  const contextValue = useMemo(() => ({ size, spacing }), [size, spacing]);

  const validChildren = Children.toArray(
    asChild && isValidElement(children)
      ? (children as React.ReactElement<{ children?: React.ReactNode }>).props.children
      : children,
  ).filter(isValidElement);

  const hasMax = max !== undefined;
  const normalizedMax = hasMax ? Math.max(0, max) : undefined;
  const childrenToShow = hasMax ? validChildren.slice(0, normalizedMax) : validChildren;

  let excessCount = 0;
  if (total !== undefined) {
    excessCount = total - childrenToShow.length;
  } else if (hasMax) {
    excessCount = validChildren.length - (normalizedMax ?? 0);
  }
  excessCount = Math.max(0, excessCount);

  const processedChildren = [
    ...childrenToShow.map((child) => {
      const childElement = child as React.ReactElement<AvatarGroupChildProps>;
      return cloneElement(childElement, {
        className: cx('avatar', childElement.props.className),
        size: childElement.props.size ?? size,
      });
    }),
    excessCount > 0 && (
      <AvatarGroupExcess
        key="excess"
        count={excessCount}
        index={childrenToShow.length}
        onClick={onExcessClick}
      />
    ),
  ].filter(Boolean);

  return (
    <AvatarGroupContext.Provider value={contextValue}>
      <Component ref={ref} className={cx(styles, className)} {...rest}>
        {asChild && isValidElement(children)
          ? cloneElement(children as React.ReactElement<{ children?: React.ReactNode }>, {
              children: processedChildren,
            })
          : processedChildren}
      </Component>
    </AvatarGroupContext.Provider>
  );
});

AvatarGroupRoot.displayName = 'AvatarGroup.Root';
