'use client';

import { createContext, useContext } from 'react';
import { CheckboxContextValue } from './Checkbox.types';

/** Context for Checkbox internal state. Consume via `useCheckbox()` — never read directly in components. */
export const CheckboxContext = createContext<CheckboxContextValue | null>(null);

/**
 * Custom hook to access CheckboxContext.
 *
 * ### AI Usage
 * - **DO**: Use in sub-components to access shared state and variants.
 * - **DON'T**: Do not call outside a `CheckboxRoot` tree — throws at runtime
 *
 * @throws {Error} `Checkbox sub-components must be used within Checkbox.Root`
 * @returns `CheckboxContextValue`
 */
export const useCheckbox = () => {
  const context = useContext(CheckboxContext);
  if (!context) {
    throw new Error('Checkbox sub-components must be used within Checkbox.Root');
  }
  return context;
};
