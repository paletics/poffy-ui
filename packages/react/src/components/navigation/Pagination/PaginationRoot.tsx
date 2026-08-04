'use client';

import { cx } from '@/styled-system/css';
import { pagination } from '@/styled-system/recipes';
import { LayoutGroup } from 'motion/react';
import { forwardRef, useId, useMemo } from 'react';
import type { PaginationRootProps } from './Pagination.types';
import { PaginationContext } from './PaginationContext';
import { useOptionalLocale } from '@/providers/LocaleProvider';
import { getPaginationLabels } from './Pagination.locales';

/**
 * The compound root for custom pagination navigation.
 *
 * It provides the list structure, pagination styles, and active-indicator
 * context required by `PaginationItem`, `PaginationLink`, and
 * `PaginationEllipsis`. Use `Pagination` when its generated page range is
 * sufficient.
 */
export const PaginationRoot = forwardRef<HTMLElement, PaginationRootProps>((props, ref) => {
  const {
    className,
    appearance,
    size,
    indicatorAnimation = 'stable',
    children,
    locale: localeProp,
    labels: labelOverrides,
    'data-pagination-compact': compact,
    'aria-label': ariaLabel,
    ...rest
  } = props as PaginationRootProps & { 'data-pagination-compact'?: boolean };
  const localeContext = useOptionalLocale();
  const labels = getPaginationLabels(localeProp ?? localeContext?.locale, labelOverrides);
  const indicatorId = useId();
  const classes = useMemo(() => pagination({ appearance, size }), [appearance, size]);
  const contextValue = useMemo(
    () => ({ classes, indicatorId, indicatorAnimation, labels }),
    [classes, indicatorId, indicatorAnimation, labels],
  );

  return (
    <PaginationContext.Provider value={contextValue}>
      <LayoutGroup id={indicatorId}>
        <nav
          ref={ref}
          aria-label={ariaLabel ?? labels.navigation}
          data-pagination-compact={compact}
          className={cx(classes.root, className)}
          {...rest}
        >
          <ul className={classes.list} data-pagination-compact={compact}>
            {children}
          </ul>
        </nav>
      </LayoutGroup>
    </PaginationContext.Provider>
  );
});

PaginationRoot.displayName = 'PaginationRoot';
