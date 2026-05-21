'use client';

import { cx } from '@/styled-system/css';
import { breadcrumbs } from '@/styled-system/recipes';
import { Children, forwardRef, Fragment, isValidElement, useMemo } from 'react';
import type { BreadcrumbsRootProps } from './Breadcrumbs.types';
import { BreadcrumbsContext } from './BreadcrumbsContext';

/**
 * Root container for the Breadcrumbs navigation trail. Provides recipe classes and separator
 * state via context; automatically injects separators between `<BreadcrumbItem>` children.
 *
 * ### AI Context & Architecture
 * - Tier: Molecules, Stack: Panda CSS (Recipe: breadcrumbs, defineSlotRecipe),
 *   BreadcrumbsContext. No Radix Slot at root level — the root is always a `<nav>` element.
 * ### Design Tokens
 * - Gap, spacing, and text colors are owned by the breadcrumbs recipe.
 * ### Variant Logic
 *   - `plain` (default): Lightweight trail for embedded page headers.
 *   - `background`: Adds brand.surface fill and border-radius for standalone breadcrumb bars.
 *
 * @example
 * ```tsx
 * import { BreadcrumbItem, BreadcrumbLink, Breadcrumbs } from '@poffy-ui/react/navigation';
 *
 * <Breadcrumbs separator="/">
 *   <BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink></BreadcrumbItem>
 *   <BreadcrumbItem><BreadcrumbLink href="/docs">Docs</BreadcrumbLink></BreadcrumbItem>
 *   <BreadcrumbItem><BreadcrumbLink isCurrentPage>API</BreadcrumbLink></BreadcrumbItem>
 * </Breadcrumbs>
 * ```
 * ### Notes
 * Pass `separator={null}` to disable auto-injection and place `<BreadcrumbSeparator>`
 *   manually between items for per-item separator control.
 * ### Accessibility
 * - Renders as `<nav aria-label="Breadcrumb">` with an `<ol>` list. Separators are
 *   hidden from screen readers via `aria-hidden="true"`.
 * ### AI Usage
 * - Use when the user must understand their hierarchical location within the app.
 *   Prefer `size="sm"` inside compact headers.
 */
export const BreadcrumbsRoot = forwardRef<HTMLElement, BreadcrumbsRootProps>((props, ref) => {
  const { children, separator = '/', className, size, variant, ...rest } = props;
  const classes = useMemo(() => breadcrumbs({ size, variant }), [size, variant]);
  const contextValue = useMemo(() => ({ classes, separator }), [classes, separator]);

  const validChildren = Children.toArray(children).filter(isValidElement);

  return (
    <BreadcrumbsContext.Provider value={contextValue}>
      <nav ref={ref} aria-label="Breadcrumb" className={cx(classes.root, className)} {...rest}>
        <ol className={classes.list}>
          {validChildren.map((child, index) => {
            const isLast = index === validChildren.length - 1;
            return (
              <Fragment key={child.key}>
                {child}
                {!isLast && separator && (
                  <li aria-hidden="true" className={classes.separator}>
                    {separator}
                  </li>
                )}
              </Fragment>
            );
          })}
        </ol>
      </nav>
    </BreadcrumbsContext.Provider>
  );
});

BreadcrumbsRoot.displayName = 'Breadcrumbs.Root';

/**
 * Public Breadcrumbs root alias.
 */
export const Breadcrumbs = BreadcrumbsRoot;
