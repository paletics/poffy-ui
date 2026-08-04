'use client';

import { Slot } from '@radix-ui/react-slot';
import { cx } from '@/styled-system/css';
import { ElementType, forwardRef } from 'react';
import { useTableContext } from './TableContext';
import { TableCellProps } from './Table.types';
import { getTableFallbackChildren, isTableAsChildHost } from './Table.utils';
import { tableStickyClasses, tableTextAlignClasses, tableTruncateClass } from './TableCell.styles';

/**
 * Renders a native `td` with optional text alignment, truncation, and stickiness.
 *
 * `sticky="start"` or `"end"` pins the cell visually within a horizontally
 * scrolling table; it does not create the scroll container. `asChild` accepts
 * only `td` and otherwise falls back to the native cell.
 */
export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>((props, ref) => {
  const { asChild, children, className, textAlign, truncate, sticky, ...rest } = props;
  const { classes } = useTableContext();
  const canUseAsChild = Boolean(asChild && isTableAsChildHost(children, ['td']));
  const renderedChildren = canUseAsChild
    ? children
    : asChild
      ? getTableFallbackChildren(children)
      : children;
  const Component = (canUseAsChild ? Slot : 'td') as ElementType;

  return (
    <Component
      ref={ref}
      className={cx(
        classes.cell,
        textAlign === undefined ? undefined : tableTextAlignClasses[textAlign],
        truncate ? tableTruncateClass : undefined,
        sticky === undefined ? undefined : tableStickyClasses[sticky],
        className,
      )}
      data-sticky={sticky === undefined ? undefined : ''}
      {...rest}
    >
      {renderedChildren}
    </Component>
  );
});

TableCell.displayName = 'Table.Cell';
