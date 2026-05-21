/**
 * Shared numeric bounds for number-input behavior helpers.
 *
 * ### Notes
 * Bounds are inclusive. Omit a side to leave it unbounded.
 */
export interface NumberInputBounds {
  min?: number;
  max?: number;
}

/**
 * Input for computing the next stepped number-input value.
 *
 * ### Notes
 * `value` is the current normalized numeric value. `step` should match the
 * public NumberInput `step` prop so button clicks and keyboard increments agree.
 */
export interface StepNumberInputValueOptions extends NumberInputBounds {
  value: number;
  step: number;
}
