'use client';

import { sidebar } from '@/styled-system/recipes';
import { createContext, useContext } from 'react';

/**
 * Value shape for SidebarContext.
 *
 * ### AI Context & Architecture
 * `collapsed` is included alongside recipe classes so that sub-components (e.g.
 * SidebarGroup) can conditionally apply accessibility attributes that depend on
 * the visual state — for example, omitting aria-labelledby when the label is
 * hidden via display:none in the collapsed variant.
 */
interface SidebarContextValue {
  classes: ReturnType<typeof sidebar>;
  collapsed: boolean;
}

/**
 * Context to share generated recipe classes and collapsed state for Sidebar slots.
 */
export const SidebarContext = createContext<SidebarContextValue | null>(null);

/**
 * Custom hook to access Sidebar context.
 *
 * @throws {Error} `useSidebar must be used within a <Sidebar /> component`
 * @returns `{ classes, collapsed }`
 */
export const useSidebar = (): SidebarContextValue => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a <Sidebar /> component');
  }
  return context;
};
