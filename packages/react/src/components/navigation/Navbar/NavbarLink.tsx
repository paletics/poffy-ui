'use client';

import { ActionMotion } from '@/components/animations/ActionMotion';
import { cx } from '@/styled-system/css';
import { Slot } from '@radix-ui/react-slot';
import { ElementType, forwardRef } from 'react';
import type { NavbarLinkProps } from './Navbar.types';
import { useNavbar } from './NavbarContext';

/**
 * An interactive navigation link within a NavbarItem.
 * Renders as `<a>` by default. Use `asChild` to delegate to a router Link.
 *
 * ### AI Context & Architecture
 * - Tier: Atoms, Stack: ActionMotion, Radix Slot (asChild), Recipe: navbar
 * ### Design Tokens
 * - colors: text.secondary -> text.primary (hover)
 * ### Variant Logic
 * - Default: Navigation link. Active: Highlighted state for current page.
 * ### Accessibility
 * - Automatically handles aria-current="page" based on isActive prop.
 * - Keep visible link text; icon-only links require an accessible label.
 * ### AI Usage
 * - **DO**: Use for top-level navigation destinations inside `NavbarItem`.
 * - **DO**: Use `asChild` for framework router links that need client-side navigation.
 * - **DON'T**: Use for buttons that mutate state; use an action component instead.
 *
 * @example Navbar link
 * ```tsx
 * import { Navbar, NavbarContent, NavbarItem, NavbarLink } from '@poffy-ui/react/navigation';
 *
 * <Navbar aria-label="Primary">
 *   <NavbarContent>
 *     <NavbarItem>
 *       <NavbarLink href="/about" isActive>About</NavbarLink>
 *     </NavbarItem>
 *   </NavbarContent>
 * </Navbar>
 * ```
 *
 * @example Router link
 * ```tsx
 * import { NavbarItem, NavbarLink } from '@poffy-ui/react/navigation';
 *
 * <NavbarItem>
 *   <NavbarLink asChild isActive>
 *     <NextLink href="/about">About</NextLink>
 *   </NavbarLink>
 * </NavbarItem>
 * ```
 */
export const NavbarLink = forwardRef<HTMLAnchorElement, NavbarLinkProps>((props, ref) => {
  const { className, isActive, children, asChild, ...rest } = props;
  const classes = useNavbar();
  const Component = (asChild ? Slot : 'a') as ElementType;
  return (
    <ActionMotion asChild animationType="press">
      <Component
        ref={ref}
        aria-current={isActive ? 'page' : undefined}
        data-active={isActive ? '' : undefined}
        className={cx(classes.link, className)}
        {...rest}
      >
        {children}
      </Component>
    </ActionMotion>
  );
});

NavbarLink.displayName = 'NavbarLink';
