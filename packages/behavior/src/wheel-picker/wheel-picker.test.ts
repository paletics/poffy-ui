import { describe, expect, it } from 'vitest';
import {
  getNextWheelPickerOption,
  getWheelPickerSelectedOption,
  normalizeWheelPickerValue,
} from './wheel-picker';

const options = [
  { value: 'a', label: 'A' },
  { value: 'b', label: 'B', disabled: true },
  { value: 'c', label: 'C' },
];

describe('wheel-picker behavior', () => {
  it('normalizes missing column values to the first enabled option', () => {
    expect(
      normalizeWheelPickerValue([{ id: 'letter', label: 'Letter', options }], undefined),
    ).toEqual({ letter: 'a' });
  });

  it('falls back when the selected option is disabled', () => {
    expect(getWheelPickerSelectedOption(options, 'b')).toEqual(options[0]);
  });

  it('moves to the next enabled option and skips disabled values', () => {
    expect(getNextWheelPickerOption(options, 'a', 1)).toEqual(options[2]);
  });

  it('loops by default', () => {
    expect(getNextWheelPickerOption(options, 'c', 1)).toEqual(options[0]);
  });

  it('can clamp at the edge', () => {
    expect(getNextWheelPickerOption(options, 'c', 1, { loop: false })).toEqual(options[2]);
  });
});
