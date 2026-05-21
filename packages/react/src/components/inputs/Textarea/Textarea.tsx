'use client';

import { cx } from '@/styled-system/css';
import { textarea } from '@/styled-system/recipes';
import { forwardRef } from 'react';
import { TextareaProps } from './Textarea.types';
import { useFormControl } from '../FormControl/useFormControl';

/**
 * A multi-line text input for long-form content entry.
 * Directly wraps a native `<textarea>` with recipe-driven visual variants.
 * The `ref` is forwarded to the underlying `<textarea>` element.
 *
 * ### AI Context & Architecture
 * - **Tier**: Atoms
 * - **Stack**: Panda CSS (`textarea` recipe)
 * - **Props**: `TextareaProps` (extends `<textarea>`)
 *
 * ### Design Tokens
 * - **spacing**: padding scales with the `size` variant
 * - **color**: focus and error states use semantic intent colors
 * - **radius**: border radius follows the recipe's input shape
 *
 * ### Variant Logic
 * - **variant="outline"**: Default. Bordered — standard usage.
 * - **variant="filled"**: Solid background, no visible border.
 * - **variant="flushed"**: Bottom border only — compact inline forms.
 *
 * ### Accessibility
 * - **Role**: `textbox` (implicit/multiline via `<textarea>`)
 * - **Keyboard**: Tab: focus | Text: type
 * - **Required**: Must receive associated `<label>` or `aria-label`. Set `aria-invalid` via `error` prop.
 *
 * @example Standard usage
 * ```tsx
 * <Textarea placeholder="Add a description..." rows={4} />
 * ```
 *
 * @example Error state
 * ```tsx
 * <Textarea error aria-label="Notes" />
 * ```
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>((props, ref) => {
  const {
    appearance = 'outline',
    variant,
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
  } = props;
  const formControl = useFormControl();

  const isInvalid = error ?? formControl.isInvalid;
  const isDisabled = disabled ?? formControl.isDisabled;
  const isReadOnly = readOnly ?? formControl.isReadOnly;
  const isRequired = required ?? formControl.isRequired;
  const textareaId = id ?? formControl.id;
  const formControlDescribedBy = [
    formControl.helperTextId,
    isInvalid ? formControl.errorMessageId : undefined,
  ]
    .filter(Boolean)
    .join(' ');
  const describedBy =
    ariaDescribedBy ?? (formControlDescribedBy.length > 0 ? formControlDescribedBy : undefined);
  const errorMessage = ariaErrorMessage ?? (isInvalid ? formControl.errorMessageId : undefined);
  const resolvedVariant = variant ?? (appearance === 'soft' ? 'filled' : 'outline');
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
