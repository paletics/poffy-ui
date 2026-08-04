'use client';

import { cx } from '@/styled-system/css';
import { forwardRef } from 'react';
import type { PaginationEllipsisProps } from './Pagination.types';
import { usePagination } from './PaginationContext';

/**
 * A visual indicator for skipped pages in the pagination range.
 */
export const PaginationEllipsis = forwardRef<HTMLLIElement, PaginationEllipsisProps>(
  (props, ref) => {
    const { className, 'aria-label': ariaLabel, ...rest } = props;
    const { classes, labels } = usePagination();
    return (
      <li
        ref={ref}
        className={cx(classes.item, className)}
        aria-label={ariaLabel ?? labels.morePages}
        {...rest}
      >
        <span aria-hidden="true" className={classes.ellipsis}>
          ...
        </span>
      </li>
    );
  },
);

PaginationEllipsis.displayName = 'PaginationEllipsis';
