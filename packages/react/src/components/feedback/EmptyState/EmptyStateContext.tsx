'use client';

import { emptyState } from '@/styled-system/recipes';
import { createContext, useContext } from 'react';

/**
 * Generated class names for EmptyState slots.
 */
type EmptyStateClasses = ReturnType<typeof emptyState>;

/**
 * React context carrying EmptyState slot classes to nested parts.
 */
export const EmptyStateContext = createContext<EmptyStateClasses | null>(null);

/**
 * ### AI Context & Architecture
 * All EmptyState sub-components depend on this hook to receive the pre-computed
 * recipe classes from the root. This ensures `emptyState()` is called only once
 * (in the root) and the size/variant variants are consistently applied across all slots.
 */
export function useEmptyStateClasses(): EmptyStateClasses {
  const ctx = useContext(EmptyStateContext);
  if (!ctx) throw new Error('EmptyState sub-components must be used within <EmptyState>.');
  return ctx;
}
