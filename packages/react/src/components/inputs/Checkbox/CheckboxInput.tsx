'use client';

import { cx } from '@/styled-system/css';
import { checkbox } from '@/styled-system/recipes';
import { useMergeRefs } from '@poffy-ui/behavior/hooks';
import { forwardRef, useEffect, useRef } from 'react';
import { useCheckbox } from './CheckboxContext';
import { CheckboxInputProps } from './Checkbox.types';

/**
 * Visual-hidden input element for the Checkbox.
 *
 * ### AI Context & Architecture
 * - Tier: Atoms, Stack: Panda CSS, mergeRefs
 *
 * ### Design Tokens
 * - selection: hidden
 *
 * ### Accessibility
 * - **Role**: native checkbox input.
 * - **Keyboard**: Space toggles checked state.
 * - **States**: owns `checked`, `indeterminate`, `disabled`, and `aria-invalid`.
 *
 * ### AI Usage
 * - Internal use only.
 *
 * @example Compound checkbox input
 * ```tsx
 * import { CheckboxInput } from './CheckboxInput';
 *
 * <CheckboxInput />
 * ```
 */
export const CheckboxInput = forwardRef<HTMLInputElement, CheckboxInputProps>((props, ref) => {
  const {
    className,
    asChild: _asChild,
    checked: _checked,
    defaultChecked: _defaultChecked,
    disabled: _disabled,
    onChange: _onChange,
    ...rest
  } = props;
  const { size, intent, error, checked, indeterminate, disabled, onChange, value } = useCheckbox();
  const classes = checkbox({ size, intent, error });

  const inputRef = useRef<HTMLInputElement>(null);
  const mergedRef = useMergeRefs(inputRef, ref);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = !!indeterminate;
    }
  }, [indeterminate]);

  return (
    <input
      ref={mergedRef}
      type="checkbox"
      className={cx('peer', classes.input, className)}
      checked={checked}
      onChange={onChange}
      disabled={disabled}
      value={value}
      aria-invalid={error}
      {...rest}
    />
  );
});

CheckboxInput.displayName = 'Checkbox.Input';
