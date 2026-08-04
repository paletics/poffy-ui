import type { NumberInputBounds, StepNumberInputValueOptions } from './number-input.types';

/** Normalizes optional bounds to finite values in ascending order. */
export const normalizeNumberInputBounds = (bounds: NumberInputBounds): NumberInputBounds => {
  const min = Number.isFinite(bounds.min) ? bounds.min : undefined;
  const max = Number.isFinite(bounds.max) ? bounds.max : undefined;
  if (min !== undefined && max !== undefined && min > max) return { min: max, max: min };
  return { min, max };
};

/** Uses a positive finite step, falling back to the native default of 1. */
export const normalizeNumberInputStep = (step: number | undefined): number =>
  Number.isFinite(step) && step !== undefined && step > 0 ? step : 1;

const getDecimalPlaces = (value: number): number => {
  const [coefficient, exponent = '0'] = String(value).toLowerCase().split('e');
  return Math.max(0, (coefficient.split('.')[1]?.length ?? 0) - Number(exponent));
};

const roundSteppedValue = (value: number, step: number, base: number): number => {
  const decimals = Math.max(getDecimalPlaces(step), getDecimalPlaces(base));
  // Number#toFixed accepts at most 100 digits. Very small finite steps are
  // already represented most accurately by the computed floating-point value.
  return decimals <= 100 ? Number(value.toFixed(decimals)) : value;
};

const STEP_GRID_EPSILON = 1e-10;

/**
 * Returns the next strictly greater value on the configured step grid.
 *
 * The current value and bounds are normalized first. Off-grid values advance to the adjacent
 * grid point based at `stepBase` (or `min`, then `0`), and an upper-bound crossing leaves the
 * normalized current value unchanged.
 */
export const getNextNumberInputStepValue = ({
  value,
  step,
  min,
  max,
  stepBase,
}: StepNumberInputValueOptions): number => {
  const bounds = normalizeNumberInputBounds({ min, max });
  const normalizedValue = clampNumberInputValue(value, bounds);
  const resolvedStep = normalizeNumberInputStep(step);
  const base = Number.isFinite(stepBase) ? (stepBase as number) : (bounds.min ?? 0);
  const gridIndex = Math.floor((normalizedValue - base) / resolvedStep + STEP_GRID_EPSILON) + 1;
  const next = roundSteppedValue(base + gridIndex * resolvedStep, resolvedStep, base);
  return next <= (bounds.max ?? Infinity) ? next : normalizedValue;
};

/**
 * Returns the next strictly smaller value on the configured step grid.
 *
 * The current value and bounds are normalized first. Off-grid values retreat to the adjacent
 * grid point based at `stepBase` (or `min`, then `0`), and a lower-bound crossing leaves the
 * normalized current value unchanged.
 */
export const getPreviousNumberInputStepValue = ({
  value,
  step,
  min,
  max,
  stepBase,
}: StepNumberInputValueOptions): number => {
  const bounds = normalizeNumberInputBounds({ min, max });
  const normalizedValue = clampNumberInputValue(value, bounds);
  const resolvedStep = normalizeNumberInputStep(step);
  const base = Number.isFinite(stepBase) ? (stepBase as number) : (bounds.min ?? 0);
  const gridIndex = Math.ceil((normalizedValue - base) / resolvedStep - STEP_GRID_EPSILON) - 1;
  const previous = roundSteppedValue(base + gridIndex * resolvedStep, resolvedStep, base);
  return previous >= (bounds.min ?? -Infinity) ? previous : normalizedValue;
};

/**
 * Clamps a number-input value into normalized inclusive bounds.
 *
 * Reversed or non-finite bounds are normalized. A non-finite value falls back to the lower bound
 * when present, otherwise `0`, before the result is clamped.
 */
export const clampNumberInputValue = (value: number, bounds: NumberInputBounds): number => {
  const normalizedBounds = normalizeNumberInputBounds(bounds);
  let result = Number.isFinite(value) ? value : (normalizedBounds.min ?? 0);

  if (normalizedBounds.min !== undefined) {
    result = Math.max(normalizedBounds.min, result);
  }

  if (normalizedBounds.max !== undefined) {
    result = Math.min(normalizedBounds.max, result);
  }

  return result;
};

/**
 * Adds the normalized step to a value, then clamps it to normalized inclusive bounds.
 *
 * Unlike the step-grid helpers, this preserves an off-grid starting value and does not align it.
 */
export const incrementNumberInputValue = ({
  value,
  step,
  min,
  max,
}: StepNumberInputValueOptions): number =>
  clampNumberInputValue(value + normalizeNumberInputStep(step), { min, max });

/**
 * Subtracts the normalized step from a value, then clamps it to normalized inclusive bounds.
 *
 * Unlike the step-grid helpers, this preserves an off-grid starting value and does not align it.
 */
export const decrementNumberInputValue = ({
  value,
  step,
  min,
  max,
}: StepNumberInputValueOptions): number =>
  clampNumberInputValue(value - normalizeNumberInputStep(step), { min, max });

/**
 * Returns whether a raw increment is possible against the supplied upper bound.
 *
 * This helper performs no bounds normalization; normalize external bounds first when they may be
 * reversed or non-finite.
 */
export const canIncrementNumberInput = (value: number, bounds: NumberInputBounds): boolean =>
  bounds.max === undefined ? true : value < bounds.max;

/**
 * Returns whether a raw decrement is possible against the supplied lower bound.
 *
 * This helper performs no bounds normalization; normalize external bounds first when they may be
 * reversed or non-finite.
 */
export const canDecrementNumberInput = (value: number, bounds: NumberInputBounds): boolean =>
  bounds.min === undefined ? true : value > bounds.min;
