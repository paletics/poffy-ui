'use client';

import { createContext, useContext } from 'react';
import { CheckboxGroupContextValue } from './Checkbox.types';

/** Context for managing a group of Checkboxes. Consume via `useCheckboxGroup()` — never read directly in components. */
export const CheckboxGroupContext = createContext<CheckboxGroupContextValue | null>(null);

export const useCheckboxGroup = () => useContext(CheckboxGroupContext);
