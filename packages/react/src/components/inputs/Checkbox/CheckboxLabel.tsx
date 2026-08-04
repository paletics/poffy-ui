'use client';

import { cx } from '@/styled-system/css';
import { checkbox } from '@/styled-system/recipes';
import { forwardRef } from 'react';
import { useCheckbox } from './CheckboxContext';
import { CheckboxLabelProps } from './Checkbox.types';

/**
 * Styled visible text within Checkbox.Root's label container.
 *
 * It inherits the root's visual state but does not create another native label association.
 */
export const CheckboxLabel = forwardRef<HTMLSpanElement, CheckboxLabelProps>((props, ref) => {
  const { className, children, ...rest } = props;
  const { size, intent, error } = useCheckbox();
  const classes = checkbox({ size, intent, error });
  return (
    <span ref={ref} className={cx(classes.label, className)} {...rest}>
      {children}
    </span>
  );
});

CheckboxLabel.displayName = 'Checkbox.Label';
