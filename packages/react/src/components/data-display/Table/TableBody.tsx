'use client';

import { Slot } from '@radix-ui/react-slot';
import { cx } from '@/styled-system/css';
import { table } from '@/styled-system/recipes';
import { ElementType, forwardRef } from 'react';
import { useTableContext } from './TableContext';
import { TableBodyProps } from './Table.types';

/**
 * Table body section styled by the parent Table recipe context.
 */
export const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>((props, ref) => {
  const { asChild, children, className, ...rest } = props;
  const { variant, size, layout } = useTableContext();
  const Component = asChild ? Slot : ('tbody' as ElementType);
  const classes = table({ variant, size, layout });

  return (
    <Component ref={ref} className={cx(classes.body, className)} {...rest}>
      {children}
    </Component>
  );
});

TableBody.displayName = 'Table.Body';
