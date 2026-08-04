'use client';

import { Slot } from '@radix-ui/react-slot';
import { cx } from '@/styled-system/css';
import { ElementType, forwardRef } from 'react';
import { useTableContext } from './TableContext';
import { TableRowProps } from './Table.types';
import { getTableFallbackChildren, isTableAsChildHost } from './Table.utils';

/**
 * Renders a native `tr` styled by the owning Table.
 *
 * `asChild` accepts only `tr`; unsupported delegated content retains native
 * `td` and `th` children before falling back to the default element.
 */
export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>((props, ref) => {
  const { asChild, children, className, ...rest } = props;
  const { classes } = useTableContext();
  const canUseAsChild = Boolean(asChild && isTableAsChildHost(children, ['tr']));
  const renderedChildren = canUseAsChild
    ? children
    : asChild
      ? getTableFallbackChildren(children, ['td', 'th'])
      : children;
  const Component = (canUseAsChild ? Slot : 'tr') as ElementType;

  return (
    <Component ref={ref} className={cx(classes.row, className)} {...rest}>
      {renderedChildren}
    </Component>
  );
});

TableRow.displayName = 'Table.Row';
