'use client';

import { ActionMotion } from '@/components/animations/ActionMotion';
import { getFallbackChildrenForNativeAnchor, isAsChildHost } from '@/components/shared/asChild';
import { getSafeInteractiveContent } from '@/components/shared/getSafeInteractiveContent';
import { omitNativeAnchorOnlyProps } from '@/components/shared/linkDelegation';
import {
  resolveDelegatedLinkDestination,
  resolveSafeLinkRel,
} from '@/components/shared/linkTarget';
import { cx } from '@/styled-system/css';
import { Slot, Slottable } from '@radix-ui/react-slot';
import { cloneElement, ElementType, forwardRef } from 'react';
import type { AriaAttributes, ReactElement, ReactNode } from 'react';
import type { SidebarItemComponent, SidebarItemProps } from './Sidebar.types';
import { useSidebar } from './SidebarContext';


const SidebarItemImpl = forwardRef<HTMLElement, SidebarItemProps>((props, ref) => {
  const {
    children,
    className,
    isActive,
    icon,
    asChild,
    href,
    target: targetProp,
    rel: relProp,
    'aria-current': ariaCurrent,
    ...rest
  } = props;
  const { classes } = useSidebar();

  const asChildElement =
    asChild && isAsChildHost(children as ReactNode, new Set(['a']))
      ? (children as ReactElement<{
          'aria-current'?: AriaAttributes['aria-current'];
          children?: ReactNode;
          href?: string;
          to?: unknown;
          target?: string;
          rel?: string;
        }>)
      : null;
  const destination = resolveDelegatedLinkDestination(
    href,
    asChildElement ? { type: asChildElement.type, props: asChildElement.props } : null,
  );
  const { effectiveHref, hasDestination, hasHref } = destination;
  const canUseAsChild = asChildElement !== null && hasDestination;
  const Component = (canUseAsChild ? Slot : hasHref ? 'a' : 'span') as ElementType;
  const target = targetProp ?? asChildElement?.props.target;
  const rel = resolveSafeLinkRel(target, relProp ?? asChildElement?.props.rel);
  const hostProps = hasDestination ? rest : omitNativeAnchorOnlyProps(rest);
  const ownedAriaCurrent = isActive ? 'page' : ariaCurrent;
  const content = canUseAsChild
    ? cloneElement(
        asChildElement,
        {
          ...(effectiveHref !== undefined ? { href: effectiveHref } : {}),
          target,
          rel,
          ...(ownedAriaCurrent !== undefined ? { 'aria-current': ownedAriaCurrent } : {}),
        },
        <span className={classes.itemLabel}>
          {getSafeInteractiveContent(asChildElement.props.children, { preserveOpaque: true })}
        </span>,
      )
    : asChild
      ? getFallbackChildrenForNativeAnchor(children as ReactNode)
      : children;

  return (
    <ActionMotion asChild animationType="press" disabled={isActive}>
      <Component
        ref={ref}
        className={cx(classes.item, className)}
        {...hostProps}
        {...(hasDestination ? { target, rel } : {})}
        {...(hasHref ? { href: effectiveHref } : {})}
        aria-current={ownedAriaCurrent}
        data-active={isActive ? '' : undefined}
      >
        {icon && <span aria-hidden="true">{icon}</span>}
        {canUseAsChild ? (
          <Slottable>{content}</Slottable>
        ) : (
          <span className={classes.itemLabel}>{content}</span>
        )}
      </Component>
    </ActionMotion>
  );
});

SidebarItemImpl.displayName = 'SidebarItem';

/** Renders one sidebar navigation item while the owning application controls its active destination. */

export const SidebarItem = SidebarItemImpl as SidebarItemComponent;
