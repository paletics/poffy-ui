import type { NumberInputBounds, StepNumberInputValueOptions } from './number-input.types';

/**
 * Clamps a number-input value into the provided bounds.
 */
export const clampNumberInputValue = (value: number, bounds: NumberInputBounds): number => {
  let result = value;

  if (bounds.min !== undefined) {
    result = Math.max(bounds.min, result);
  }

  if (bounds.max !== undefined) {
    result = Math.min(bounds.max, result);
  }

  return result;
};

/**
 * Returns the next incremented number-input value.
 */
export const incrementNumberInputValue = ({
  value,
  step,
  min,
  max,
}: StepNumberInputValueOptions): number => clampNumberInputValue(value + step, { min, max });

/**
 * Returns the next decremented number-input value.
 */
export const decrementNumberInputValue = ({
  value,
  step,
  min,
  max,
}: StepNumberInputValueOptions): number => clampNumberInputValue(value - step, { min, max });

/**
 * Returns whether the number-input can increment.
 */
export const canIncrementNumberInput = (value: number, bounds: NumberInputBounds): boolean =>
  bounds.max === undefined ? true : value < bounds.max;

/**
 * Returns whether the number-input can decrement.
 */
export const canDecrementNumberInput = (value: number, bounds: NumberInputBounds): boolean =>
  bounds.min === undefined ? true : value > bounds.min;
