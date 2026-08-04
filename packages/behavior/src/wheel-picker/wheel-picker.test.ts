import { describe, expect, it } from 'vitest';
import {
  getDuplicateWheelPickerColumnIds,
  getDuplicateWheelPickerOptionValues,
  getNextWheelPickerOption,
  getWheelPickerSelectedOption,
  isWheelPickerColumnValueComplete,
  normalizeWheelPickerValue,
  getUnambiguousWheelPickerColumns,
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

  it('only completes required columns with an owned enabled non-placeholder value', () => {
    const column = {
      id: 'letter',
      label: 'Letter',
      options: [
        { value: '', label: 'Empty but valid' },
        { value: 'pick', label: 'Pick one', placeholder: true },
        { value: 'disabled', label: 'Disabled', disabled: true },
      ],
    };

    expect(isWheelPickerColumnValueComplete(column, { letter: '' })).toBe(true);
    expect(isWheelPickerColumnValueComplete(column, { letter: 'pick' })).toBe(false);
    expect(isWheelPickerColumnValueComplete(column, { letter: 'disabled' })).toBe(false);
    expect(isWheelPickerColumnValueComplete(column, Object.create({ letter: '' }))).toBe(false);
  });

  it('normalizes prototype-like column ids as own properties', () => {
    const value = normalizeWheelPickerValue(
      [{ id: '__proto__', label: 'Prototype', options: [{ value: 'safe', label: 'Safe' }] }],
      undefined,
    );

    expect(Object.prototype.hasOwnProperty.call(value, '__proto__')).toBe(true);
    expect(Reflect.get(value, '__proto__')).toBe('safe');
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

  it('fails closed for duplicate columns and duplicate option values', () => {
    const columns = [
      { id: 'duplicate-column', label: 'First', options },
      {
        id: 'safe-column',
        label: 'Safe',
        options: [
          { value: 'duplicate-option', label: 'First duplicate' },
          { value: 'unique-option', label: 'Unique' },
          { value: 'duplicate-option', label: 'Second duplicate' },
        ],
      },
      { id: 'duplicate-column', label: 'Second', options },
    ];

    expect(getDuplicateWheelPickerColumnIds(columns)).toEqual(['duplicate-column']);
    expect(getDuplicateWheelPickerOptionValues(columns)).toContainEqual({
      columnId: 'safe-column',
      values: ['duplicate-option'],
    });
    expect(getUnambiguousWheelPickerColumns(columns)).toEqual([
      {
        id: 'safe-column',
        label: 'Safe',
        options: [{ value: 'unique-option', label: 'Unique' }],
      },
    ]);
  });
});
