'use client';

import type { LayoutAnimationType } from '@/components/animations/LayoutTransition';
import { pagination } from '@/styled-system/recipes';
import { createContext, useContext } from 'react';

/**
 * Shared Pagination state and navigation handlers for child page controls.
 */
interface PaginationContextValue {
  /**
   * Generated recipe classes for Pagination slots.
   */
  classes: ReturnType<typeof pagination>;
  /**
   * Instance-scoped shared layout id for the active page indicator.
   */
  indicatorId: string;
  /**
   * Animation preset for the active page indicator.
   */
  indicatorAnimation: LayoutAnimationType;
}

/**
 * React context carrying Pagination state to page item and link parts.
 */
export const PaginationContext = createContext<PaginationContextValue | null>(null);

/**
 * Custom hook to access Pagination context.
 *
 * @throws {Error} `usePagination must be used within a <Pagination /> component`
 * @returns Pagination context value.
 */
export const usePagination = () => {
  const context = useContext(PaginationContext);
  if (!context) {
    throw new Error('usePagination must be used within a <Pagination /> component');
  }
  return context;
};
