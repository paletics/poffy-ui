import {
  buildPaginationItems,
  type BuildPaginationItemsOptions,
  type PaginationEllipsis,
  type PaginationItem,
} from '@poffy-ui/behavior/pagination';

/**
 * Ellipsis marker emitted by the pagination range helper.
 */
export type PaginationDot = PaginationEllipsis;

/**
 * Numeric page item emitted by the pagination range helper.
 */
export type PaginationRangeItem = PaginationItem;

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
 * Custom hook to calculate the array of page numbers and "dots" to display.
 * Implements logic to handle truncation and boundary cases.
 *
 * @param props - Hook configuration options.
 * @returns An array of page numbers or stable dot sentinel strings ('dots-left' | 'dots-right').
 *
 * @example
 * ```tsx
 * import { usePaginationRange } from '@poffy-ui/react/navigation';
 * ```
 *
 * ### AI Context & Architecture
 * 'dots-left' and 'dots-right' are used instead of a generic 'dots' string to provide
 * stable React keys that do not change as the current page changes, avoiding unnecessary
 * re-mounts of the PaginationEllipsis component.
 */
export const usePaginationRange = ({
  count,
  page,
  siblingCount = 1,
  boundaryCount = 1,
}: UsePaginationRangeProps): PaginationRangeItem[] => {
  return buildPaginationItems({
    count,
    page,
    siblingCount,
    boundaryCount,
  });
};
