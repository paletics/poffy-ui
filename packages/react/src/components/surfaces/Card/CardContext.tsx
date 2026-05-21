'use client';

import { card } from '@/styled-system/recipes';
import { createContext, useContext } from 'react';

/**
 * Context value interface for the Card component.
 */
interface CardContextValue {
  /** Generated Panda CSS recipe classes for all slots. */
  classes: ReturnType<typeof card>;
}

/**
 * Context for sharing card styles with all child sections.
 */
export const CardContext = createContext<CardContextValue | undefined>(undefined);

/**
 * Hook to access the Card context.
 * Must be used within a Card component.
 *
 * @throws {Error} `useCardContext must be used within a Card component`
 * @returns `{ classes }`
 *
 * @example
 * ```tsx
 * const { classes } = useCardContext();
 * return <div className={classes.header}>Card Header</div>;
 * ```
 */
export const useCardContext = (): CardContextValue => {
  const context = useContext(CardContext);

  if (!context) {
    throw new Error('useCardContext must be used within a Card component');
  }

  return context;
};
