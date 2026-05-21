'use client';

import { cx } from '@/styled-system/css';
import { checkbox } from '@/styled-system/recipes';
import { forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { useCheckbox } from './CheckboxContext';
import { CheckboxControlProps } from './Checkbox.types';

/**
 * The stylized square part of the Checkbox.
 *
 * ### AI Context & Architecture
 * - Tier: Atoms, Stack: Panda CSS
 *
 * ### Design Tokens
 * - size: silver.1 (sm), root.1 (md), silver.2 (lg)
 *
 * ### Accessibility
 * - Decorative control only; the hidden `CheckboxInput` owns checkbox semantics.
 * - Keep this part inside `CheckboxRoot` so visual state follows the input peer.
 *
 * ### AI Usage
 * - Internal use only.
 *
 * @example Compound checkbox control
 * ```tsx
 * import { CheckboxControl } from './CheckboxControl';
 *
 * <CheckboxControl />
 * ```
 */
export const CheckboxControl = forwardRef<HTMLSpanElement, CheckboxControlProps>((props, ref) => {
  const { className, children, asChild, ...rest } = props;
  const { size, intent, error } = useCheckbox();
  const classes = checkbox({ size, intent, error });
  const Component = asChild ? Slot : 'span';

  return (
    <Component ref={ref} className={cx(classes.control, className)} {...rest}>
      {children}
    </Component>
  );
});

CheckboxControl.displayName = 'Checkbox.Control';
