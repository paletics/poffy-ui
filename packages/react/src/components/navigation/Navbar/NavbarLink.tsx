'use client';

import { ActionMotion } from '@/components/animations/ActionMotion';
import { getFallbackChildrenForNativeAnchor, isAsChildHost } from '@/components/shared/asChild';
import { getSafeInteractiveContent } from '@/components/shared/getSafeInteractiveContent';
import {
  resolveDelegatedLinkDestination,
  resolveSafeLinkRel,
} from '@/components/shared/linkTarget';
import { omitNativeAnchorOnlyProps } from '@/components/shared/linkDelegation';
import { cx } from '@/styled-system/css';
import { Slot } from '@radix-ui/react-slot';
import { cloneElement, ElementType, forwardRef, isValidElement } from 'react';
import type { AnchorHTMLAttributes, ReactElement, ReactNode } from 'react';
import type { NavbarLinkComponent, NavbarLinkProps } from './Navbar.types';
import { useNavbar } from './NavbarContext';


const NavbarLinkImpl = forwardRef<HTMLElement, NavbarLinkProps>((props, ref) => {
  const {
    className,
    isActive,
    children,
    asChild,
    href,
    target: targetProp,
    rel: relProp,
    'aria-current': ariaCurrent,
    ...rest
  } = props as NavbarLinkProps & AnchorHTMLAttributes<HTMLAnchorElement>;
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
  const securedChild = canUseAsChild
    ? cloneElement(
        asChildHost as ReactElement<{
          href?: string;
          target?: string;
          rel?: string;
          'aria-current'?: string;
        }>,
        { ...(hasHref ? { href: effectiveHref } : {}), target, rel },
        getSafeInteractiveContent(
          (asChildHost as ReactElement<{ children?: ReactNode }>).props.children,
          { preserveOpaque: true },
        ),
      )
    : null;
  const content =
    securedChild && isActive
      ? cloneElement(securedChild, { 'aria-current': 'page' })
      : (securedChild ?? children);
  return (
    <ActionMotion asChild animationType="press">
      <Component
        ref={ref}
        className={cx(classes.link, className)}
        {...hostProps}
        {...(hasDestination ? { target, rel } : {})}
        {...(hasHref ? { href: effectiveHref } : {})}
        aria-current={isActive ? 'page' : ariaCurrent}
        data-active={isActive ? '' : undefined}
      >
        {canUseAsChild ? content : asChild ? getFallbackChildrenForNativeAnchor(children) : content}
      </Component>
    </ActionMotion>
  );
});

NavbarLinkImpl.displayName = 'NavbarLink';

/** Renders a navigation link with the Navbar's shared active and layout treatment. */

export const NavbarLink = NavbarLinkImpl as NavbarLinkComponent;
