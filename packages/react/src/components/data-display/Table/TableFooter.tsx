'use client';

import { Slot } from '@radix-ui/react-slot';
import { cx } from '@/styled-system/css';
import { table } from '@/styled-system/recipes';
import { ElementType, forwardRef } from 'react';
import { useTableContext } from './TableContext';
import { TableFooterProps } from './Table.types';

/**
 * Table footer section styled by the parent Table recipe context.
 */
export const TableFooter = forwardRef<HTMLTableSectionElement, TableFooterProps>((props, ref) => {
  const { asChild, children, className, ...rest } = props;
  const { variant, size, layout } = useTableContext();
  const Component = asChild ? Slot : ('tfoot' as ElementType);
  const classes = table({ variant, size, layout });

  return (
    <Component ref={ref} className={cx(classes.footer, className)} {...rest}>
      {children}
    </Component>
  );
});

TableFooter.displayName = 'Table.Footer';
