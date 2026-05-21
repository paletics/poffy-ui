'use client';

import { TableRoot } from './TableRoot';
import { TableHead } from './TableHead';
import { TableBody } from './TableBody';
import { TableFooter } from './TableFooter';
import { TableRow } from './TableRow';
import { TableCell } from './TableCell';
import { TableCaption } from './TableCaption';

/**
 * A semantic table for presenting tabular data with headers, rows, and footers.
 *
 * @example
 * ```tsx
 * import { Table } from '@poffy-ui/react/data-display';
 *
 * <Table variant="striped">
 *   <Table.Caption>Monthly sales report</Table.Caption>
 *   <Table.Head>
 *     <Table.Row>
 *       <th scope="col">Month</th>
 *       <th scope="col">Revenue</th>
 *     </Table.Row>
 *   </Table.Head>
 *   <Table.Body>
 *     <Table.Row>
 *       <Table.Cell>January</Table.Cell>
 *       <Table.Cell>$1,200,000</Table.Cell>
 *     </Table.Row>
 *   </Table.Body>
 * </Table>
 * ```
 *
 * ### Notes
 * Required structure: render `Table.Head`, `Table.Body`, `Table.Row`, and cells
 * in native table order. Use native `th` with `scope` for headers.
 *
 * ### AI Context & Architecture
 * - Tier: Organisms, Stack: Panda CSS (Recipe: table), Radix Slot
 * ### Design Tokens
 * - spacing/typography: silver-ratio tokens
 * ### Variant Logic
 * - variant: striped=alternating row backgrounds. bordered=cell borders. compact=reduced padding.
 * Compound component unifying semantic table elements in a composable API.
 * ### Accessibility
 * - Must use `<Table.Caption>` for screen reader description. All column headers must use `<th scope="col">`.
 * ### AI Usage
 * - Use for structured data grids that do NOT require virtualization. For large datasets, use DataGrid instead.
 * - Do not use Table for page layout; use Grid or Stack from `@poffy-ui/react/layout`.
 *
 * Related: `TableRoot`
 * Related: `TableCaption`
 */
export const Table = Object.assign(TableRoot, {
  Root: TableRoot,
  Head: TableHead,
  Body: TableBody,
  Footer: TableFooter,
  Row: TableRow,
  Cell: TableCell,
  Caption: TableCaption,
});
