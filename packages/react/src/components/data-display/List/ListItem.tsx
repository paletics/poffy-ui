'use client';

import { Slot } from '@radix-ui/react-slot';
import { cx } from '@/styled-system/css';
import { list } from '@/styled-system/recipes';
import { ElementType, forwardRef } from 'react';
import { ListItemProps } from './List.types';
import { useListContext } from './ListContext';

/**
 * A single list entry within the List component.
 * ### AI Context & Architecture
 * - Tier: Atoms, Stack: Panda CSS (Recipe: list), Radix Slot
 * ### Design Tokens
 * - padding: silver-ratio tokens
 * ### Variant Logic
 * - Inherits parent variant from ListContext.
 * ### Notes
 * Must be a direct child of ListRoot.
 * ### Accessibility
 * - Renders as `li` by default. Ensure each item has readable content.
 * @example
 * ```tsx
 * import { List } from '@poffy-ui/react/data-display';
 *
 * <List.Root variant="unordered">
 *   <List.Item>Item content</List.Item>
 * </List.Root>
 * ```
 */
export const ListItem = forwardRef<HTMLLIElement, ListItemProps>((props, ref) => {
  const { asChild, children, className, ...rest } = props;
  const { variant } = useListContext();
  const classes = list({ variant });
  const Component = asChild ? Slot : ('li' as ElementType);

  return (
    <Component ref={ref} className={cx(classes.item, className)} {...rest}>
      {children}
    </Component>
  );
});

ListItem.displayName = 'List.Item';
