'use client';

import { Slot } from '@radix-ui/react-slot';
import { cx } from '@/styled-system/css';
import { table } from '@/styled-system/recipes';
import { ElementType, forwardRef } from 'react';
import { useTableContext } from './TableContext';
import { TableCaptionProps } from './Table.types';

/**
 * Table caption styled by the parent Table recipe context.
 */
export const TableCaption = forwardRef<HTMLTableCaptionElement, TableCaptionProps>((props, ref) => {
  const { asChild, children, className, ...rest } = props;
  const { variant, size, layout } = useTableContext();
  const Component = asChild ? Slot : ('caption' as ElementType);
  const classes = table({ variant, size, layout });

  return (
    <Component ref={ref} className={cx(classes.caption, className)} {...rest}>
      {children}
    </Component>
  );
});

TableCaption.displayName = 'Table.Caption';
