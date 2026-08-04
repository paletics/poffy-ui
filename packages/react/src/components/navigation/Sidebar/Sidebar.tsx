'use client';

import { cx } from '@/styled-system/css';
import { sidebar } from '@/styled-system/recipes';
import { forwardRef, useMemo } from 'react';
import type { SidebarRootProps } from './Sidebar.types';
import { SidebarContext } from './SidebarContext';
import { useOptionalLocale } from '@/providers/LocaleProvider';
import { getSidebarNavigationLabel } from './Sidebar.locales';

/**
 * Renders persistent application navigation in an `aside`. Its collapsed state is shared with child
 * slots and must leave every available destination keyboard accessible.
 */
export const Sidebar = forwardRef<HTMLElement, SidebarRootProps>((props, ref) => {
  const {
    children,
    className,
    appearance,
    collapsed,
    locale: localeProp,
    asChild: _unsupportedAsChild,
    variant: _unsupportedVariant,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    ...rest
  } = props as SidebarRootProps & { asChild?: boolean; variant?: unknown };
  const providerLocale = useOptionalLocale()?.locale;
  const normalizedAriaLabelledBy = ariaLabelledBy?.trim() || undefined;
  const normalizedAriaLabel = ariaLabel?.trim() || undefined;
  const resolvedAriaLabel = normalizedAriaLabelledBy
    ? undefined
    : (normalizedAriaLabel ?? getSidebarNavigationLabel(localeProp ?? providerLocale));
  const resolvedAppearance = appearance ?? 'soft';
  const ctx = useMemo(
    () => ({
      classes: sidebar({ appearance: resolvedAppearance, collapsed }),
      collapsed: !!collapsed,
    }),
    [resolvedAppearance, collapsed],
  );

  return (
    <SidebarContext.Provider value={ctx}>
      <aside
        ref={ref}
        className={cx(ctx.classes.root, className)}
        {...rest}
        aria-labelledby={normalizedAriaLabelledBy}
        aria-label={resolvedAriaLabel}
      >
        {children}
      </aside>
    </SidebarContext.Provider>
  );
});

Sidebar.displayName = 'Sidebar';
