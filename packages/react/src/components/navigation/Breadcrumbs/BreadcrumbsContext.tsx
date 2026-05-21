'use client';

import { breadcrumbs } from '@/styled-system/recipes';
import { createContext, ReactNode, useContext } from 'react';

interface BreadcrumbsContextValue {
  /** Slot recipe classes derived from the breadcrumbs recipe. */
  classes: ReturnType<typeof breadcrumbs>;
  /** Separator value passed from the root; `null` in manual mode. */
  separator: ReactNode;
}

/**
 * React context carrying Breadcrumbs separator and class state to child items.
 */
export const BreadcrumbsContext = createContext<BreadcrumbsContextValue | null>(null);

/**
 * Returns the nearest Breadcrumbs context and validates compound component usage.
 */
export const useBreadcrumbs = () => {
  const context = useContext(BreadcrumbsContext);
  if (!context) {
    throw new Error('useBreadcrumbs must be used within a <Breadcrumbs /> component');
  }
  return context;
};
