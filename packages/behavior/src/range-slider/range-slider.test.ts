import { describe, expect, it } from 'vitest';
import {
  clampRangeSliderThumb,
  getClosestRangeSliderThumb,
  getNextRangeSliderValue,
  getRangeSliderKeyboardAction,
  getRangeSliderPercent,
  getRangeSliderThumbBounds,
  normalizeRangeSliderValue,
  roundRangeSliderValue,
} from './range-slider';

describe('range-slider behavior helpers', () => {
  it('normalizes values into ordered bounds', () => {
    expect(normalizeRangeSliderValue([90, 10], { min: 0, max: 100 })).toEqual([10, 90]);
    expect(normalizeRangeSliderValue([-10, 120], { min: 0, max: 100 })).toEqual([0, 100]);
  });

  it('rounds values to the configured step', () => {
    expect(roundRangeSliderValue(26, { min: 0, step: 5 })).toBe(25);
    expect(roundRangeSliderValue(0.26, { min: 0, step: 0.1 })).toBe(0.3);
    expect(roundRangeSliderValue(0.00000026, { min: 0, step: 1e-7 })).toBe(0.0000003);
    expect(roundRangeSliderValue(2e-99, { min: 0, step: 1e-99 })).toBe(2e-99);
    expect(roundRangeSliderValue(10, { min: 0, max: 10, step: 3 })).toBe(10);
  });

  it('keeps a non-step-aligned maximum reachable', () => {
    const options = { min: 0, max: 10, step: 3 };
    expect(normalizeRangeSliderValue([0, 10], options)).toEqual([0, 10]);
    expect(clampRangeSliderThumb(100, 'upper', [0, 9], options)).toEqual([0, 10]);
    expect(
      getNextRangeSliderValue({ value: [0, 9], thumb: 'upper', action: 'increment', ...options }),
    ).toEqual([0, 10]);
  });

  it('enforces minimum distance between thumbs', () => {
    expect(
      normalizeRangeSliderValue([40, 42], {
        min: 0,
        max: 100,
        step: 5,
        minStepsBetweenThumbs: 2,
      }),
    ).toEqual([40, 50]);
  });

  it('keeps decimal step gaps aligned with a selected thumb value', () => {
    const options = { min: 0, max: 1, step: 0.1, minStepsBetweenThumbs: 3 };

    expect(normalizeRangeSliderValue([0, 0.3], options)).toEqual([0, 0.3]);
    expect(getRangeSliderThumbBounds('upper', [0, 0.3], options)).toEqual({ min: 0.3, max: 1 });
    expect(clampRangeSliderThumb(0.2, 'upper', [0, 0.3], options)).toEqual([0, 0.3]);
  });

  it('supports exponential steps beyond Number toFixed precision', () => {
    const options = { min: 0, max: 1e-97, step: 1e-99, minStepsBetweenThumbs: 3 };

    expect(normalizeRangeSliderValue([0, 3e-99], options)).toEqual([0, 3e-99]);
    expect(getRangeSliderThumbBounds('upper', [0, 3e-99], options)).toEqual({
      min: 3e-99,
      max: 1e-97,
    });
  });

  it('does not round an exponential minimum gap up by one step', () => {
    const options = { min: 0, max: 1e-18, step: 1e-20, minStepsBetweenThumbs: 7 };

    expect(getRangeSliderThumbBounds('upper', [0, 7e-20], options)).toEqual({
      min: 7e-20,
      max: 1e-18,
    });
  });

  it('does not let large step indexes cross an adjacent thumb bound', () => {
    const options = { min: 0, max: 4e15, step: 1, minStepsBetweenThumbs: 1 };

    expect(getRangeSliderThumbBounds('lower', [0, 3e15], options)).toEqual({
      min: 0,
      max: 2999999999999999,
    });
    expect(clampRangeSliderThumb(4e15, 'lower', [0, 3e15], options)).toEqual([
      2999999999999999, 3e15,
    ]);
  });

  it('falls back safely for non-finite values and thumb-gap settings', () => {
    expect(
      normalizeRangeSliderValue([Number.NaN, 80], {
        min: 0,
        max: 100,
        minStepsBetweenThumbs: Number.NaN,
      }),
    ).toEqual([0, 80]);
    expect(normalizeRangeSliderValue([20, Number.POSITIVE_INFINITY], { min: 0, max: 100 })).toEqual(
      [20, 100],
    );
  });

  it('falls back safely for malformed runtime value tuples', () => {
    expect(
      normalizeRangeSliderValue(null as unknown as [number, number], { min: 0, max: 100 }),
    ).toEqual([0, 100]);
    expect(
      normalizeRangeSliderValue([25] as unknown as [number, number], { min: 0, max: 100 }),
    ).toEqual([25, 100]);
  });

  it('clamps a single thumb without crossing the other thumb', () => {
    expect(clampRangeSliderThumb(80, 'lower', [20, 60], { min: 0, max: 100 })).toEqual([60, 60]);
    expect(clampRangeSliderThumb(10, 'upper', [20, 60], { min: 0, max: 100 })).toEqual([20, 20]);
  });

  it('computes keyboard changes for the active thumb', () => {
    expect(
      getNextRangeSliderValue({
        value: [20, 80],
        thumb: 'lower',
        action: 'increment',
        step: 5,
      }),
    ).toEqual([25, 80]);
    expect(
      getNextRangeSliderValue({
        value: [20, 80],
        thumb: 'upper',
        action: 'largeDecrement',
        step: 5,
      }),
    ).toEqual([20, 30]);
    expect(
      getNextRangeSliderValue({
        value: [20, 80],
        thumb: 'upper',
        action: 'max',
        max: 90,
      }),
    ).toEqual([20, 90]);
  });

  it('maps keyboard actions and only reverses horizontal arrows in RTL', () => {
    expect(getRangeSliderKeyboardAction('ArrowLeft')).toBe('decrement');
    expect(getRangeSliderKeyboardAction('ArrowRight')).toBe('increment');
    expect(getRangeSliderKeyboardAction('ArrowLeft', true)).toBe('increment');
    expect(getRangeSliderKeyboardAction('ArrowRight', true)).toBe('decrement');
    expect(getRangeSliderKeyboardAction('ArrowUp', true)).toBe('increment');
    expect(getRangeSliderKeyboardAction('PageDown', true)).toBe('largeDecrement');
    expect(getRangeSliderKeyboardAction('Home', true)).toBe('min');
    expect(getRangeSliderKeyboardAction('Unidentified', true)).toBeUndefined();
  });

  it('converts values to percentages and finds nearest thumb', () => {
    expect(getRangeSliderPercent(50, { min: 0, max: 200 })).toBe(25);
    expect(getClosestRangeSliderThumb(35, [20, 80])).toBe('lower');
    expect(getClosestRangeSliderThumb(70, [20, 80])).toBe('upper');
  });
});
