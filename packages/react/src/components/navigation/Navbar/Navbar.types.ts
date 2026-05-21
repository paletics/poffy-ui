import { navbar } from '@/styled-system/recipes';
import { type NavigationAppearance, NativeProps, PrimitiveProps } from '@poffy-ui/types';
import { ReactNode } from 'react';

/**
 * Variants for the Navbar component based on Panda CSS recipe.
 */
export type NavbarVariants = NonNullable<Parameters<typeof navbar>[0]>;

/**
 * Public Navbar variant props with shared navigation appearance names.
 *
 * ### Notes
 * Use `appearance` for the public API; recipe-specific internals should
 * stay encapsulated.
 */
export interface NavbarVariantSubset extends Omit<NavbarVariants, 'appearance'> {
  /**
   * Surface treatment.
   *
   * @defaultValue recipe default
   */
  appearance?: NavigationAppearance;
}

/**
 * Props for the root Navbar component.
 *
 * @example
 * ```tsx
 * import { Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarLink } from '@poffy-ui/react/navigation';
 * ```
 *
 * ### Notes
 * Required structure: `Navbar` owns layout context and should contain
 * `NavbarBrand` plus one or more `NavbarContent` regions. Put each link inside a
 * `NavbarItem` for stable spacing and semantics.
 *
 * ### AI Context & Architecture
 * Uses `NativeProps` (not `PrimitiveProps`) because the Navbar root element is always a
 * `<nav>` tag and does not support `asChild` delegation.
 */
export type NavbarRootProps = NativeProps<'nav', NavbarVariantSubset & { children?: ReactNode }>;

/**
 * Props for the NavbarBrand component.
 *
 * ### AI Context & Architecture
 * Uses `PrimitiveProps` to support `asChild` delegation for router integration
 * (e.g. `<NavbarBrand asChild><NextLink href="/">Logo</NextLink></NavbarBrand>`).
 */
export type NavbarBrandProps = PrimitiveProps<'a'>;

/**
 * Props for the NavbarContent component.
 */
export type NavbarContentProps = NativeProps<
  'div',
  {
    /**
     * Horizontal alignment of items within the content area.
     * Mapped to CSS `justify-content` via Panda `css()`; not an inline style.
     * @defaultValue 'start'
     */
    justify?: 'start' | 'end' | 'center' | 'between';
  }
>;

/**
 * Props for the NavbarItem component.
 *
 * ### Notes
 * Use as a non-interactive wrapper around `NavbarLink` or action controls.
 */
export type NavbarItemProps = NativeProps<'div'>;

/**
 * Props for the NavbarLink component.
 *
 * ### AI Context & Architecture
 * Uses `PrimitiveProps` to support `asChild` delegation for router integration
 * (e.g. `<NavbarLink asChild><NextLink href="/about">About</NextLink></NavbarLink>`).
 */
export type NavbarLinkProps = PrimitiveProps<
  'a',
  {
    /**
     * Whether the link represents the current page.
     * If true, it sets aria-current="page" and applies active styles.
     * @defaultValue false
     */
    isActive?: boolean;
  }
>;
