'use client';

import { ActionMotion } from '@/components/animations/ActionMotion';
import { cx } from '@/styled-system/css';
import { Slot } from '@radix-ui/react-slot';
import { ElementType, forwardRef } from 'react';
import type { BreadcrumbLinkProps } from './Breadcrumbs.types';
import { useBreadcrumbs } from './BreadcrumbsContext';

/**
 * Interactive anchor link or current-page indicator inside a BreadcrumbItem.
 * When `isCurrentPage` is true, renders as `<span>` to prevent self-navigation.
 *
 * ### AI Context & Architecture
 * - Tier: Atoms, Stack: ActionMotion (press), Radix Slot (asChild)
 * ### Design Tokens
 * - color: text.secondary → text.primary on hover; transition: fast
 * ### Variant Logic
 *   - Default (`isCurrentPage=false`): Full interactive anchor with hover underline.
 *   - Current (`isCurrentPage=true`): Renders as non-interactive `<span>`, preventing semantic
 *     self-navigation. ActionMotion is disabled.
 * @example
 * ```tsx
 * // Navigation link
 * <BreadcrumbLink href="/docs">Documentation</BreadcrumbLink>
 *
 * // Current page (no href needed)
 * <BreadcrumbLink isCurrentPage>API Reference</BreadcrumbLink>
 *
 * // asChild — delegate to Next.js Link
 * <BreadcrumbLink asChild><NextLink href="/docs">Docs</NextLink></BreadcrumbLink>
 * ```
 * ### Notes
 * `isCurrentPage` takes priority over `asChild`. When both are set, `isCurrentPage`
 *   wins and the component always renders as a `<span>`.
 * ### Accessibility
 * - Sets `aria-current="page"` and `data-current` on the current page indicator.
 *   Anchor-specific props (`href`, `target`, `rel`) are stripped when rendering as `<span>`.
 * ### AI Usage
 * - Always use inside a `<BreadcrumbItem>`. For router integration, use `asChild`
 *   instead of passing an `href` directly when using Next.js or React Router.
 */
export const BreadcrumbLink = forwardRef<HTMLElement, BreadcrumbLinkProps>((props, ref) => {
  const { children, isCurrentPage, className, asChild, href, target, rel, ...rest } = props;
  const { classes } = useBreadcrumbs();

  // isCurrentPage takes priority over asChild: the <span> swap is a semantic safety guard
  // that prevents self-navigation. Bypassing it via asChild would defeat the purpose.
  const Component = (isCurrentPage ? 'span' : asChild ? Slot : 'a') as ElementType;

  const linkProps = isCurrentPage ? {} : { href, target, rel };

  return (
    <ActionMotion asChild animationType="press" disabled={isCurrentPage}>
      <Component
        ref={ref}
        aria-current={isCurrentPage ? 'page' : undefined}
        className={cx(classes.link, className)}
        data-current={isCurrentPage ? '' : undefined}
        {...linkProps}
        {...rest}
      >
        {children}
      </Component>
    </ActionMotion>
  );
});

BreadcrumbLink.displayName = 'BreadcrumbLink';
