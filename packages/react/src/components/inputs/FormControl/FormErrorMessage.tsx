'use client';

import { cx } from '@/styled-system/css';
import { formControl } from '@/styled-system/recipes';
import { Slot } from '@radix-ui/react-slot';
import { forwardRef } from 'react';
import type { FormErrorMessageProps } from './FormControl.types';
import { useFormControl } from './useFormControl';

/**
 * Error message component rendered only when the nearest FormControl is invalid.
 *
 * ### AI Context & Architecture
 * - **Tier**: Atoms
 * - **Stack**: Panda CSS (`formControl` slot recipe), Radix Slot, FormControl context
 * - **Props**: PrimitiveProps<'div'>
 *
 * ### Design Tokens
 * - **spacing**: top margin comes from the form control recipe
 * - **color**: error text uses semantic danger tokens
 *
 * ### Accessibility
 * - **Role**: polite live region via `aria-live="polite"`.
 * - **Keyboard**: Not focusable.
 * - **Required**: Pair with an invalid input that references the error id through `aria-errormessage`.
 *
 * @example Standard usage
 * ```tsx
 * <FormControl isInvalid>
 *   <Input />
 *   <FormErrorMessage>Email is required.</FormErrorMessage>
 * </FormControl>
 * ```
 */
export const FormErrorMessage = forwardRef<HTMLDivElement, FormErrorMessageProps>((props, ref) => {
  const { children, className, asChild, ...rest } = props;
  const { isInvalid, errorMessageId } = useFormControl();
  const classes = formControl();
  const Component = asChild ? Slot : 'div';

  if (!isInvalid) return null;

  return (
    <Component
      ref={ref}
      className={cx(classes.errorMessage, className)}
      id={errorMessageId}
      aria-live="polite"
      {...rest}
    >
      {children}
    </Component>
  );
});

FormErrorMessage.displayName = 'FormErrorMessage';
