/** Sentinel values representing collapsed page ranges in the pagination UI. */
export type PaginationEllipsis = 'dots-left' | 'dots-right';

/** A single display item in the pagination UI. */
export type PaginationItem = number | PaginationEllipsis;

/**
 * Options used to build a compact pagination item list.
 */
export interface BuildPaginationItemsOptions {
  /** Total number of pages. */
  count: number;
  /** Current active page. */
  page: number;
  /**
   * Number of always visible pages before and after the current page.
   *
   * @defaultValue `1`
   */
  siblingCount?: number;
  /**
   * Number of always visible pages at the beginning and end.
   *
   * @defaultValue `1`
   */
  boundaryCount?: number;
}

/** Backward-compatible alias for pagination ellipsis values. */
export type PaginationDot = PaginationEllipsis;

/** Backward-compatible alias for pagination display items. */
export type PaginationRangeItem = PaginationItem;

/** Backward-compatible alias for pagination item builder options. */
export type BuildPaginationRangeOptions = BuildPaginationItemsOptions;
