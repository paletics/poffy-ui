'use client';

import { Slot } from '@radix-ui/react-slot';
import { cx } from '@/styled-system/css';
import { table } from '@/styled-system/recipes';
import { ElementType, forwardRef } from 'react';
import { useTableContext } from './TableContext';
import { TableRowProps } from './Table.types';

/**
 * Table row styled by the parent Table recipe context.
 */
export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>((props, ref) => {
  const { asChild, children, className, ...rest } = props;
  const { variant, size, layout } = useTableContext();
  const Component = asChild ? Slot : ('tr' as ElementType);
  const classes = table({ variant, size, layout });

  return (
    <Component ref={ref} className={cx(classes.row, className)} {...rest}>
      {children}
    </Component>
  );
});

TableRow.displayName = 'Table.Row';
