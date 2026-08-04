export interface ResolveFormControlAriaOptions {
  ariaDescribedBy?: string;
  ariaErrorMessage?: string;
  errorMessageIds?: string[];
  helperTextIds?: string[];
  isInvalid?: boolean | string;
}

/**
 * Resolves IDREF attributes shared by fields that participate in FormControl.
 * Explicit consumer attributes intentionally replace, rather than merge with,
 * IDs registered by FormControl.
 */
export const resolveFormControlAria = ({
  ariaDescribedBy,
  ariaErrorMessage,
  errorMessageIds,
  helperTextIds,
  isInvalid,
}: ResolveFormControlAriaOptions) => {
  const describedByIds = [
    ...(helperTextIds ?? []),
    ...(isInvalid ? (errorMessageIds ?? []) : []),
  ].filter(Boolean);
  const registeredDescription = describedByIds.join(' ');
  const registeredErrorMessage = errorMessageIds?.filter(Boolean).join(' ');

  return {
    describedBy:
      ariaDescribedBy ?? (registeredDescription.length > 0 ? registeredDescription : undefined),
    errorMessage:
      ariaErrorMessage ??
      (isInvalid && registeredErrorMessage ? registeredErrorMessage : undefined),
  };
};

/**
 * Determines whether an explicit ARIA invalid value requires FormControl's
 * registered error message to be associated with the field.
 */
export const hasAriaInvalid = (value: AriaAttributes['aria-invalid'] | undefined) =>
  [true, 'true', 'grammar', 'spelling'].includes(value as string | boolean);
import type { AriaAttributes } from 'react';
