import type { BuildPaginationItemsOptions, PaginationItem } from './items.types';

const range = (start: number, end: number): number[] => {
  const length = end - start + 1;
  return Array.from({ length }, (_, idx) => idx + start);
};

/**
 * Calculates the pagination display items with stable ellipsis sentinels.
 *
 * ### Notes
 * Page numbers are one-based and the returned array preserves render order.
 * Ellipsis entries are stable string sentinels so React pagination components
 * can distinguish collapsed ranges from actual pages when assigning keys,
 * labels, and disabled/current-page attributes.
 */
export const buildPaginationItems = ({
  count,
  page,
  siblingCount = 1,
  boundaryCount = 1,
}: BuildPaginationItemsOptions): PaginationItem[] => {
  const totalPageNumbers = boundaryCount * 2 + siblingCount * 2 + 5;

  if (totalPageNumbers >= count) {
    return range(1, count);
  }

  const leftSiblingIndex = Math.max(page - siblingCount, 1);
  const rightSiblingIndex = Math.min(page + siblingCount, count);

  const shouldShowLeftDots = leftSiblingIndex > boundaryCount + 2;
  const shouldShowRightDots = rightSiblingIndex < count - (boundaryCount + 1);

  if (!shouldShowLeftDots && shouldShowRightDots) {
    const leftItemCount = boundaryCount * 2 + 2 * siblingCount + 2;
    const leftRange = range(1, leftItemCount);
    return [...leftRange, 'dots-right', ...range(count - boundaryCount + 1, count)];
  }

  if (shouldShowLeftDots && !shouldShowRightDots) {
    const rightItemCount = boundaryCount * 2 + 2 * siblingCount + 2;
    const rightRange = range(count - rightItemCount + 1, count);
    return [...range(1, boundaryCount), 'dots-left', ...rightRange];
  }

  if (shouldShowLeftDots && shouldShowRightDots) {
    const middleRange = range(leftSiblingIndex, rightSiblingIndex);
    return [
      ...range(1, boundaryCount),
      'dots-left',
      ...middleRange,
      'dots-right',
      ...range(count - boundaryCount + 1, count),
    ];
  }

  return range(1, count);
};

/**
 * Backward-compatible alias for existing consumers. Prefer `buildPaginationItems`.
 */
export const buildPaginationRange = buildPaginationItems;
