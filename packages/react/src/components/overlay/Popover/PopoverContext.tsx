'use client';

import { createContext, useContext } from 'react';
import type { PopoverContextValue } from './Popover.types';

/** Context for Popover internal state. Consume via `usePopoverContext()` — never read directly in components. */
export const PopoverContext = createContext<PopoverContextValue | null>(null);

/**
 * Hook to access the Popover context.
 *
 * ### AI Usage
 * - **DON'T**: Do not call outside a `<Popover />` tree — throws at runtime
 *
 * @throws {Error} `Popover components must be wrapped in <Popover />`
 * @returns `PopoverContextValue`
 */
export const usePopoverContext = (): PopoverContextValue => {
  const context = useContext(PopoverContext);
  if (context == null) {
    throw new Error('Popover components must be wrapped in <Popover />');
  }
  return context;
};
