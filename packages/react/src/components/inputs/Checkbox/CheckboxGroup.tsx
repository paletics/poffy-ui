'use client';

import { forwardRef, useMemo, useState } from 'react';
import { checkboxGroupRecipe } from './CheckboxGroup.recipe';
import { CheckboxGroupProps } from './Checkbox.types';
import { CheckboxGroupContext } from './CheckboxGroupContext';
import { cx } from '@/styled-system/css';

/**
 * Container for managing multiple checkboxes as a group.
 *
 * ### AI Context & Architecture
 * - Tier: Molecules, Stack: Panda CSS (Recipe: checkboxGroup), context provider
 *
 * ### Design Tokens
 * - gap: silver.md
 *
 * ### Accessibility
 * - **Role**: `group`.
 * - **Required**: Provide `aria-label` or `aria-labelledby` when no visible group label exists.
 *
 * ### AI Usage
 * - **DO**: Use when several checkboxes share one conceptual question.
 * - **DON'T**: Use for mutually exclusive choices; use `RadioGroup`.
 *
 * @example Controlled group
 * ```tsx
 * import { Checkbox } from '@poffy-ui/react/inputs';
 *
 * <Checkbox.Group value={selected} onChange={setSelected}>
 *   <Checkbox value="apple">Apple</Checkbox>
 *   <Checkbox value="banana">Banana</Checkbox>
 * </Checkbox.Group>
 * ```
 */
export const CheckboxGroup = forwardRef<HTMLDivElement, CheckboxGroupProps>((props, ref) => {
  const {
    value: controlledValue,
    defaultValue,
    onChange,
    disabled,
    size,
    intent,
    orientation = 'vertical',
    className,
    children,
    ...rest
  } = props;

  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue ?? []);
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : uncontrolledValue;

  const contextValue = useMemo(
    () => ({
      value,
      disabled,
      size,
      intent,
      onItemChange: (itemValue: string, checked: boolean) => {
        const nextValue = checked
          ? Array.from(new Set([...value, itemValue]))
          : value.filter((v) => v !== itemValue);

        if (!isControlled) {
          setUncontrolledValue(nextValue);
        }
        onChange?.(nextValue);
      },
    }),
    [value, disabled, size, intent, isControlled, onChange],
  );

  return (
    <CheckboxGroupContext.Provider value={contextValue}>
      <div
        ref={ref}
        role="group"
        className={cx(checkboxGroupRecipe({ orientation }), className)}
        {...rest}
      >
        {children}
      </div>
    </CheckboxGroupContext.Provider>
  );
});

CheckboxGroup.displayName = 'Checkbox.Group';
