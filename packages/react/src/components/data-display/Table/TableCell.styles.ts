import { css } from '@/styled-system/css';
import type { TableCellDisplayProps, TableTextAlign } from './Table.types';

/**
 * Keep every public alignment value statically visible to Panda's extractor.
 */
export const tableTextAlignClasses = {
  start: css({ textAlign: 'start' }),
  center: css({ textAlign: 'center' }),
  end: css({ textAlign: 'end' }),
} satisfies Record<TableTextAlign, string>;

export const tableTruncateClass = css({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const tableStickyClasses = {
  start: css({
    position: 'sticky',
    insetInlineStart: 'var(--table-sticky-offset, 0px)',
    zIndex: 'var(--table-sticky-z-index, 1)',
    bg: 'var(--table-sticky-background)',
    borderInlineEndWidth: 'thin',
    borderColor: 'brand.border',
  }),
  end: css({
    position: 'sticky',
    insetInlineEnd: 'var(--table-sticky-offset, 0px)',
    zIndex: 'var(--table-sticky-z-index, 1)',
    bg: 'var(--table-sticky-background)',
    borderInlineStartWidth: 'thin',
    borderColor: 'brand.border',
  }),
} satisfies Record<NonNullable<TableCellDisplayProps['sticky']>, string>;

export const tableStickyHeaderClasses = {
  start: css({
    position: 'sticky',
    insetInlineStart: 'var(--table-sticky-offset, 0px)',
    zIndex: 'var(--table-sticky-header-z-index, 2)',
    bg: 'var(--table-sticky-background)',
    borderInlineEndWidth: 'thin',
    borderColor: 'brand.border',
  }),
  end: css({
    position: 'sticky',
    insetInlineEnd: 'var(--table-sticky-offset, 0px)',
    zIndex: 'var(--table-sticky-header-z-index, 2)',
    bg: 'var(--table-sticky-background)',
    borderInlineStartWidth: 'thin',
    borderColor: 'brand.border',
  }),
} satisfies Record<NonNullable<TableCellDisplayProps['sticky']>, string>;
