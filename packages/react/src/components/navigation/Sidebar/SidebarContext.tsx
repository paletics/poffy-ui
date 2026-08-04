'use client';

import { sidebar } from '@/styled-system/recipes';
import { createContext, useContext } from 'react';


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
