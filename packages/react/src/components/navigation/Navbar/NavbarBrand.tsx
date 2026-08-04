'use client';

import { cx } from '@/styled-system/css';
import { getFallbackChildrenForNativeAnchor, isAsChildHost } from '@/components/shared/asChild';
import { getSafeInteractiveContent } from '@/components/shared/getSafeInteractiveContent';
import {
  resolveDelegatedLinkDestination,
  resolveSafeLinkRel,
} from '@/components/shared/linkTarget';
import { omitNativeAnchorOnlyProps } from '@/components/shared/linkDelegation';
import { Slot } from '@radix-ui/react-slot';
import { cloneElement, ElementType, forwardRef, isValidElement } from 'react';
import type { AnchorHTMLAttributes, ReactElement, ReactNode } from 'react';
import type { NavbarBrandComponent, NavbarBrandProps } from './Navbar.types';
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
const NavbarBrandImpl = forwardRef<HTMLElement, NavbarBrandProps>((props, ref) => {
  const {
    className,
    children,
    asChild,
    href,
    target: targetProp,
    rel: relProp,
    ...rest
  } = props as NavbarBrandProps & AnchorHTMLAttributes<HTMLAnchorElement>;
  const classes = useNavbar();
  const asChildHost = asChild && isAsChildHost(children, new Set(['a'])) ? children : null;
  const childProps = isValidElement<{
    href?: string;
    target?: string;
    rel?: string;
    to?: unknown;
  }>(asChildHost)
    ? asChildHost.props
    : {};
  const destination = resolveDelegatedLinkDestination(
    href,
    asChildHost ? { type: asChildHost.type, props: childProps } : null,
  );
  const { effectiveHref, hasDestination, hasHref } = destination;
  const target = targetProp ?? childProps?.target;
  const rel = resolveSafeLinkRel(target, relProp ?? childProps?.rel);
  const canUseAsChild = asChildHost !== null && hasDestination;
  const hostProps = hasDestination ? rest : omitNativeAnchorOnlyProps(rest);
  const Component = (canUseAsChild ? Slot : hasHref ? 'a' : 'span') as ElementType;
  const content = canUseAsChild
    ? cloneElement(
        asChildHost as ReactElement<{
          href?: string;
          target?: string;
          rel?: string;
          children?: ReactNode;
        }>,
        { ...(hasHref ? { href: effectiveHref } : {}), target, rel },
        getSafeInteractiveContent(
          (asChildHost as ReactElement<{ children?: ReactNode }>).props.children,
          { preserveOpaque: true },
        ),
      )
    : children;
  return (
    <Component
      ref={ref}
      className={cx(classes.brand, className)}
      {...hostProps}
      {...(hasDestination ? { target, rel } : {})}
      {...(hasHref ? { href: effectiveHref } : {})}
    >
      {canUseAsChild ? content : asChild ? getFallbackChildrenForNativeAnchor(children) : content}
    </Component>
  );
});

NavbarBrandImpl.displayName = 'NavbarBrand';

/** Renders the application identity region in a Navbar, optionally as a navigation link. */

export const NavbarBrand = NavbarBrandImpl as NavbarBrandComponent;
