import { RecipeVariantProps } from '@/styled-system/types';
import { PrimitiveProps } from '@poffy-ui/types';
import { table } from '@/styled-system/recipes';

/**
 * Extracted variant types from the Panda CSS table recipe.
 *
 * ### Notes
 * Prefer the component props for app code; use this type when extending
 * recipes or authoring wrappers.
 *
 * ### AI Usage
 * - Use when extending table styles.
 */
export type TableVariants = RecipeVariantProps<typeof table>;

/**
 * Base properties for the Table root container.
 * ### Formula
 * - Silver Ratio (1:1.414) applied to padding/spacing tokens.
 */
export type TableBaseProps = TableVariants;

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
export type TableCellProps = PrimitiveProps<'td'>;

/**
 * Props for the table caption. Add one concise caption for screen reader context.
 */
export type TableCaptionProps = PrimitiveProps<'caption'>;

/**
 * Props for the table footer section. Render as `tfoot`.
 */
export type TableFooterProps = PrimitiveProps<'tfoot'>;
