'use client';

import { createContext, useContext } from 'react';
import { CheckboxGroupContextValue } from './Checkbox.types';

/** Context for managing a group of Checkboxes. Consume via `useCheckboxGroup()` — never read directly in components. */
export const CheckboxGroupContext = createContext<CheckboxGroupContextValue | null>(null);

/**
 * Custom hook to access CheckboxGroupContext.
 *
 * ### AI Usage
 * - **DO**: Use in `CheckboxRoot` to determine if it's part of a group.
 *
 * @returns `CheckboxGroupContextValue | null` — `null` when not inside a `CheckboxGroup`
 */
export const useCheckboxGroup = () => useContext(CheckboxGroupContext);
