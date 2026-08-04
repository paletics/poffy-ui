import { cx } from '@/styled-system/css';
import { link } from '@/styled-system/recipes';
import { Slot, Slottable } from '@radix-ui/react-slot';
import { cloneElement, forwardRef } from 'react';
import type { AnchorHTMLAttributes, ElementType, ReactElement } from 'react';
import { getFallbackChildrenForNativeAnchor } from '@/components/shared/asChild';
import {
  resolveDelegatedLinkDestination,
  resolveSafeLinkRel,
} from '@/components/shared/linkTarget';
import { omitNativeAnchorOnlyProps } from '@/components/shared/linkDelegation';
import type { LinkComponent, LinkProps } from './Link.types';
import {
  getLinkFallbackAttributes,
  getLinkFallbackChildren,
  isLinkAsChildHost,
} from './Link.utils';


const LinkImpl = forwardRef<HTMLElement, LinkProps>((rawProps, ref) => {
  const {
    variant,
    colorScheme,
    external = false,
    asChild = false,
    className,
    children,
    href,
    target: targetProp,
    rel: relProp,
    ...props
  } = rawProps as LinkProps & AnchorHTMLAttributes<HTMLAnchorElement>;
  const asChildHost = asChild && isLinkAsChildHost(children) ? children : null;
  const destination = resolveDelegatedLinkDestination(href, asChildHost);
  const canUseAsChild = asChildHost !== null && destination.hasDestination;
  const child = canUseAsChild ? asChildHost : null;
  const childTarget = child?.props.target;
  const childRel = child?.props.rel;
  const { effectiveHref, hasDestination, hasHref } = destination;
  const target = hasDestination ? (external ? '_blank' : (targetProp ?? childTarget)) : undefined;
  const rel = hasDestination ? resolveSafeLinkRel(target, relProp ?? childRel) : undefined;
  const Component = (canUseAsChild ? Slot : hasDestination ? 'a' : 'span') as ElementType;
  const slottedChild = canUseAsChild
    ? cloneElement(child as ReactElement<{ href?: string; rel?: string; target?: string }>, {
        ...(hasHref ? { href: effectiveHref } : {}),
        rel,
        target,
      })
    : null;
  const renderedChildren = canUseAsChild
    ? null
    : asChild
      ? hasDestination
        ? getFallbackChildrenForNativeAnchor(children)
        : getLinkFallbackChildren(children)
      : children;
  const fallbackAttributes = asChild && !canUseAsChild ? getLinkFallbackAttributes(children) : {};
  const hostProps = hasDestination ? props : omitNativeAnchorOnlyProps(props);

  return (
    <Component
      ref={ref}
      className={cx(link({ variant, colorScheme }), className)}
      {...fallbackAttributes}
      {...hostProps}
      {...(hasDestination ? { target, rel } : {})}
      {...(hasHref ? { href: effectiveHref } : {})}
    >
      {canUseAsChild ? <Slottable>{slottedChild}</Slottable> : renderedChildren}
    </Component>
  );
});

LinkImpl.displayName = 'Link';
/**
 * Renders a navigation link with managed external-link behavior. Unsafe navigation URLs are
 * omitted; callers must provide an accessible name through content or ARIA labeling. Without a
 * usable destination it renders a `span`, not a clickable anchor. `asChild` delegates to a router
 * component or native anchor only when it can provide a destination and forwarded anchor props.
 */
export const Link = LinkImpl as LinkComponent;
