'use client';

import { useRadioGroupState } from '@poffy-ui/behavior/radio-group';
import { cx } from '@/styled-system/css';
import { createContext, forwardRef, useContext, useId } from 'react';
import { RadioGroupProps } from './RadioGroup.types';
import { radioGroup } from '@/styled-system/recipes';

interface RadioGroupContextValue {
  name: string;
  value?: string;
  onChange: (value: string) => void;
  size?: RadioGroupProps['size'];
  intent?: RadioGroupProps['intent'];
  disabled?: boolean;
  animated?: boolean;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

/**
 * Hook to access RadioGroup context.
 * Must be used within a RadioGroup component.
 */
export const useRadioGroupContext = () => {
  const context = useContext(RadioGroupContext);
  if (!context) {
    throw new Error('Radio must be used within a RadioGroup');
  }
  return context;
};

/**
 * A controlled/uncontrolled container managing a set of mutually exclusive radio options.
 * Distributes `name`, `value`, `onChange`, `size`, and `disabled` state to child `Radio` atoms
 * via `RadioGroupContext`.
 *
 * ### AI Context & Architecture
 * - **Tier**: Molecules
 * - **Stack**: Panda CSS (`radioGroup` recipe), React Context (`RadioGroupContext`)
 * - **Props**: `RadioGroupProps` (extends `<div>`)
 *
 * ### Design Tokens
 * - **spacing**: gap between radio options → Silver Ratio tokens per `orientation`
 * - **color**: inherits from child `Radio` atoms
 *
 * ### Variant Logic
 * - **orientation="vertical"**: Default. Options stacked in a column.
 * - **orientation="horizontal"**: Options in a row. Use for compact 2-3 option sets.
 *
 * ### Accessibility
 * - **Role**: `radiogroup` (explicit via `role="radiogroup"`)
 * - **Pattern**: WAI-ARIA Radio Group
 * - **Keyboard**: Tab: enter group | Arrow keys: navigate between options
 * - **Required**: Provide `aria-label` or `aria-labelledby` to name the group for screen readers
 *
 * ### AI Usage
 * - **DO**: Use for mutually exclusive form selections. Wrap child `Radio` atoms.
 * - **DON'T**: Do not use for multi-select — use `Checkbox.Group` instead.
 *
 * @example Uncontrolled
 * ```tsx
 * <RadioGroup defaultValue="b" aria-label="Fruit">
 *   <Radio value="a">Apple</Radio>
 *   <Radio value="b">Banana</Radio>
 * </RadioGroup>
 * ```
 *
 * @example Controlled
 * ```tsx
 * <RadioGroup value={value} onChange={setValue} orientation="horizontal">
 *   <Radio value="sm">Small</Radio>
 *   <Radio value="md">Medium</Radio>
 *   <Radio value="lg">Large</Radio>
 * </RadioGroup>
 * ```
 */
export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>((props, ref) => {
  const {
    children,
    name: nameProp,
    value: valueProp,
    defaultValue,
    onChange,
    orientation = 'vertical',
    size,
    intent,
    disabled = false,
    animated = false,
    className,
    ...rest
  } = props;

  const fallbackName = useId();
  const name = nameProp ?? fallbackName;

  const { value, onChange: handleChange } = useRadioGroupState({
    value: valueProp,
    defaultValue,
    onChange,
  });

  const classes = radioGroup({ orientation });

  return (
    <RadioGroupContext.Provider
      value={{ name, value, onChange: handleChange, size, intent, disabled, animated }}
    >
      <div role="radiogroup" ref={ref} className={cx(classes.root, className)} {...rest}>
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
});

RadioGroup.displayName = 'RadioGroup';
