'use client';

import { forwardRef } from 'react';
import type { TableColumnProps } from './Table.types';

/** A native `col` declaration to use within `Table.ColumnGroup`. */
export const TableColumn = forwardRef<HTMLTableColElement, TableColumnProps>((props, ref) => (
  <col ref={ref} {...props} />
));

TableColumn.displayName = 'Table.Column';
