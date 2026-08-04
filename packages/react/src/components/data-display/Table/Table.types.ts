import type { table } from '@/styled-system/recipes';
import type { RecipeVariantProps } from '@/styled-system/types';
import type { NativeProps, PrimitiveProps } from '@poffy-ui/types';

/** Public type for `TableVariants`. */
export type TableVariants = RecipeVariantProps<typeof table>;

/**
 * Visual variants for the Table root.
 */
export type TableBaseProps = TableVariants;

/** Horizontal text alignment for table cells. */
export type TableTextAlign = 'start' | 'center' | 'end';

/** WAI-ARIA sort state for a column header. */
export type TableSortDirection = 'ascending' | 'descending' | 'none' | 'other';

/** Public props for TableCellDisplay. */
export interface TableCellDisplayProps {
  /** Visual text alignment within the cell. */
  textAlign?: TableTextAlign;
  /** Prevent wrapping and show an ellipsis when the cell has a constrained width. */
  truncate?: boolean;
  /** Pin a leading or trailing column while an enclosing scroll container scrolls horizontally. */
  sticky?: 'start' | 'end';
}

/**
 * Props for the root semantic `table` element.
 *
 * @example
 * ```tsx
 * import { Table } from '@poffy-ui/react/data-display';
 * ```
 *
 * ### Notes
 * Do: preserve native table structure: caption, thead, tbody, tr, th, and td.
 * Don't: use Table for layout grids or virtualized data sets.
 *
 * Related: `TableHeadProps`
 * Related: `TableCellProps`
 */
export type TableProps = PrimitiveProps<'table', TableBaseProps>;

/**
 * Props for the table head section. Render as `thead`.
 */
export type TableHeadProps = PrimitiveProps<'thead'>;

/**
 * Props for the table body section. Render as `tbody`.
 */
export type TableBodyProps = PrimitiveProps<'tbody'>;

/**
 * Props for a table row. Render as `tr`.
 */
export type TableRowProps = PrimitiveProps<'tr'>;

/**
 * Props for a table data cell. Use native `th` elements for column or row headers.
 */
export type TableCellProps = PrimitiveProps<'td', TableCellDisplayProps>;

/** Props required to associate a header cell with its data cells. */
export interface TableHeaderCellBaseProps {
  scope: 'col' | 'colgroup' | 'row' | 'rowgroup';
  /** Current sort state for this header. Sorting behavior remains application-owned. */
  sortDirection?: TableSortDirection;
}

/** Props for a table header cell with an explicit association scope. */
export type TableHeaderCellProps = PrimitiveProps<
  'th',
  TableHeaderCellBaseProps & TableCellDisplayProps
>;

/**
 * Props for the table caption. Add one concise caption for screen reader context.
 */
export type TableCaptionProps = PrimitiveProps<'caption'>;

/**
 * Props for the table footer section. Render as `tfoot`.
 */
export type TableFooterProps = PrimitiveProps<'tfoot'>;

/** A semantic empty-state cell spanning the supplied number of table columns. */
export type TableEmptyStateProps = NativeProps<'td', { colSpan: number }>;

/** Props for a native `colgroup` used to declare shared column dimensions. */
export type TableColumnGroupProps = PrimitiveProps<'colgroup'>;

/** Props for a native `col` used within `Table.ColumnGroup`. */
export type TableColumnProps = NativeProps<'col'>;

/**
 * Props for the optional fixed `<div>` that owns horizontal table overflow.
 *
 * ### Notes
 * The container intentionally does not support `asChild`, because it must remain
 * the element that owns scrolling. It enters the tab order only when horizontal
 * overflow is present, and exposes a localized fallback name. Use `aria-label` or
 * `aria-labelledby` to provide table-specific context, or `tabIndex` to override
 * the automatic focus behavior.
 */
export type TableScrollContainerProps = NativeProps<'div'>;
