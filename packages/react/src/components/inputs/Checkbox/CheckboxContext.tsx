'use client';

import { createContext, useContext } from 'react';
import { CheckboxContextValue } from './Checkbox.types';

/** Context for Checkbox internal state. Consume via `useCheckbox()` — never read directly in components. */
export const CheckboxContext = createContext<CheckboxContextValue | null>(null);

export const useCheckbox = () => {
  const context = useContext(CheckboxContext);
  if (!context) {
    throw new Error('Checkbox sub-components must be used within Checkbox.Root');
  }
  return context;
};
