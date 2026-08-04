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

export function useEmptyStateClasses(): EmptyStateClasses {
  const ctx = useContext(EmptyStateContext);
  if (!ctx) throw new Error('EmptyState sub-components must be used within <EmptyState>.');
  return ctx;
}
