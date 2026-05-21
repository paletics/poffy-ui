'use client';

import { accordion } from '@/styled-system/recipes';
import { createContext, useContext } from 'react';

/**
 * Context value interface for the Accordion component.
 */
interface AccordionContextValue {
  /** Currently open accordion item values. */
  value: string[];
  /** Function to toggle the open/closed state of an item. */
  toggle: (value: string) => void;
  /** Whether multiple items can be open simultaneously. */
  multiple: boolean;
  /** Generated Panda CSS recipe classes for all slots. */
  classes: ReturnType<typeof accordion>;
}

/**
 * Context for sharing Accordion state and styles with child components.
 */
export const AccordionContext = createContext<AccordionContextValue | undefined>(undefined);

/**
 * Hook to access the Accordion context.
 * Must be used within an Accordion component.
 *
 * @throws {Error} `useAccordion must be used within an Accordion component`
 * @returns `{ value, toggle, multiple, classes }`
 *
 * @example
 * ```tsx
 * const { value, toggle, classes } = useAccordion();
 * const isOpen = value.includes(itemValue);
 * ```
 */
export const useAccordion = (): AccordionContextValue => {
  const context = useContext(AccordionContext);

  if (!context) {
    throw new Error('useAccordion must be used within an Accordion component');
  }

  return context;
};
