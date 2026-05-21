'use client';

import { cx } from '@/styled-system/css';
import { Slot } from '@radix-ui/react-slot';
import { ElementType, forwardRef } from 'react';
import type { NavbarBrandProps } from './Navbar.types';
import { useNavbar } from './NavbarContext';

/**
 * A component to display the brand logo or name within the Navbar.
 * Renders as `<a>` by default. Use `asChild` to delegate to a router Link.
 *
 * @example
 * ```tsx
 * // Default
 * <NavbarBrand href="/">Logo</NavbarBrand>
 *
 * // asChild — delegate to Next.js Link
 * <NavbarBrand asChild><NextLink href="/">Logo</NextLink></NavbarBrand>
 * ```
 */
export const NavbarBrand = forwardRef<HTMLAnchorElement, NavbarBrandProps>((props, ref) => {
  const { className, children, asChild, ...rest } = props;
  const classes = useNavbar();
  const Component = (asChild ? Slot : 'a') as ElementType;
  return (
    <Component ref={ref} className={cx(classes.brand, className)} {...rest}>
      {children}
    </Component>
  );
});

NavbarBrand.displayName = 'NavbarBrand';
