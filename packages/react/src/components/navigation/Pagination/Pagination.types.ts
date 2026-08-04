import { pagination } from '@/styled-system/recipes';
import type { NativeProps, NavigationAppearance } from '@poffy-ui/types';
import { ReactNode } from 'react';
import type { LayoutAnimationType } from '@/components/animations/LayoutTransition';

type PaginationRecipeVariants = NonNullable<Parameters<typeof pagination>[0]>;

/**
 * Public Pagination variant props with shared navigation appearance names.
 */
export interface PaginationVariantSubset extends Omit<PaginationRecipeVariants, 'appearance'> {
  /**
   * Surface treatment.
   *
   * @defaultValue `'soft'`
   */
  appearance?: NavigationAppearance;
}

/** Canonical public variants accepted by Pagination. */
export type PaginationVariants = PaginationVariantSubset;

/** Localized static text used by monolithic and compound pagination. */
export interface PaginationLabels {
  /** Accessible name for the navigation landmark. */
  navigation: string;
  /** Visible previous-page control text. */
  previous: string;
  /** Visible next-page control text. */
  next: string;
  /** Accessible label for the previous-page control. */
  previousPage: string;
  /** Accessible label for the next-page control. */
  nextPage: string;
  /** Accessible label for collapsed page-range ellipsis. */
  morePages: string;
}

/**
 * Props for the root Pagination component.
 *
 * ### Notes
 * Use `PaginationRoot` with this type for custom compound pagination built from
 * `PaginationItem`, `PaginationLink`, and `PaginationEllipsis`. For the
 * built-in generated range, use `PaginationProps`.
 */
export interface PaginationRootProps extends NativeProps<'nav', PaginationVariantSubset> {
  /**
   * Pagination items (list and links).
   */
  children?: ReactNode;
  /**
   * Animation preset for the active page indicator.
   * @defaultValue 'stable'
   */
  indicatorAnimation?: LayoutAnimationType;
  /** BCP 47 locale for labels; exact locale, base language, then English. */
  locale?: string;
  /** Overrides localized pagination labels. */
  labels?: Partial<PaginationLabels>;
}

/**
 * Props for the individual PaginationItem wrapper.
 */
export type PaginationItemProps = NativeProps<'li'>;

/**
 * Props for a pagination control that behaves as a native link with `href`, or as an Enter/Space-
 * activatable button when no destination is supplied.
 */
export interface PaginationLinkProps extends NativeProps<'a'> {
  /**
   * Whether this link represents the current active page.
   * @defaultValue false
   */
  isActive?: boolean;
  /**
   * Whether the link is disabled (e.g., for "Prev" on the first page).
   * Disabled links omit `href`, are removed from the tab order, and suppress Enter/Space
   * activation while retaining `aria-disabled` state.
   * @defaultValue false
   */
  disabled?: boolean;
}

/**
 * Props for the PaginationEllipsis component.
 */
export type PaginationEllipsisProps = NativeProps<'li'>;

/** Props for controlled one-based pagination with a stable page count and `onChange` handler. */
export interface PaginationProps extends Omit<PaginationRootProps, 'onChange' | 'children'> {
  /**
   * Total number of pages.
   *
   * ### Notes
   * Must be a positive integer for meaningful navigation. Invalid values fall back to one page.
   */
  count: number;
  /**
   * Current active page (1-indexed). Invalid values fall back to page one and values beyond `count`
   * are clamped.
   */
  page: number;
  /**
   * Notification fired when an enabled generated page control is activated.
   *
   * Receives a one-based page number. It does not cancel navigation: when
   * `getHref` returns a URL, the generated control remains a normal link and
   * also invokes this callback.
   */
  onChange?: (page: number) => void;
  /**
   * Number of always visible pages before and after the current page.
   * @defaultValue 1
   */
  siblingCount?: number;
  /**
   * Number of always visible pages at the beginning and end.
   * Very large values are capped so the total rendered range stays bounded.
   * @defaultValue 1
   */
  boundaryCount?: number;
  /** Formats visible page numbers. */
  formatPage?: (page: number) => string;
  /** Returns the accessible label for a page link. */
  getPageAriaLabel?: (page: number, isCurrent: boolean) => string;
  /**
   * Returns the URL for a one-based page. When omitted, generated controls use
   * state-button semantics and call `onChange` without link navigation.
   */
  getHref?: (page: number) => string | undefined;
}
