'use client';

import { cx } from '@/styled-system/css';
import { forwardRef } from 'react';
import { TableCell } from './TableCell';
import { useTableContext } from './TableContext';
import { TableRow } from './TableRow';
import type { TableEmptyStateProps } from './Table.types';

/**
 * A single semantic table row for an empty result set.
 *
 * `colSpan` is required because the component cannot infer column counts from
 * native table markup without changing its rendering semantics.
 */
export const TableEmptyState = forwardRef<HTMLTableCellElement, TableEmptyStateProps>(
  ({ children, className, colSpan, ...rest }, ref) => {
    const { classes } = useTableContext();

    return (
      <TableRow>
        <TableCell
          ref={ref}
          colSpan={colSpan}
          className={cx(classes.emptyState, className)}
          {...rest}
        >
          {children}
        </TableCell>
      </TableRow>
    );
  },
);

TableEmptyState.displayName = 'Table.EmptyState';
