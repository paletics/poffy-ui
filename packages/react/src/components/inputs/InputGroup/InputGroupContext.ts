'use client';

import { createContext, useContext } from 'react';
import type { InputGroupSize } from './InputGroup.types';

/**
 * Shared InputGroup slot presence and sizing state.
 */
interface InputGroupContextValue {
  size: InputGroupSize;
  hasLeftAddon: boolean;
  hasRightAddon: boolean;
  hasLeftElement: boolean;
  hasRightElement: boolean;
}

/**
 * React context carrying InputGroup adornment state to grouped controls.
 */
export const InputGroupContext = createContext<InputGroupContextValue | null>(null);

/**
 * Returns the nearest InputGroup context, or null if not inside an InputGroup.
 */
/**
 * Returns InputGroup context when a control is rendered inside an InputGroup.
 */
export const useInputGroup = (): InputGroupContextValue | null => useContext(InputGroupContext);
