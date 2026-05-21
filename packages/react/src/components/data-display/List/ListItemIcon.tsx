'use client';

import { Slot } from '@radix-ui/react-slot';
import { cx } from '@/styled-system/css';
import { list } from '@/styled-system/recipes';
import { ElementType, forwardRef } from 'react';
import { ListItemIconProps } from './List.types';
import { useListContext } from './ListContext';

/**
 * An icon slot within a ListItem, providing consistent alignment.
 * ### AI Context & Architecture
 * - Tier: Atoms, Stack: Panda CSS (Recipe: list), Radix Slot
 * ### Variant Logic
 * - Inherits parent variant from ListContext.
 * ### Notes
 * Renders as `div` by default. Aligns icons consistently with list text.
 * ### Accessibility
 * - Icons should be `aria-hidden` if decorative.
 * @example
 * ```tsx
 * import { List } from '@poffy-ui/react/data-display';
 * import { HomeIcon } from '@poffy-ui/react/media';
 *
 * <List.Item>
 *   <List.Icon aria-hidden><HomeIcon /></List.Icon>
 *   <List.Text primary="Home" />
 * </List.Item>
 * ```
 */
export const ListItemIcon = forwardRef<HTMLDivElement, ListItemIconProps>((props, ref) => {
  const { asChild, children, className, ...rest } = props;
  const { variant } = useListContext();
  const classes = list({ variant });
  const Component = asChild ? Slot : ('div' as ElementType);

  return (
    <Component ref={ref} className={cx(classes.icon, className)} {...rest}>
      {children}
    </Component>
  );
});

ListItemIcon.displayName = 'List.Icon';
