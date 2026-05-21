'use client';

import { cx } from '@/styled-system/css';
import { forwardRef } from 'react';
import type { PaginationItemProps } from './Pagination.types';
import { usePagination } from './PaginationContext';

/**
 * A wrapper for individual pagination controls (links or ellipsis).
 */
export const PaginationItem = forwardRef<HTMLLIElement, PaginationItemProps>((props, ref) => {
  const { className, ...rest } = props;
  const { classes } = usePagination();
  return <li ref={ref} className={cx(classes.item, className)} {...rest} />;
});

PaginationItem.displayName = 'PaginationItem';
