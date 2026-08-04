'use client';

import { ActionMotion } from '@/components/animations/ActionMotion';
import { getFallbackChildrenForNativeAnchor, isAsChildHost } from '@/components/shared/asChild';
import { getSafeInteractiveContent } from '@/components/shared/getSafeInteractiveContent';
import { resolveSafeLinkRel } from '@/components/shared/linkTarget';
import { cx } from '@/styled-system/css';
import { Slot } from '@radix-ui/react-slot';
import {
  cloneElement,
  ElementType,
  forwardRef,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from 'react';
import type { BreadcrumbLinkProps } from './Breadcrumbs.types';
import { useBreadcrumbs } from './BreadcrumbsContext';

const breadcrumbLinkAsChildHostNames = new Set(['a']);

interface BreadcrumbLinkChildProps {
  'aria-label'?: string;
  'aria-labelledby'?: string;
  children?: ReactNode;
  title?: string;
  href?: string;
  target?: string;
  rel?: string;
}

type BreadcrumbLinkRuntimeProps = BreadcrumbLinkProps &
  Partial<
    Pick<
      React.AnchorHTMLAttributes<HTMLAnchorElement>,
      'download' | 'hrefLang' | 'media' | 'ping' | 'referrerPolicy' | 'type'
    >
  >;

/**
 * Renders a breadcrumb link or the non-interactive current-page indicator. `isCurrentPage` takes
 * precedence over `asChild` and strips anchor navigation props while setting `aria-current="page"`.
 */
export const BreadcrumbLink = forwardRef<HTMLElement, BreadcrumbLinkProps>((props, ref) => {
  const {
    children,
    isCurrentPage,
    className,
    asChild,
    href,
    target,
    rel,
    download,
    hrefLang,
    media,
    ping,
    referrerPolicy,
    type,
    role,
    tabIndex,
    contentEditable,
    onAuxClick,
    onAuxClickCapture,
    onClick,
    onClickCapture,
    onContextMenu,
    onContextMenuCapture,
    onDoubleClick,
    onDoubleClickCapture,
    onKeyDown,
    onKeyDownCapture,
    onKeyPress,
    onKeyPressCapture,
    onKeyUp,
    onKeyUpCapture,
    onMouseDown,
    onMouseDownCapture,
    onMouseUp,
    onMouseUpCapture,
    onPointerDown,
    onPointerDownCapture,
    onPointerUp,
    onPointerUpCapture,
    onTouchCancel,
    onTouchCancelCapture,
    onTouchEnd,
    onTouchEndCapture,
    onTouchStart,
    onTouchStartCapture,
    'aria-current': ariaCurrent,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    title,
    ...rest
  } = props as BreadcrumbLinkRuntimeProps;
  const { classes } = useBreadcrumbs();
  const asChildHost =
    asChild && isAsChildHost(children, breadcrumbLinkAsChildHostNames) ? children : null;
  const canUseAsChild = asChildHost !== null;
  const childProps = isValidElement<BreadcrumbLinkChildProps>(children) ? children.props : {};
  const currentPageProps = isCurrentPage
    ? {
        'aria-label': ariaLabel ?? childProps['aria-label'],
        'aria-labelledby': ariaLabelledBy ?? childProps['aria-labelledby'],
        title: title ?? childProps.title,
      }
    : {};

  // isCurrentPage takes priority over asChild: the <span> swap is a semantic safety guard
  // that prevents self-navigation. Bypassing it via asChild would defeat the purpose.
  const effectiveHref = href ?? childProps.href;
  const effectiveTarget = target ?? childProps.target;
  const effectiveRel = resolveSafeLinkRel(effectiveTarget, rel ?? childProps.rel);
  const hasHref = effectiveHref !== undefined && effectiveHref !== null;
  const canUseAsChildWithHref = canUseAsChild;
  const Component = (
    isCurrentPage ? 'span' : canUseAsChildWithHref ? Slot : hasHref ? 'a' : 'span'
  ) as ElementType;

  const linkProps =
    isCurrentPage || !hasHref
      ? {}
      : {
          href: effectiveHref,
          target: effectiveTarget,
          rel: effectiveRel,
          download,
          hrefLang,
          media,
          ping,
          referrerPolicy,
          type,
        };
  const semanticRoleProps = isCurrentPage ? {} : { role };
  const interactiveProps = isCurrentPage
    ? {}
    : {
        tabIndex,
        contentEditable,
        onAuxClick,
        onAuxClickCapture,
        onClick,
        onClickCapture,
        onContextMenu,
        onContextMenuCapture,
        onDoubleClick,
        onDoubleClickCapture,
        onKeyDown,
        onKeyDownCapture,
        onKeyPress,
        onKeyPressCapture,
        onKeyUp,
        onKeyUpCapture,
        onMouseDown,
        onMouseDownCapture,
        onMouseUp,
        onMouseUpCapture,
        onPointerDown,
        onPointerDownCapture,
        onPointerUp,
        onPointerUpCapture,
        onTouchCancel,
        onTouchCancelCapture,
        onTouchEnd,
        onTouchEndCapture,
        onTouchStart,
        onTouchStartCapture,
      };
  const content = isCurrentPage
    ? getSafeInteractiveContent(childProps.children ?? children, { preserveOpaque: true })
    : canUseAsChildWithHref
      ? cloneElement(
          asChildHost as ReactElement<BreadcrumbLinkChildProps>,
          { href: effectiveHref, target: effectiveTarget, rel: effectiveRel },
          getSafeInteractiveContent(asChildHost.props.children, { preserveOpaque: true }),
        )
      : asChild
        ? getFallbackChildrenForNativeAnchor(children)
        : getSafeInteractiveContent(children, { preserveOpaque: true });

  return (
    <ActionMotion asChild animationType="press" disabled={isCurrentPage}>
      <Component
        ref={ref}
        className={cx(classes.link, className)}
        {...linkProps}
        {...rest}
        {...semanticRoleProps}
        {...interactiveProps}
        {...currentPageProps}
        aria-current={isCurrentPage ? 'page' : ariaCurrent}
        data-current={isCurrentPage ? '' : undefined}
      >
        {canUseAsChildWithHref
          ? content
          : asChild
            ? getFallbackChildrenForNativeAnchor(children)
            : content}
      </Component>
    </ActionMotion>
  );
});

BreadcrumbLink.displayName = 'BreadcrumbLink';
