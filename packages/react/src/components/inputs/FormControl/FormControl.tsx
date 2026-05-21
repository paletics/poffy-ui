'use client';

import { cx } from '@/styled-system/css';
import { formControl } from '@/styled-system/recipes';
import { forwardRef, useId } from 'react';
import { Slot } from '@radix-ui/react-slot';
import type { FormControlProps } from './FormControl.types';
import { FormControlProvider } from './useFormControl';
import { FormLabel } from './FormLabel';

/**
 * A context-providing wrapper that wires form field IDs and states (`isInvalid`, `isRequired`,
 * `isDisabled`, `isReadOnly`) to child `FormLabel`, `FormHelperText`, and `FormErrorMessage`
 * components via `FormControlContext`.
 *
 * ### AI Context & Architecture
 * - **Tier**: Molecules
 * - **Stack**: Panda CSS (`formControl` recipe), Radix Slot, `FormControlProvider`
 * - **Sub-components**: `FormLabel`, `FormHelperText`, `FormErrorMessage`
 *
 * ### Design Tokens
 * - **spacing**: gap between label / input / helper → Silver Ratio tokens
 * - **color**: `isRequired` indicator → `danger.main`; helper text → `neutral.muted`
 *
 * ### Variant Logic
 * - N/A — layout and spacing are fixed by the recipe.
 *
 * ### Accessibility
 * - **Role**: `group` (explicit)
 * - **Auto-wiring**: `id`, `labelId`, `helperTextId`, `errorMessageId` are generated via `useId`
 *   and propagated through context so each sub-component injects the correct `id`/`aria-*`.
 *
 * @example Basic
 * ```tsx
 * <FormControl>
 *   <FormLabel>Email</FormLabel>
 *   <Input placeholder="you@example.com" />
 *   <FormHelperText>We'll never share your email.</FormHelperText>
 * </FormControl>
 * ```
 *
 * @example Invalid with error message
 * ```tsx
 * <FormControl isInvalid>
 *   <FormLabel>Password</FormLabel>
 *   <Input type="password" />
 *   <FormErrorMessage>Password is required.</FormErrorMessage>
 * </FormControl>
 * ```
 *
 * ### AI Usage
 * - **DO**: Use as the semantic wrapper for one labeled input and its helper/error text.
 * - **DON'T**: Do not wrap unrelated fields in one `FormControl`; each field needs its own context.
 */
export const FormControl = forwardRef<HTMLDivElement, FormControlProps>((props, ref) => {
  const {
    isInvalid,
    isRequired,
    isDisabled,
    isReadOnly,
    label,
    children,
    className,
    asChild,
    id: idProp,
    ...rest
  } = props;

  const generatedId = useId();
  const id = idProp ?? generatedId;
  const labelId = `${id}-label`;
  const helperTextId = `${id}-helper-text`;
  const errorMessageId = `${id}-error-message`;

  const classes = formControl();
  const Component = asChild ? Slot : 'div';

  const context = {
    isInvalid,
    isRequired,
    isDisabled,
    isReadOnly,
    labelId,
    helperTextId,
    errorMessageId,
    id,
  };

  return (
    <FormControlProvider value={context}>
      <Component ref={ref} className={cx(classes.root, className)} role="group" {...rest}>
        {label && <FormLabel>{label}</FormLabel>}
        {children}
      </Component>
    </FormControlProvider>
  );
});

FormControl.displayName = 'FormControl';
