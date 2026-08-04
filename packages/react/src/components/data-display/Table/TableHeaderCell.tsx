'use client';

import { Slot } from '@radix-ui/react-slot';
import { cx } from '@/styled-system/css';
import { ElementType, forwardRef } from 'react';
import { useTableContext } from './TableContext';
import { TableHeaderCellProps } from './Table.types';
import { getTableFallbackChildren, isTableAsChildHost } from './Table.utils';
import {
  tableStickyHeaderClasses,
  tableTextAlignClasses,
  tableTruncateClass,
} from './TableCell.styles';

/**
 * Renders a semantic `th` with an explicit association scope.
 *
 * `sortDirection` writes `aria-sort` only; sorting interaction and state are
 * application-owned. `asChild` accepts only `th` and otherwise falls back to
 * a native header cell.
 */
export const TableHeaderCell = forwardRef<HTMLTableCellElement, TableHeaderCellProps>(
  (props, ref) => {
    const { asChild, children, className, textAlign, truncate, sticky, sortDirection, ...rest } =
      props;
    const { classes } = useTableContext();
    const canUseAsChild = Boolean(asChild && isTableAsChildHost(children, ['th']));
    const renderedChildren = canUseAsChild
      ? children
      : asChild
        ? getTableFallbackChildren(children)
        : children;
    const Component = (canUseAsChild ? Slot : 'th') as ElementType;

    return (
      <Component
        ref={ref}
        className={cx(
          classes.cell,
          textAlign === undefined ? undefined : tableTextAlignClasses[textAlign],
          truncate ? tableTruncateClass : undefined,
          sticky === undefined ? undefined : tableStickyHeaderClasses[sticky],
          className,
        )}
        data-sticky={sticky === undefined ? undefined : ''}
        aria-sort={sortDirection}
        {...rest}
      >
        {renderedChildren}
      </Component>
    );
  },
);

TableHeaderCell.displayName = 'Table.HeaderCell';
