'use client';

import { cx } from '@/styled-system/css';
import { checkbox } from '@/styled-system/recipes';
import { forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { useCheckbox } from './CheckboxContext';
import { CheckboxLabelProps } from './Checkbox.types';

/**
 * Text label for the Checkbox.
 *
 * ### AI Context & Architecture
 * - Tier: Atoms, Stack: Panda CSS
 *
 * ### Design Tokens
 * - typography: silver-ratio scale
 *
 * ### Accessibility
 * - Label text is associated by being rendered inside `CheckboxRoot`'s label wrapper.
 * - Keep visible text concise and do not replace it with an icon-only label.
 *
 * ### AI Usage
 * - Internal use only.
 *
 * @example Compound checkbox label
 * ```tsx
 * import { CheckboxLabel } from './CheckboxLabel';
 *
 * <CheckboxLabel>Accept terms</CheckboxLabel>
 * ```
 */
export const CheckboxLabel = forwardRef<HTMLSpanElement, CheckboxLabelProps>((props, ref) => {
  const { className, children, asChild, ...rest } = props;
  const { size, intent, error } = useCheckbox();
  const classes = checkbox({ size, intent, error });
  const Component = asChild ? Slot : 'span';

  return (
    <Component ref={ref} className={cx(classes.label, className)} {...rest}>
      {children}
    </Component>
  );
});

CheckboxLabel.displayName = 'Checkbox.Label';
