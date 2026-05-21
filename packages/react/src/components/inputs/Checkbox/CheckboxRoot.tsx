'use client';

import { cx } from '@/styled-system/css';
import { checkbox } from '@/styled-system/recipes';
import { forwardRef, useMemo, useState } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { CheckboxRootProps } from './Checkbox.types';
import { CheckboxContext } from './CheckboxContext';
import { useCheckboxGroup } from './CheckboxGroupContext';

/**
 * Root container for the Checkbox component.
 *
 * ### AI Context & Architecture
 * - Tier: Atoms, Stack: Panda CSS, context provider
 *
 * ### Design Tokens
 * - gap: silver.md
 *
 * ### Accessibility
 * - Renders a label wrapper by default so the hidden input and text label share activation.
 * - Use `asChild` only when the child preserves label semantics or explicitly labels the input.
 *
 * ### AI Usage
 * - Internal use only. Managed by Checkbox molecule.
 *
 * @example Compound root
 * ```tsx
 * import { CheckboxRoot } from './CheckboxRoot';
 *
 * <CheckboxRoot value="terms" />
 * ```
 */
export const CheckboxRoot = forwardRef<HTMLLabelElement, CheckboxRootProps>((props, ref) => {
  const group = useCheckboxGroup();
  const {
    size: localSize,
    intent: localIntent,
    error,
    className,
    children,
    indeterminate,
    checked: controlledChecked,
    defaultChecked,
    disabled: localDisabled,
    animated = false,
    value,
    onChange,
    asChild,
    ...rest
  } = props;

  const size = group?.size ?? localSize;
  const intent = group?.intent ?? localIntent;
  const disabled = group?.disabled ?? localDisabled;

  const [uncontrolledChecked, setUncontrolledChecked] = useState(defaultChecked ?? false);

  const isGrouped = group !== null && value !== undefined;
  const isControlled = controlledChecked !== undefined;

  const isChecked = isGrouped
    ? (group.value?.includes(value) ?? false)
    : isControlled
      ? controlledChecked
      : uncontrolledChecked;

  const contextValue = useMemo(
    () => ({
      size,
      intent,
      value,
      error,
      checked: isChecked,
      indeterminate,
      disabled,
      animated,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        if (isGrouped) {
          group.onItemChange(value, e.target.checked);
        } else if (!isControlled) {
          setUncontrolledChecked(e.target.checked);
        }
        onChange?.(e);
      },
    }),
    [
      size,
      intent,
      error,
      isChecked,
      indeterminate,
      disabled,
      animated,
      isGrouped,
      isControlled,
      value,
      group,
      onChange,
    ],
  );

  const classes = checkbox({ size, intent, error });
  const Component = asChild ? Slot : 'label';

  return (
    <CheckboxContext.Provider value={contextValue}>
      <Component
        ref={ref}
        className={cx('group', classes.root, className)}
        data-disabled={disabled ? '' : undefined}
        {...rest}
      >
        {children}
      </Component>
    </CheckboxContext.Provider>
  );
});

CheckboxRoot.displayName = 'Checkbox.Root';
