'use client';

import { cx } from '@/styled-system/css';
import { formControl } from '@/styled-system/recipes';
import { Slot } from '@radix-ui/react-slot';
import { forwardRef } from 'react';
import type { FormLabelProps } from './FormControl.types';
import { useFormControl } from './useFormControl';

/**
 * Label component wired to the nearest FormControl field id.
 *
 * ### AI Context & Architecture
 * - **Tier**: Atoms
 * - **Stack**: Panda CSS (`formControl` slot recipe), Radix Slot, FormControl context
 * - **Props**: PrimitiveProps<'label'>
 *
 * ### Design Tokens
 * - **spacing**: margin and required indicator spacing come from the form control recipe
 * - **color**: label and required indicator use semantic text and danger tokens
 *
 * ### Accessibility
 * - **Role**: label (implicit)
 * - **Keyboard**: Clicking the label focuses the associated input.
 * - **Required**: Keep label text visible unless an alternate accessible name is provided.
 *
 * @example Standard usage
 * ```tsx
 * <FormControl>
 *   <FormLabel>Email</FormLabel>
 *   <Input />
 * </FormControl>
 * ```
 */
export const FormLabel = forwardRef<HTMLLabelElement, FormLabelProps>((props, ref) => {
  const { children, className, asChild, ...rest } = props;
  const { isRequired, isDisabled, labelId, id } = useFormControl();
  const classes = formControl();
  const Component = asChild ? Slot : 'label';

  return (
    <Component
      ref={ref}
      className={cx(classes.label, className)}
      data-disabled={isDisabled ? '' : undefined}
      htmlFor={asChild ? undefined : (rest.htmlFor ?? id)}
      id={labelId}
      {...rest}
    >
      {children}
      {isRequired && (
        <span className={classes.requiredIndicator} aria-hidden="true">
          *
        </span>
      )}
    </Component>
  );
});

FormLabel.displayName = 'FormLabel';
