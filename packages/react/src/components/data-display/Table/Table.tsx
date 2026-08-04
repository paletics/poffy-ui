'use client';

import { TableRoot } from './TableRoot';
import { TableHead } from './TableHead';
import { TableBody } from './TableBody';
import { TableFooter } from './TableFooter';
import { TableRow } from './TableRow';
import { TableCell } from './TableCell';
import { TableHeaderCell } from './TableHeaderCell';
import { TableCaption } from './TableCaption';
import { TableScrollContainer } from './TableScrollContainer';
import { TableEmptyState } from './TableEmptyState';
import { TableColumn } from './TableColumn';
import { TableColumnGroup } from './TableColumnGroup';

/**
 * Builds a native semantic table with styled compound parts.
 *
 * The parts preserve table structure rather than emulating it with ARIA.
 * `Table.ScrollContainer` is the separate horizontal-overflow owner, while
 * `Table.EmptyState` produces a row containing one spanning data cell.
 */
export const Table = Object.assign(TableRoot, {
  Root: TableRoot,
  Head: TableHead,
  Body: TableBody,
  Footer: TableFooter,
  Row: TableRow,
  Cell: TableCell,
  HeaderCell: TableHeaderCell,
  ColumnGroup: TableColumnGroup,
  Column: TableColumn,
  EmptyState: TableEmptyState,
  Caption: TableCaption,
  ScrollContainer: TableScrollContainer,
});
