'use client';

import { cx } from '@/styled-system/css';
import { navbar } from '@/styled-system/recipes';
import { forwardRef, useMemo } from 'react';
import type { NavbarRootProps } from './Navbar.types';
import { NavbarContext } from './NavbarContext';

/**
 * A top-of-page horizontal navigation bar for branding, links, and actions.
 * ### AI Context & Architecture
 * - Tier: Organisms, Stack: Panda CSS (Recipe: navbar), NavbarContext
 * ### Design Tokens
 * - height/padding: silver-ratio tokens
 * ### Variant Logic
 * - sticky=`position: sticky; top: 0` for persistent visibility on scroll.
 * ### Notes
 * Distributes `classes` via `NavbarContext` to NavbarBrand, NavbarContent, NavbarItem, NavbarLink.
 * ### Accessibility
 * - Renders as `<nav>`. Must contain a `<NavbarBrand>` with the site name for screen readers.
 * ### AI Usage
 * - Use as the primary top navigation for marketing sites and dashboards.
 * - Enable `sticky` for layouts where the nav must remain visible during scroll.
 *
 * @example
 * ```tsx
 * import {
 *   Navbar,
 *   NavbarBrand,
 *   NavbarContent,
 *   NavbarItem,
 *   NavbarLink,
 * } from '@poffy-ui/react/navigation';
 *
 * <Navbar sticky>
 *   <NavbarBrand href="/">Poffy</NavbarBrand>
 *   <NavbarContent justify="end">
 *     <NavbarItem><NavbarLink href="/docs">Docs</NavbarLink></NavbarItem>
 *   </NavbarContent>
 * </Navbar>
 * ```
 */
export const Navbar = forwardRef<HTMLElement, NavbarRootProps>((props, ref) => {
  const { children, className, appearance, sticky, ...rest } = props;
  const classes = useMemo(() => navbar({ appearance, sticky }), [appearance, sticky]);

  return (
    <NavbarContext.Provider value={classes}>
      <nav ref={ref} className={cx(classes.root, className)} {...rest}>
        {children}
      </nav>
    </NavbarContext.Provider>
  );
});

Navbar.displayName = 'Navbar.Root';
