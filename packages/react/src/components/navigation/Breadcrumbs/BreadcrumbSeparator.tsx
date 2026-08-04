'use client';

import { cx } from '@/styled-system/css';
import { getSafeInteractiveContent } from '@/components/shared/getSafeInteractiveContent';
import { forwardRef } from 'react';
import type { BreadcrumbSeparatorProps } from './Breadcrumbs.types';
import { useBreadcrumbs } from './BreadcrumbsContext';

/**
 * Renders a decorative manual breadcrumb separator. Use only with `separator={null}` on Breadcrumbs
 * to avoid duplicate separators; it is hidden from assistive technology.
 */
export const BreadcrumbSeparator = forwardRef<HTMLLIElement, BreadcrumbSeparatorProps>(
  (props, ref) => {
    const {
      children,
      className,
      asChild: _unsupportedAsChild,
      ...rest
    } = props as BreadcrumbSeparatorProps & {
      asChild?: boolean;
    };
    const { classes, separator } = useBreadcrumbs();
    const content = children ?? separator;

    if (
      content === null ||
      content === undefined ||
      content === false ||
      content === true ||
      content === ''
    ) {
      return null;
    }

    return (
      <li ref={ref} className={cx(classes.separator, className)} {...rest} aria-hidden="true">
        {getSafeInteractiveContent(content, { preserveOpaque: true })}
      </li>
    );
  },
);

BreadcrumbSeparator.displayName = 'BreadcrumbSeparator';
