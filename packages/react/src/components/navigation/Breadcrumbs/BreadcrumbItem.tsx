'use client';

import { cx } from '@/styled-system/css';
import { forwardRef } from 'react';
import type { BreadcrumbItemProps } from './Breadcrumbs.types';
import { useBreadcrumbs } from './BreadcrumbsContext';

/**
 * A single list item (`<li>`) within the Breadcrumbs ordered list.
 * Consumes styling classes from BreadcrumbsContext; does not carry its own recipe.
 *
 * ### AI Context & Architecture
 * - Tier: Atoms, Stack: Panda CSS (Recipe: breadcrumbs via context)
 * ### Design Tokens
 * - Gap and spacing are inherited from the Breadcrumbs root recipe.
 * ### Accessibility
 * - Renders as `<li>` inside `<ol>`. Do not use outside of a `<Breadcrumbs>` root.
 * ### AI Usage
 * - Wrap each `<BreadcrumbLink>` inside a `<BreadcrumbItem>`. Never skip this wrapper
 *   or the list semantics will break.
 */
export const BreadcrumbItem = forwardRef<HTMLLIElement, BreadcrumbItemProps>((props, ref) => {
  const { children, className, ...rest } = props;
  const { classes } = useBreadcrumbs();

  return (
    <li ref={ref} className={cx(classes.item, className)} {...rest}>
      {children}
    </li>
  );
});

BreadcrumbItem.displayName = 'BreadcrumbItem';
