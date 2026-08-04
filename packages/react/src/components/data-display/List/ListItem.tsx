'use client';

import { cx } from '@/styled-system/css';
import { forwardRef } from 'react';
import { ListItemProps } from './List.types';
import { useListContext } from './ListContext';

/** Renders one semantic `li` and applies the owning List's item styles. */
export const ListItem = forwardRef<HTMLLIElement, ListItemProps>((props, ref) => {
  const { children, className, ...rest } = props;
  const { classes } = useListContext();

  return (
    <li ref={ref} className={cx(classes.item, className)} {...rest}>
      {children}
    </li>
  );
});

ListItem.displayName = 'List.Item';
