import { breadcrumbs } from '@/styled-system/recipes';
import { PrimitiveProps } from '@poffy-ui/types';
import { ReactNode } from 'react';

/**
 * Variants for the Breadcrumbs component based on the Panda CSS recipe.
 */
export type BreadcrumbsVariants = NonNullable<Parameters<typeof breadcrumbs>[0]>;

/**
 * Props for the Breadcrumbs root component.
 *
 * @example
 * ```tsx
 * import { BreadcrumbItem, BreadcrumbLink, Breadcrumbs } from '@poffy-ui/react/navigation';
 * ```
 *
 * ### Notes
 * Required structure: render `BreadcrumbItem` children inside `Breadcrumbs`, with
 * `BreadcrumbLink isCurrentPage` on the last item when it represents the current page.
 *
 * Related: `BreadcrumbItemProps`
 * Related: `BreadcrumbSeparatorProps`
 */
export interface BreadcrumbsRootProps extends PrimitiveProps<'nav', BreadcrumbsVariants> {
  /**
   * Separator element between breadcrumb items.
   *
   * **Auto-injection mode (default):** Pass any `ReactNode` (e.g. `"/"`, `<ChevronIcon />`).
   * Separators are automatically inserted between `<BreadcrumbItem>` elements.
   *
   * **Manual mode:** Pass `null` to disable auto-injection, then place
   * `<BreadcrumbSeparator>` between items yourself for per-item control.
   *
   * @defaultValue `"/"`
   * @example Auto-injection
   * ```tsx
   * <Breadcrumbs separator=">">...</Breadcrumbs>
   * ```
   * @example Manual mode
   * ```tsx
   * <Breadcrumbs separator={null}>
   *   <BreadcrumbItem>...</BreadcrumbItem>
   *   <BreadcrumbSeparator>-</BreadcrumbSeparator>
   *   <BreadcrumbItem>...</BreadcrumbItem>
   * </Breadcrumbs>
   * ```
   */
  separator?: ReactNode | null;
}

/**
 * Props for the individual BreadcrumbItem.
 *
 * ### Notes
 * Use one item per path segment.
 */
export type BreadcrumbItemProps = PrimitiveProps<'li'>;

/**
 * Props for the BreadcrumbLink.
 */
export interface BreadcrumbLinkProps extends PrimitiveProps<'a'> {
  /**
   * Whether this link represents the current page.
   * If true, it renders as a span and sets aria-current="page".
   * @defaultValue `false`
   */
  isCurrentPage?: boolean;
}

/**
 * Props for the BreadcrumbSeparator.
 *
 * ### AI Context & Architecture
 * - For use in manual mode only (`<Breadcrumbs separator={null}>`).
 * Do not use alongside auto-injection mode to avoid duplicate separators.
 */
export interface BreadcrumbSeparatorProps extends PrimitiveProps<'li'> {
  /**
   * Content of the separator.
   * Defaults to the parent `<Breadcrumbs separator>` value via context.
   */
  children?: ReactNode;
}
