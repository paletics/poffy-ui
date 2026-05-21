'use client';

import { cx } from '@/styled-system/css';
import { pagination } from '@/styled-system/recipes';
import { LayoutGroup } from 'motion/react';
import { forwardRef, useId, useMemo } from 'react';
import type { PaginationProps } from './Pagination.types';
import { PaginationContext } from './PaginationContext';
import { PaginationEllipsis } from './PaginationEllipsis';
import { PaginationItem } from './PaginationItem';
import { PaginationLink } from './PaginationLink';
import { usePaginationRange } from './usePaginationRange';

/**
 * A page navigation control for stepping through paginated datasets.
 * ### AI Context & Architecture
 * - Tier: Molecules, Stack: Panda CSS (Recipe: pagination), PaginationContext, usePaginationRange
 * ### Design Tokens
 * - spacing/sizing: silver-ratio tokens applied to item size and gap.
 * ### Variant Logic
 * - size: sm/md/lg scales the page item dimensions symmetrically.
 * ### Notes
 * Uses `usePaginationRange` hook for smart ellipsis calculation based on `siblingCount` and `boundaryCount`.
 * ### Accessibility
 * - Must render as `<nav aria-label="pagination">`. Active page must have `aria-current="page"`.
 * ### AI Usage
 * - Use for any list view displaying more than one page of results.
 * - Prefer server-side pagination over client-side slice for large datasets.
 *
 * @example
 * ```tsx
 * import { Pagination } from '@poffy-ui/react/navigation';
 *
 * <Pagination count={10} page={page} onChange={setPage} />
 * ```
 *
 * @example Dense table pagination
 * ```tsx
 * import { Pagination } from '@poffy-ui/react/navigation';
 *
 * <Pagination count={totalPages} page={page} onChange={setPage} size="sm" />
 * ```
 */
export const Pagination = forwardRef<HTMLElement, PaginationProps>((props, ref) => {
  const {
    count,
    page,
    onChange,
    siblingCount = 1,
    boundaryCount = 1,
    className,
    appearance,
    size,
    indicatorAnimation = 'stable',
    ...rest
  } = props;

  const safeCount = Math.max(1, count);
  const safePage = Math.min(Math.max(1, page), safeCount);
  const indicatorId = useId();

  const classes = useMemo(() => pagination({ appearance, size }), [appearance, size]);
  const paginationItems = usePaginationRange({
    count: safeCount,
    page: safePage,
    siblingCount,
    boundaryCount,
  });

  const contextValue = useMemo(
    () => ({ classes, indicatorId, indicatorAnimation }),
    [classes, indicatorId, indicatorAnimation],
  );

  return (
    <PaginationContext.Provider value={contextValue}>
      <LayoutGroup id={indicatorId}>
        <nav ref={ref} aria-label="pagination" className={cx(classes.root, className)} {...rest}>
          <ul className={classes.list}>
            <PaginationItem>
              <PaginationLink
                onClick={() => onChange?.(safePage - 1)}
                disabled={safePage <= 1}
                aria-label="Go to previous page"
              >
                Prev
              </PaginationLink>
            </PaginationItem>

            {paginationItems.map((item) => {
              if (item === 'dots-left' || item === 'dots-right') {
                return <PaginationEllipsis key={item} />;
              }

              return (
                <PaginationItem key={item}>
                  <PaginationLink
                    isActive={item === safePage}
                    onClick={() => onChange?.(item)}
                    aria-label={item === safePage ? `Page ${item}` : `Go to page ${item}`}
                  >
                    {item}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

            <PaginationItem>
              <PaginationLink
                onClick={() => onChange?.(safePage + 1)}
                disabled={safePage >= safeCount}
                aria-label="Go to next page"
              >
                Next
              </PaginationLink>
            </PaginationItem>
          </ul>
        </nav>
      </LayoutGroup>
    </PaginationContext.Provider>
  );
});

Pagination.displayName = 'Pagination';
