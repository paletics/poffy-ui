'use client';

import { Slot } from '@radix-ui/react-slot';
import { cx } from '@/styled-system/css';
import { list } from '@/styled-system/recipes';
import { ElementType, forwardRef } from 'react';
import { ListItemTextProps } from './List.types';
import { useListContext } from './ListContext';

/**
 * The text block within a ListItem, supporting primary and secondary labels.
 * ### AI Context & Architecture
 * - Tier: Atoms, Stack: Panda CSS (Recipe: list), Radix Slot
 * ### Design Tokens
 * - typography: silver-ratio scale applied to font sizes.
 * ### Variant Logic
 * - Inherits parent variant from ListContext.
 * ### Notes
 * Supports `primary` and `secondary` text slots for two-line list items.
 * ### Accessibility
 * - Secondary text should have sufficient contrast ratio for legibility.
 * @example
 * ```tsx
 * import { List } from '@poffy-ui/react/data-display';
 *
 * <List.Item>
 *   <List.Text primary="Settings" secondary="Manage your preferences" />
 * </List.Item>
 * ```
 */
export const ListItemText = forwardRef<HTMLDivElement, ListItemTextProps>((props, ref) => {
  const { asChild, children, primary, secondary, className, ...rest } = props;
  const { variant } = useListContext();
  const classes = list({ variant });
  const Component = asChild ? Slot : ('div' as ElementType);

  return (
    <Component ref={ref} className={cx(classes.text, className)} {...rest}>
      {primary && <div className={cx(classes.primary)}>{primary}</div>}
      {secondary && <div className={cx(classes.secondary)}>{secondary}</div>}
      {children}
    </Component>
  );
});

ListItemText.displayName = 'List.Text';
