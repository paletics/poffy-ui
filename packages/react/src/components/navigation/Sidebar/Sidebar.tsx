'use client';

import { cx } from '@/styled-system/css';
import { sidebar } from '@/styled-system/recipes';
import { forwardRef, useMemo } from 'react';
import type { SidebarRootProps } from './Sidebar.types';
import { SidebarContext } from './SidebarContext';

/**
 * A vertical navigation panel providing primary application structure and routes.
 * ### AI Context & Architecture
 * - Tier: Organisms, Stack: Panda CSS (Recipe: sidebar), SidebarContext
 * ### Design Tokens
 * - width/padding: silver-ratio tokens applied to collapsed/expanded states.
 * ### Variant Logic
 * - variant: default=full-width inset, floating=card-style elevated. collapsed=icon-only rail.
 * ### Notes
 * Passes `collapsed` state and `classes` to children via `SidebarContext`.
 * ### Accessibility
 * - Renders as `<aside aria-label="Sidebar navigation">`. Collapsed state must still be keyboard-accessible.
 * ### AI Usage
 * - Use as the primary left-rail navigation for dashboard or admin layouts.
 *
 * @example
 * ```tsx
 * import {
 *   Sidebar,
 *   SidebarContent,
 *   SidebarHeader,
 *   SidebarItem,
 * } from '@poffy-ui/react/navigation';
 *
 * <Sidebar>
 *   <SidebarHeader>Workspace</SidebarHeader>
 *   <SidebarContent>
 *     <SidebarItem href="/dashboard" isActive>Dashboard</SidebarItem>
 *   </SidebarContent>
 * </Sidebar>
 * ```
 */
export const Sidebar = forwardRef<HTMLElement, SidebarRootProps>((props, ref) => {
  const { children, className, appearance, collapsed, variant, ...rest } = props;
  const resolvedAppearance = appearance ?? (variant === 'floating' ? 'soft' : 'soft');
  const ctx = useMemo(
    () => ({
      classes: sidebar({ appearance: resolvedAppearance, collapsed, variant }),
      collapsed: !!collapsed,
    }),
    [resolvedAppearance, collapsed, variant],
  );

  return (
    <SidebarContext.Provider value={ctx}>
      <aside
        ref={ref}
        aria-label="Sidebar navigation"
        className={cx(ctx.classes.root, className)}
        {...rest}
      >
        {children}
      </aside>
    </SidebarContext.Provider>
  );
});

Sidebar.displayName = 'Sidebar';
