'use client';

import { createContext, useContext } from 'react';
import { ComboBoxOption } from './ComboBox.types';

/**
 * Generated class names for ComboBox slots.
 */
interface ComboBoxClasses {
  root: string;
  label: string;
  control: string;
  input: string;
  trigger: string;
  content: string;
  item: string;
  itemText: string;
  itemIndicator: string;
}

/**
 * Shared ComboBox state and ids used by the input, trigger, list, and items.
 */
export interface ComboBoxContextValue {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  inputValue: string;
  setInputValue: (value: string) => void;
  highlightedIndex: number;
  setHighlightedIndex: (index: number | ((prev: number) => number)) => void;
  options: ComboBoxOption[];
  filteredOptions: ComboBoxOption[];
  value: string | null | undefined;
  onChange?: (value: string | null) => void;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  tabIndex?: number;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
  ariaErrorMessage?: string;
  size?: 'sm' | 'md' | 'lg';
  inputId: string;
  listId: string;
  classes: ComboBoxClasses;
}

/**
 * React context carrying ComboBox interaction state for compound parts.
 */
export const ComboBoxContext = createContext<ComboBoxContextValue | null>(null);

/**
 * Returns the nearest ComboBox context and validates compound component usage.
 */
export const useComboBoxContext = (): ComboBoxContextValue => {
  const context = useContext(ComboBoxContext);
  if (!context) {
    throw new Error('ComboBox sub-components must be used within a ComboBox');
  }
  return context;
};
