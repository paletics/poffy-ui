import { pagination } from '@/styled-system/recipes';
import type { NativeProps, NavigationAppearance } from '@poffy-ui/types';
import { ReactNode } from 'react';
import type { LayoutAnimationType } from '@/components/animations/LayoutTransition';

/**
 * Variants for the Pagination component based on Panda CSS recipe.
 */
export type PaginationVariants = NonNullable<Parameters<typeof pagination>[0]>;

/**
 * Public Pagination variant props with shared navigation appearance names.
 */
export interface PaginationVariantSubset extends Omit<PaginationVariants, 'appearance'> {
  /**
   * Surface treatment.
   *
   * @defaultValue recipe default
   */
  appearance?: NavigationAppearance;
}

/**
 * Props for the root Pagination component.
 *
 * ### Notes
 * Use this type for custom compound pagination built from `PaginationItem`,
 * `PaginationLink`, and `PaginationEllipsis`. For the built-in generated range,
 * use `PaginationProps`.
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
}

/**
 * Props for the individual PaginationItem wrapper.
 */
export type PaginationItemProps = NativeProps<'li'>;

/**
 * Props for the PaginationLink component.
 *
 * ### AI Context & Architecture
 * Uses <a> without href for client-side navigation compatibility. tabIndex and
 * onKeyDown (Enter/Space) are applied manually in PaginationLink.tsx because
 * <a> without href is not focusable by default per the HTML spec.
 */
export interface PaginationLinkProps extends NativeProps<'a'> {
  /**
   * Whether this link represents the current active page.
   * @defaultValue false
   */
  isActive?: boolean;
  /**
   * Whether the link is disabled (e.g., for "Prev" on the first page).
   * @defaultValue false
   */
  disabled?: boolean;
}

/**
 * Props for the PaginationEllipsis component.
 */
export type PaginationEllipsisProps = NativeProps<'li'>;

/**
 * Combined props for the monolithic Pagination component.
 *
 * @example
 * ```tsx
 * import { Pagination } from '@poffy-ui/react/navigation';
 * ```
 *
 * ### Notes
 * `page` is 1-indexed. The component clamps displayed navigation to the valid
 * range but callers should still keep their state in sync with `onChange`.
 *
 * ### AI Usage
 * - Do: provide a stable `count`, current `page`, and `onChange` handler.
 * - Don't: use Pagination for infinite scrolling or cursor-only feeds.
 */
export interface PaginationProps extends Omit<PaginationRootProps, 'onChange' | 'children'> {
  /**
   * Total number of pages.
   *
   * ### Notes
   * Must be a positive integer for meaningful navigation.
   */
  count: number;
  /**
   * Current active page (1-indexed).
   */
  page: number;
  /**
   * Callback fired when the page changes.
   *
   * ### Notes
   * Receives a 1-indexed page number.
   */
  onChange?: (page: number) => void;
  /**
   * Number of always visible pages before and after the current page.
   * @defaultValue 1
   */
  siblingCount?: number;
  /**
   * Number of always visible pages at the beginning and end.
   * @defaultValue 1
   */
  boundaryCount?: number;
}
