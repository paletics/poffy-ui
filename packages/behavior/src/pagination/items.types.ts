/** Sentinel values representing collapsed page ranges in the pagination UI. */
export type PaginationEllipsis = 'dots-left' | 'dots-right';

/** A single display item in the pagination UI. */
export type PaginationItem = number | PaginationEllipsis;

/**
 * Options used to build a compact pagination item list.
 */
export interface BuildPaginationItemsOptions {
  /** Total number of pages. Invalid values fall back to one. */
  count: number;
  /** Current one-based active page, clamped to the normalized count. */
  page: number;
  /**
   * Number of always visible pages before and after the current page.
   *
   * Invalid values fall back to one; large requests are capped with boundary
   * pages so the full result contains at most 100 display items.
   * @defaultValue `1`
   */
  siblingCount?: number;
  /**
   * Number of always visible pages at the beginning and end.
   *
   * Invalid values fall back to one; large requests are capped so the full
   * result contains at most 100 display items.
   * @defaultValue `1`
   */
  boundaryCount?: number;
}
