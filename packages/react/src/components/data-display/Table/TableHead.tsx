'use client';

import { Slot } from '@radix-ui/react-slot';
import { cx } from '@/styled-system/css';
import { table } from '@/styled-system/recipes';
import { ElementType, forwardRef } from 'react';
import { useTableContext } from './TableContext';
import { TableHeadProps } from './Table.types';

/**
 * Table head section styled by the parent Table recipe context.
 */
export const TableHead = forwardRef<HTMLTableSectionElement, TableHeadProps>((props, ref) => {
  const { asChild, children, className, ...rest } = props;
  const { variant, size, layout } = useTableContext();
  const Component = asChild ? Slot : ('thead' as ElementType);
  const classes = table({ variant, size, layout });

  return (
    <Component ref={ref} className={cx(classes.head, className)} {...rest}>
      {children}
    </Component>
  );
});

TableHead.displayName = 'Table.Head';
