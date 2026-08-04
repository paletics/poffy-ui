'use client';

import { cx } from '@/styled-system/css';
import { textarea } from '@/styled-system/recipes';
import { forwardRef } from 'react';
import { resolveInputVariant } from '@/components/inputs/inputVariant';
import type { TextareaProps } from '@/components/inputs/Textarea/Textarea.types';
import {
  hasAriaInvalid,
  resolveFormControlAria,
} from '@/components/inputs/FormControl/formControlAria';
import { useFormControl } from '@/components/inputs/FormControl/useFormControl';

/**
 * Native multi-line field for long-form content.
 *
 * Direct `disabled`, `readOnly`, `required`, `id`, and `error` values override the nearest
 * `FormControl`. Its resolved invalid state controls `aria-invalid` and whether the field is
 * associated with registered error text; helper text remains associated in either state.
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>((props, ref) => {
  const {
    appearance = 'outline',
    variant: _unsupportedVariant,
    size,
    error,
    disabled,
    readOnly,
    required,
    id,
    className,
    'aria-describedby': ariaDescribedBy,
    'aria-errormessage': ariaErrorMessage,
    'aria-invalid': ariaInvalid,
    ...rest
  } = props as TextareaProps & { variant?: unknown };
  const formControl = useFormControl();

  const isInvalid = error ?? formControl.isInvalid;
  const isDisabled = disabled ?? formControl.isDisabled;
  const isReadOnly = readOnly ?? formControl.isReadOnly;
  const isRequired = required ?? formControl.isRequired;
  const hasExplicitInvalid = hasAriaInvalid(ariaInvalid);
  const shouldAssociateErrorMessage = Boolean(isInvalid || hasExplicitInvalid);
  const textareaId = id ?? formControl.id;
  const { describedBy, errorMessage } = resolveFormControlAria({
    ariaDescribedBy,
    ariaErrorMessage,
    errorMessageIds: formControl.errorMessageIds,
    helperTextIds: formControl.helperTextIds,
    isInvalid: shouldAssociateErrorMessage,
  });
  const resolvedVariant = resolveInputVariant(appearance);
  const recipeClass = textarea({ variant: resolvedVariant, size, error: isInvalid });

  return (
    <textarea
      ref={ref}
      id={textareaId}
      disabled={isDisabled}
      readOnly={isReadOnly}
      required={isRequired}
      className={cx(recipeClass, className)}
      aria-invalid={isInvalid ? true : ariaInvalid}
      aria-describedby={describedBy}
      aria-errormessage={errorMessage}
      {...rest}
    />
  );
});

Textarea.displayName = 'Textarea';
