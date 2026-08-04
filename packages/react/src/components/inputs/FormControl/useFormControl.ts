'use client';

import { createContext, useContext } from 'react';

/**
 * Values shared across the FormControl component sub-tree.
 * Allows inputs to respond to validation, disabled, and required states.
 */
interface FormControlContextValue {
  /**
   * Whether the associated field is a native labelable control or a composite group.
   */
  labelTarget?: 'control' | 'group';
  /**
   * Whether the form control is in an invalid state.
   */
  isInvalid?: boolean;
  /**
   * Whether the form control is required.
   */
  isRequired?: boolean;
  /**
   * Whether the form control is disabled.
   */
  isDisabled?: boolean;
  /**
   * Whether the form control is read-only.
   */
  isReadOnly?: boolean;
  /**
   * ID of the associated label.
   */
  labelId?: string;
  /**
   * ID of the associated helper text.
   */
  helperTextIds?: string[];
  /**
   * ID of the associated error message.
   */
  errorMessageIds?: string[];
  /**
   * Base ID shared by associated accessibility attributes.
   */
  id?: string;
  registerHelperText?: (id: string) => () => void;
  registerErrorMessage?: (id: string) => () => void;
}

const FormControlContext = createContext<FormControlContextValue | undefined>(undefined);

/**
 * Provider component for FormControl context.
 * Internal plumbing for FormControl sub-components.
 */
export const FormControlProvider = FormControlContext.Provider;

/**
 * Hook to access FormControl state within sub-components.
 * Returns an empty object if used outside of a FormControlProvider.
 *
 * @returns The current form control context values.
 */
export const useFormControl = () => {
  return useContext(FormControlContext) ?? {};
};
