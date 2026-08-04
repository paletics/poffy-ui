import type { BuildPaginationItemsOptions, PaginationItem } from './items.types';

const MAX_PAGINATION_ITEMS = 100;

const range = (start: number, end: number): number[] => {
  const length = end - start + 1;
  return Array.from({ length }, (_, idx) => idx + start);
};

const positiveInteger = (value: number, fallback: number): number =>
  Number.isSafeInteger(value) && value > 0 ? value : fallback;

const nonNegativeInteger = (value: number, fallback: number): number =>
  Number.isSafeInteger(value) && value >= 0 ? value : fallback;

/**
 * Calculates the pagination display items with stable ellipsis sentinels.
 *
 * Page numbers are one-based and the returned array preserves render order.
 * Ellipsis entries are stable string sentinels so React pagination components
 * can distinguish collapsed ranges from actual pages when assigning keys,
 * labels, and disabled/current-page attributes. Invalid count, page, sibling,
 * and boundary inputs fall back to safe values; the active page is clamped to
 * the valid range. Large sibling or boundary requests are capped so the result
 * contains at most 100 items while retaining the active page.
 */
export const buildPaginationItems = ({
  count,
  page,
  siblingCount = 1,
  boundaryCount = 1,
}: BuildPaginationItemsOptions): PaginationItem[] => {
  const safeCount = positiveInteger(count, 1);
  const safePage = Math.min(positiveInteger(page, 1), safeCount);
  const requestedBoundaryCount = nonNegativeInteger(boundaryCount, 1);
  const safeBoundaryCount = Math.min(
    requestedBoundaryCount,
    Math.floor((MAX_PAGINATION_ITEMS - 3) / 3),
  );
  const requestedSiblingCount = nonNegativeInteger(siblingCount, 1);
  const maximumSiblingCount = Math.min(
    Math.floor((MAX_PAGINATION_ITEMS - 5 - safeBoundaryCount * 2) / 2),
    Math.floor((MAX_PAGINATION_ITEMS - 3 - safeBoundaryCount * 3) / 2),
  );
  const safeSiblingCount = Math.min(requestedSiblingCount, maximumSiblingCount);
  const totalPageNumbers = safeBoundaryCount * 2 + safeSiblingCount * 2 + 5;

  if (totalPageNumbers >= safeCount) {
    return range(1, safeCount);
  }

  const leftSiblingIndex = Math.max(safePage - safeSiblingCount, 1);
  const rightSiblingIndex = Math.min(safePage + safeSiblingCount, safeCount);

  const shouldShowLeftDots = leftSiblingIndex > safeBoundaryCount + 2;
  const shouldShowRightDots = rightSiblingIndex < safeCount - (safeBoundaryCount + 1);

  if (!shouldShowLeftDots && shouldShowRightDots) {
    const leftItemCount = safeBoundaryCount * 2 + 2 * safeSiblingCount + 2;
    const leftRange = range(1, leftItemCount);
    return [...leftRange, 'dots-right', ...range(safeCount - safeBoundaryCount + 1, safeCount)];
  }

  if (shouldShowLeftDots && !shouldShowRightDots) {
    const rightItemCount = safeBoundaryCount * 2 + 2 * safeSiblingCount + 2;
    const rightRange = range(safeCount - rightItemCount + 1, safeCount);
    return [...range(1, safeBoundaryCount), 'dots-left', ...rightRange];
  }

  if (shouldShowLeftDots && shouldShowRightDots) {
    const middleRange = range(leftSiblingIndex, rightSiblingIndex);
    return [
      ...range(1, safeBoundaryCount),
      'dots-left',
      ...middleRange,
      'dots-right',
      ...range(safeCount - safeBoundaryCount + 1, safeCount),
    ];
  }

  return range(1, safeCount);
};
