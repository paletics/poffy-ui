'use client';

import { forwardRef } from 'react';
import type { PaginationProps } from './Pagination.types';
import { PaginationEllipsis } from './PaginationEllipsis';
import { PaginationItem } from './PaginationItem';
import { PaginationLink } from './PaginationLink';
import { PaginationRoot } from './PaginationRoot';
import { usePaginationRange } from './usePaginationRange';
import { useOptionalLocale } from '@/providers/LocaleProvider';
import { getDefaultPageAriaLabel, getPaginationLabels } from './Pagination.locales';

const positiveInteger = (value: number, fallback: number): number =>
  Number.isSafeInteger(value) && value > 0 ? value : fallback;

const nonNegativeInteger = (value: number, fallback: number): number =>
  Number.isSafeInteger(value) && value >= 0 ? value : fallback;

const resolveSupportedLocale = (locale: string): string => {
  try {
    const canonicalLocale = Intl.getCanonicalLocales(locale)[0];
    return canonicalLocale && Intl.NumberFormat.supportedLocalesOf([canonicalLocale]).length > 0
      ? canonicalLocale
      : 'en-US';
  } catch {
    return 'en-US';
  }
};

/**
 * Renders a labelled, controlled page-navigation control. `page` is one-based and navigation is
 * clamped to the valid range; invalid counts and configuration values use safe fallback values.
 * Use it for known page counts rather than cursor-only or infinite feeds.
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
    locale: localeProp,
    labels: labelOverrides,
    formatPage,
    getPageAriaLabel,
    getHref,
    ...rest
  } = props;

  const localeContext = useOptionalLocale();
  const locale = resolveSupportedLocale(localeProp ?? localeContext?.locale ?? 'en-US');
  const labels = getPaginationLabels(locale, labelOverrides);
  const numberFormatter = new Intl.NumberFormat(locale);
  const resolvePageText = (pageNumber: number) =>
    formatPage?.(pageNumber) ?? numberFormatter.format(pageNumber);
  const resolvePageAriaLabel = (pageNumber: number, isCurrent: boolean) =>
    getPageAriaLabel?.(pageNumber, isCurrent) ??
    getDefaultPageAriaLabel(locale, isCurrent, resolvePageText(pageNumber));

  const safeCount = positiveInteger(count, 1);
  const safePage = Math.min(positiveInteger(page, 1), safeCount);
  const safeSiblingCount = nonNegativeInteger(siblingCount, 1);
  const safeBoundaryCount = nonNegativeInteger(boundaryCount, 1);
  const paginationItems = usePaginationRange({
    count: safeCount,
    page: safePage,
    siblingCount: safeSiblingCount,
    boundaryCount: safeBoundaryCount,
  });

  return (
    <PaginationRoot
      ref={ref}
      className={className}
      appearance={appearance}
      size={size}
      indicatorAnimation={indicatorAnimation}
      locale={locale}
      labels={labels}
      data-pagination-compact
      {...rest}
    >
      <PaginationItem>
        <PaginationLink
          data-pagination-direction="previous"
          data-pagination-kind="navigation"
          href={getHref?.(Math.max(1, safePage - 1))}
          onClick={() => onChange?.(safePage - 1)}
          disabled={safePage <= 1}
          aria-label={labels.previousPage}
        >
          {labels.previous}
        </PaginationLink>
      </PaginationItem>

      {paginationItems.map((item) => {
        if (item === 'dots-left' || item === 'dots-right') {
          return <PaginationEllipsis key={item} />;
        }

        return (
          <PaginationItem key={item}>
            <PaginationLink
              data-pagination-kind="page"
              href={getHref?.(item)}
              isActive={item === safePage}
              onClick={() => {
                if (item !== safePage) onChange?.(item);
              }}
              aria-label={resolvePageAriaLabel(item, item === safePage)}
            >
              {resolvePageText(item)}
            </PaginationLink>
          </PaginationItem>
        );
      })}

      <PaginationItem>
        <PaginationLink
          data-pagination-direction="next"
          data-pagination-kind="navigation"
          href={getHref?.(Math.min(safeCount, safePage + 1))}
          onClick={() => onChange?.(safePage + 1)}
          disabled={safePage >= safeCount}
          aria-label={labels.nextPage}
        >
          {labels.next}
        </PaginationLink>
      </PaginationItem>
    </PaginationRoot>
  );
});

Pagination.displayName = 'Pagination';
