'use client';

import { cx } from '@/styled-system/css';
import { formControl } from '@/styled-system/recipes';
import { Slot } from '@radix-ui/react-slot';
import { forwardRef } from 'react';
import type { FormHelperTextProps } from './FormControl.types';
import { useFormControl } from './useFormControl';

/**
 * Helper text component wired to the nearest FormControl description id.
 *
 * ### AI Context & Architecture
 * - **Tier**: Atoms
 * - **Stack**: Panda CSS (`formControl` slot recipe), Radix Slot, FormControl context
 * - **Props**: PrimitiveProps<'div'>
 *
 * ### Design Tokens
 * - **spacing**: top margin comes from the form control recipe
 * - **color**: muted helper text uses semantic text tokens
 *
 * ### Accessibility
 * - **Role**: generic text associated through `aria-describedby` on supported inputs.
 * - **Keyboard**: Not focusable.
 * - **Required**: Pair with an input that consumes or manually references the helper id.
 *
 * @example Standard usage
 * ```tsx
 * <FormControl>
 *   <Input />
 *   <FormHelperText>Use your work email.</FormHelperText>
 * </FormControl>
 * ```
 */
export const FormHelperText = forwardRef<HTMLDivElement, FormHelperTextProps>((props, ref) => {
  const { children, className, asChild, ...rest } = props;
  const { helperTextId, isDisabled } = useFormControl();
  const classes = formControl();
  const Component = asChild ? Slot : 'div';

  return (
    <Component
      ref={ref}
      className={cx(classes.helperText, className)}
      id={helperTextId}
      data-disabled={isDisabled ? '' : undefined}
      {...rest}
    >
      {children}
    </Component>
  );
});

FormHelperText.displayName = 'FormHelperText';
