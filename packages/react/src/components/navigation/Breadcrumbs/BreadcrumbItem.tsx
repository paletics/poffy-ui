'use client';

import { cx } from '@/styled-system/css';
import { forwardRef } from 'react';
import type { BreadcrumbItemProps } from './Breadcrumbs.types';
import { useBreadcrumbs } from './BreadcrumbsContext';

/** Wraps one BreadcrumbLink in the ordered list rendered by Breadcrumbs. */
export const BreadcrumbItem = forwardRef<HTMLLIElement, BreadcrumbItemProps>((props, ref) => {
  const {
    children,
    className,
    asChild: _unsupportedAsChild,
    ...rest
  } = props as BreadcrumbItemProps & {
    asChild?: boolean;
  };
  const { classes } = useBreadcrumbs();

  return (
    <li ref={ref} className={cx(classes.item, className)} {...rest}>
      {children}
    </li>
  );
});

BreadcrumbItem.displayName = 'BreadcrumbItem';
