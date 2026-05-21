'use client';

import { createContext, useContext } from 'react';

/**
 * Context value interface for an AccordionItem.
 */
interface AccordionItemContextValue {
  /** The unique value identifying this accordion item. */
  value: string;
  /** Unique ID for synchronizing aria-controls and panel id. */
  contentId: string;
  /** Whether this accordion item is disabled. */
  disabled?: boolean;
}

/**
 * Context for sharing the item's unique value between trigger and content components.
 */
export const AccordionItemContext = createContext<AccordionItemContextValue | undefined>(undefined);

/**
 * Hook to access the AccordionItem context.
 * Must be used within an AccordionItem component.
 *
 * @throws {Error} `useAccordionItem must be used within an AccordionItem component`
 * @returns `{ value, contentId, disabled }`
 *
 * @example
 * ```tsx
 * const { value } = useAccordionItem();
 * ```
 */
export const useAccordionItem = (): AccordionItemContextValue => {
  const context = useContext(AccordionItemContext);

  if (!context) {
    throw new Error('useAccordionItem must be used within an AccordionItem component');
  }

  return context;
};
