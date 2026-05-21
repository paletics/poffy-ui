'use client';

import {
  canDecrementNumberInput,
  canIncrementNumberInput,
  clampNumberInputValue,
  decrementNumberInputValue,
  incrementNumberInputValue,
} from '@poffy-ui/behavior/number-input';
import { cx } from '@/styled-system/css';
import { ChevronRightIcon } from '@/components/media/Icon/icons';
import { ButtonPrimitive } from '@/components/inputs/ButtonPrimitive';
import { numberInput } from '@/styled-system/recipes';
import { forwardRef, useId, useState } from 'react';
import type { NumberInputProps } from './NumberInput.types';

/**
 * A numeric input with stepper buttons (increment/decrement) for constrained value entry.
 * Supports both controlled and uncontrolled modes. The stepper buttons are excluded
 * from tab order — the inner `<input>` is the sole keyboard focus target.
 *
 * ### AI Context & Architecture
 * - **Tier**: Molecules
 * - **Stack**: Panda CSS (`numberInput` SlotRecipe: `root` + `field` + `stepperGroup` + `stepperButton`)
 * - **Props**: `NumberInputProps`
 *
 * ### Design Tokens
 * - **sizing/spacing**: stepper height and field padding → Silver Ratio tokens per `size` variant
 * - **color**: focus ring → `brand.main`; error → `danger.main`; disabled → `neutral.muted`
 *
 * ### Variant Logic
 * - Mirrors `Input` variants: **outline** (bordered), **filled** (solid bg), **flushed** (underline only).
 * - `size`: sm / md / lg scales field height and stepper button size proportionally.
 *
 * ### Accessibility
 * - **Role**: `spinbutton` (implicit via `<input type="number">`)
 * - **Keyboard**: Tab: focus field | Arrow Up/Down: increment/decrement | Enter: confirm
 * - **Note**: Stepper buttons use `tabIndex={-1}` intentionally. The field `aria-invalid` reflects `error` prop.
 *
 * @example Basic usage
 * ```tsx
 * <NumberInput min={0} max={100} step={5} defaultValue={50} />
 * ```
 *
 * @example Controlled
 * ```tsx
 * <NumberInput value={qty} onChange={setQty} min={1} max={10} />
 * ```
 */
export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      min,
      max,
      step = 1,
      value: valueProp,
      defaultValue = 0,
      onChange,
      disabled = false,
      readOnly = false,
      error = false,
      size = 'md',
      appearance = 'outline',
      variant,
      name,
      placeholder,
      className,
      id: idProp,
      onBlur,
      ...rest
    },
    ref,
  ) => {
    const generatedId = useId();
    const id = idProp ?? generatedId;

    const isControlled = valueProp !== undefined;
    const [internalValue, setInternalValue] = useState<number>(defaultValue);
    const value = isControlled ? (valueProp as number) : internalValue;
    const [inputValue, setInputValue] = useState(() => String(value));
    const [prevControlledValue, setPrevControlledValue] = useState(() => String(value));

    if (isControlled) {
      const nextControlledValue = String(value);
      if (nextControlledValue !== prevControlledValue) {
        setInputValue(nextControlledValue);
        setPrevControlledValue(nextControlledValue);
      }
    }

    const resolvedVariant = variant ?? (appearance === 'soft' ? 'filled' : 'outline');
    const styles = numberInput({ size, variant: resolvedVariant, error });

    const handleChange = (next: number) => {
      if (isNaN(next)) return;
      const clamped = clampNumberInputValue(next, { min, max });
      setInputValue(String(clamped));
      if (!isControlled) setInternalValue(clamped);
      onChange?.(clamped);
    };

    const increment = () => handleChange(incrementNumberInputValue({ value, step, min, max }));
    const decrement = () => handleChange(decrementNumberInputValue({ value, step, min, max }));

    const canIncrement = !disabled && !readOnly && canIncrementNumberInput(value, { min, max });
    const canDecrement = !disabled && !readOnly && canDecrementNumberInput(value, { min, max });

    return (
      <div className={cx(styles.root, className)} data-disabled={disabled ? '' : undefined}>
        <input
          ref={ref}
          id={id}
          type="number"
          name={name}
          value={inputValue}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          readOnly={readOnly}
          placeholder={placeholder}
          aria-invalid={error ? true : undefined}
          className={styles.field}
          onChange={(event) => {
            const raw = event.target.value;
            if (raw === '') {
              setInputValue('');
              return;
            }
            setInputValue(raw);
            handleChange(Number(raw));
          }}
          onBlur={(event) => {
            if (inputValue === '') {
              setInputValue(String(value));
            }
            onBlur?.(event);
          }}
          {...rest}
        />
        <div className={styles.stepperGroup}>
          <ButtonPrimitive
            className={styles.stepperButton}
            data-direction="up"
            onClick={increment}
            disabled={!canIncrement}
            aria-label="Increment"
            tabIndex={-1}
          >
            <ChevronRightIcon />
          </ButtonPrimitive>
          <ButtonPrimitive
            className={styles.stepperButton}
            data-direction="down"
            onClick={decrement}
            disabled={!canDecrement}
            aria-label="Decrement"
            tabIndex={-1}
          >
            <ChevronRightIcon />
          </ButtonPrimitive>
        </div>
      </div>
    );
  },
);

NumberInput.displayName = 'NumberInput';
