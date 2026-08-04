import { describe, expect, it } from 'vitest';
import {
  canDecrementNumberInput,
  canIncrementNumberInput,
  clampNumberInputValue,
  decrementNumberInputValue,
  getNextNumberInputStepValue,
  getPreviousNumberInputStepValue,
  incrementNumberInputValue,
  normalizeNumberInputBounds,
  normalizeNumberInputStep,
} from './number-input';

describe('number-input behavior helpers', () => {
  it('normalizes reversed or non-finite bounds and invalid steps', () => {
    expect(normalizeNumberInputBounds({ min: 10, max: 5 })).toEqual({ min: 5, max: 10 });
    expect(normalizeNumberInputBounds({ min: Number.NaN, max: Infinity })).toEqual({});
    expect(normalizeNumberInputStep(0)).toBe(1);
    expect(normalizeNumberInputStep(-2)).toBe(1);
    expect(normalizeNumberInputStep(Infinity)).toBe(1);
  });

  it('falls back from non-finite values before clamping', () => {
    expect(clampNumberInputValue(Number.NaN, { min: 2, max: 5 })).toBe(2);
    expect(clampNumberInputValue(Infinity, { max: 5 })).toBe(0);
  });
  it('clamps values into bounds', () => {
    expect(clampNumberInputValue(15, { min: 0, max: 10 })).toBe(10);
    expect(clampNumberInputValue(-1, { min: 0, max: 10 })).toBe(0);
    expect(clampNumberInputValue(5, { min: 0, max: 10 })).toBe(5);
  });

  it('increments and decrements within bounds', () => {
    expect(incrementNumberInputValue({ value: 5, step: 2, min: 0, max: 10 })).toBe(7);
    expect(incrementNumberInputValue({ value: 9, step: 2, min: 0, max: 10 })).toBe(10);
    expect(decrementNumberInputValue({ value: 5, step: 2, min: 0, max: 10 })).toBe(3);
    expect(decrementNumberInputValue({ value: 1, step: 2, min: 0, max: 10 })).toBe(0);
  });

  it('moves off-grid values to the adjacent valid step without exceeding bounds', () => {
    expect(getNextNumberInputStepValue({ value: 2, step: 2, min: 1, max: 5 })).toBe(3);
    expect(getPreviousNumberInputStepValue({ value: 2, step: 2, min: 1, max: 5 })).toBe(1);
    expect(getNextNumberInputStepValue({ value: 4, step: 2, min: 0, max: 5 })).toBe(4);
    expect(getPreviousNumberInputStepValue({ value: 5, step: 2, min: 0, max: 5 })).toBe(4);
  });

  it('normalizes invalid or out-of-range step inputs before returning a value', () => {
    expect(getNextNumberInputStepValue({ value: 10, step: 2, min: 0, max: 5 })).toBe(5);
    expect(getPreviousNumberInputStepValue({ value: -2, step: 2, min: 0, max: 5 })).toBe(0);
    expect(getNextNumberInputStepValue({ value: Number.NaN, step: 1, min: 2, max: 5 })).toBe(3);
  });

  it('keeps decimal step results precise and honors an explicit step base', () => {
    expect(getNextNumberInputStepValue({ value: 0.2, step: 0.1, stepBase: 0.1 })).toBe(0.3);
    expect(getNextNumberInputStepValue({ value: 0.1, step: 0.1, stepBase: 0.05 })).toBe(0.15);
  });

  it('supports finite exponential steps beyond Number#toFixed precision', () => {
    expect(getNextNumberInputStepValue({ value: 0, step: 1e-101 })).toBe(1e-101);
    expect(getPreviousNumberInputStepValue({ value: 0, step: Number.MIN_VALUE })).toBe(
      -Number.MIN_VALUE,
    );
  });

  it('reports whether step actions are available', () => {
    expect(canIncrementNumberInput(5, { max: 10 })).toBe(true);
    expect(canIncrementNumberInput(10, { max: 10 })).toBe(false);
    expect(canDecrementNumberInput(5, { min: 0 })).toBe(true);
    expect(canDecrementNumberInput(0, { min: 0 })).toBe(false);
  });
});
