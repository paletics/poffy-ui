'use client';

import { createContext, useContext } from 'react';
import type { inputGroup } from '@/styled-system/recipes';
import type { InputGroupSize } from './InputGroup.types';

/**
 * Shared InputGroup slot presence and sizing state.
 */
interface InputGroupContextValue {
  size: InputGroupSize;
  classes: ReturnType<typeof inputGroup>;
  hasStartAddon: boolean;
  hasEndAddon: boolean;
  hasStartElement: boolean;
  hasEndElement: boolean;
}

/**
 * React context carrying InputGroup adornment state to grouped controls.
 */
export const InputGroupContext = createContext<InputGroupContextValue | null>(null);

/**
 * Returns InputGroup context when a control is rendered inside an InputGroup.
 * Returns `null` outside an InputGroup so standalone parts can use their default styling.
 */
export const useInputGroup = (): InputGroupContextValue | null => useContext(InputGroupContext);
