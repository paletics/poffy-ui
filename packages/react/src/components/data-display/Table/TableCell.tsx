'use client';

import { Slot } from '@radix-ui/react-slot';
import { cx } from '@/styled-system/css';
import { table } from '@/styled-system/recipes';
import { ElementType, forwardRef } from 'react';
import { useTableContext } from './TableContext';
import { TableCellProps } from './Table.types';

/**
 * Table cell styled by the parent Table recipe context.
 */
export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>((props, ref) => {
  const { asChild, children, className, ...rest } = props;
  const { variant, size, layout } = useTableContext();
  const Component = asChild ? Slot : ('td' as ElementType);
  const classes = table({ variant, size, layout });

  return (
    <Component ref={ref} className={cx(classes.cell, className)} {...rest}>
      {children}
    </Component>
  );
});

TableCell.displayName = 'Table.Cell';
