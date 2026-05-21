import { describe, expect, it } from 'vitest';
import {
  canDecrementNumberInput,
  canIncrementNumberInput,
  clampNumberInputValue,
  decrementNumberInputValue,
  incrementNumberInputValue,
} from './number-input';

describe('number-input behavior helpers', () => {
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

  it('reports whether step actions are available', () => {
    expect(canIncrementNumberInput(5, { max: 10 })).toBe(true);
    expect(canIncrementNumberInput(10, { max: 10 })).toBe(false);
    expect(canDecrementNumberInput(5, { min: 0 })).toBe(true);
    expect(canDecrementNumberInput(0, { min: 0 })).toBe(false);
  });
});
