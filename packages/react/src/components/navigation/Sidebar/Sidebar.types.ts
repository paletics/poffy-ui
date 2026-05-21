import { sidebar } from '@/styled-system/recipes';
import type { NavigationAppearance, PrimitiveProps } from '@poffy-ui/types';
import { ReactNode } from 'react';

/**
 * Variants for the Sidebar component based on Panda CSS recipe.
 */
export type SidebarVariants = NonNullable<Parameters<typeof sidebar>[0]>;

/**
 * Public Sidebar variant props with supported navigation appearance names.
 */
export interface SidebarVariantSubset extends Omit<SidebarVariants, 'appearance'> {
  /**
   * Surface treatment.
   *
   * @defaultValue `'soft'`
   */
  appearance?: Extract<NavigationAppearance, 'soft' | 'outline'>;
  /**
   * Legacy layout alias.
   */
  variant?: SidebarVariants['variant'];
}

/**
 * Props for the root Sidebar component.
 *
 * @example
 * ```tsx
 * import {
 *   Sidebar,
 *   SidebarContent,
 *   SidebarGroup,
 *   SidebarHeader,
 *   SidebarItem,
 * } from '@poffy-ui/react/navigation';
 * ```
 *
 * ### Notes
 * Required structure: place branding in `SidebarHeader`, navigation groups in
 * `SidebarContent`, and persistent account/actions in `SidebarFooter`.
 *
 * ### AI Usage
 * - Do: use for persistent app navigation in dashboards and admin surfaces.
 * - Don't: use Sidebar for transient action menus; use Dropdown.
 *
 * ### AI Context & Architecture
 * - Tier: Molecules, Engine: Panda CSS (Recipe: sidebar)
 */
export interface SidebarRootProps extends PrimitiveProps<'aside', SidebarVariantSubset> {
  /**
   * Sidebar sub-components (Header, Content, Footer).
   */
  children?: ReactNode;
}

/**
 * Props for the SidebarHeader component.
 *
 * ### Notes
 * Use for product identity, workspace switchers, or compact controls
 * that should remain visually tied to the sidebar.
 */
export interface SidebarHeaderProps extends PrimitiveProps<'header'> {
  /**
   * Header content.
   */
  children?: ReactNode;
}

/**
 * Props for the SidebarContent component.
 *
 * ### Notes
 * Primary scrollable/navigation area for `SidebarGroup` and
 * `SidebarItem` children.
 */
export interface SidebarContentProps extends PrimitiveProps<'div'> {
  /**
   * Content items.
   */
  children?: ReactNode;
}

/**
 * Props for the SidebarFooter component.
 *
 * ### Notes
 * Use for account controls, secondary actions, or status details that
 * should stay visually after the main navigation.
 */
export interface SidebarFooterProps extends PrimitiveProps<'footer'> {
  /**
   * Footer content.
   */
  children?: ReactNode;
}

/**
 * Props for the SidebarGroup component.
 *
 * ### Notes
 * Pass `label` when a group needs a screen-reader-visible heading in
 * expanded mode. In collapsed sidebars, the implementation avoids referencing
 * hidden labels from `aria-labelledby`.
 */
export interface SidebarGroupProps extends PrimitiveProps<'div'> {
  /**
   * Optional label for the group.
   */
  label?: ReactNode;
  /**
   * Group items.
   */
  children?: ReactNode;
}

/**
 * Props for the SidebarItem component.
 *
 * ### Notes
 * Renders as an anchor by default. Use `asChild` for router integration and
 * `isActive` for the current route so `aria-current="page"` is applied.
 *
 * ### AI Context & Architecture
 * - Tier: Atoms, Stack: ActionMotion, Radix Slot
 */
export interface SidebarItemProps extends PrimitiveProps<'a'> {
  /**
   * Whether the item represents the current active page.
   * @defaultValue false
   */
  isActive?: boolean;
  /**
   * Optional icon to display before the text.
   */
  icon?: ReactNode;
  /**
   * Item text.
   */
  children?: ReactNode;
}
