'use client';

import { createContext, useContext } from 'react';
import { ListRecipeVariants } from './List.types';

/**
 * Shared list variant value used by nested list item parts.
 */
export const ListContext = createContext<{ variant: ListRecipeVariants['variant'] } | null>(null);

/**
 * Returns the nearest List context and validates compound component usage.
 */
export const useListContext = () => {
  const context = useContext(ListContext);
  if (!context) {
    throw new Error('List compound components must be used within List.Root');
  }
  return context;
};
