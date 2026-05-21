'use client';

import { cx } from '@/styled-system/css';
import { forwardRef } from 'react';
import type { BreadcrumbSeparatorProps } from './Breadcrumbs.types';
import { useBreadcrumbs } from './BreadcrumbsContext';

/**
 * Visual separator rendered between BreadcrumbItem elements in manual mode.
 *
 * ### AI Context & Architecture
 * - Tier: Atoms, Stack: Panda CSS (Recipe: breadcrumbs via context).
 *   **For use in manual mode only** — when `<Breadcrumbs separator={null}>` is set.
 *   In auto-injection mode, separators are inserted automatically by the root component;
 *   adding this manually would result in duplicate separators.
 *   Renders as `<li>` so it sits legally inside `<ol>` alongside `<BreadcrumbItem>` elements.
 * ### Design Tokens
 * - color: text.secondary, opacity: 0.6
 * @example
 * ```tsx
 * <Breadcrumbs separator={null}>
 *   <BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink></BreadcrumbItem>
 *   <BreadcrumbSeparator>→</BreadcrumbSeparator>
 *   <BreadcrumbItem><BreadcrumbLink isCurrentPage>Docs</BreadcrumbLink></BreadcrumbItem>
 * </Breadcrumbs>
 * ```
 * ### Accessibility
 * - Renders with `aria-hidden="true"` to keep separator glyphs invisible to screen readers.
 *   Falls back to the parent `separator` prop value from context when no children are provided.
 * ### AI Usage
 * - Only use when `separator={null}` is set on the `<Breadcrumbs>` root.
 *   Do NOT combine with auto-injection mode to avoid duplicate separators.
 */
export const BreadcrumbSeparator = forwardRef<HTMLLIElement, BreadcrumbSeparatorProps>(
  (props, ref) => {
    const { children, className, ...rest } = props;
    const { classes, separator } = useBreadcrumbs();

    return (
      <li ref={ref} aria-hidden="true" className={cx(classes.separator, className)} {...rest}>
        {children ?? separator}
      </li>
    );
  },
);

BreadcrumbSeparator.displayName = 'BreadcrumbSeparator';
