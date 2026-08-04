'use client';

import { cx } from '@/styled-system/css';
import { checkbox } from '@/styled-system/recipes';
import { forwardRef } from 'react';
import { useCheckbox } from './CheckboxContext';
import { CheckboxControlProps } from './Checkbox.types';

/**
 * Decorative visual box for a Checkbox.Root.
 *
 * This span receives the root's size, intent, and error styling but has no input semantics; pair
 * it with Checkbox.Input and normally render Checkbox.Indicator inside it.
 */
export const CheckboxControl = forwardRef<HTMLSpanElement, CheckboxControlProps>((props, ref) => {
  const { className, children, ...rest } = props;
  const { size, intent, error } = useCheckbox();
  const classes = checkbox({ size, intent, error });
  return (
    <span ref={ref} className={cx(classes.control, className)} {...rest}>
      {children}
    </span>
  );
});

CheckboxControl.displayName = 'Checkbox.Control';
