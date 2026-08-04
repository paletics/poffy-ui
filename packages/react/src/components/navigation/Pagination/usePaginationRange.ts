import {
  buildPaginationItems,
  type BuildPaginationItemsOptions,
  type PaginationEllipsis,
  type PaginationItem,
} from '@poffy-ui/behavior/pagination';

/**
 * Raw pagination range item types from the behavior package.
 */
export type { PaginationEllipsis, PaginationItem };

/**
 * Props for the usePaginationRange hook.
 *
 * ### Notes
 * Uses the behavior package contract. Counts are 1-indexed from the
 * component perspective: `page=1` is the first page.
 */
export type UsePaginationRangeProps = BuildPaginationItemsOptions;

/**
 * Builds visible one-based page items with stable left/right ellipsis sentinels. Invalid values are
 * normalized by the underlying pagination utility.
 */
export const usePaginationRange = ({
  count,
  page,
  siblingCount = 1,
  boundaryCount = 1,
}: UsePaginationRangeProps): PaginationItem[] => {
  return buildPaginationItems({
    count,
    page,
    siblingCount,
    boundaryCount,
  });
};
