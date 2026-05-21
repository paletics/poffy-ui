import { describe, expect, it } from 'vitest';
import {
  filterListboxOptions,
  getEnabledListboxIndices,
  getFirstEnabledListboxIndex,
  getLastEnabledListboxIndex,
  getNextEnabledListboxIndex,
  getPreviousEnabledListboxIndex,
} from './listbox';

const options = [
  { label: 'Disabled match', disabled: true },
  { label: 'Display match' },
  { label: 'Other option' },
];

describe('listbox behavior helpers', () => {
  it('filters by label case-insensitively', () => {
    expect(filterListboxOptions(options, 'dis')).toEqual(options.slice(0, 2));
  });

  it('returns enabled indices', () => {
    expect(getEnabledListboxIndices(options)).toEqual([1, 2]);
    expect(getFirstEnabledListboxIndex(options)).toBe(1);
    expect(getLastEnabledListboxIndex(options)).toBe(2);
  });

  it('moves to next and previous enabled indices with edge fallback', () => {
    expect(getNextEnabledListboxIndex(options, -1)).toBe(1);
    expect(getNextEnabledListboxIndex(options, 1)).toBe(2);
    expect(getNextEnabledListboxIndex(options, 2)).toBe(2);
    expect(getPreviousEnabledListboxIndex(options, 2)).toBe(1);
    expect(getPreviousEnabledListboxIndex(options, 1)).toBe(1);
  });
});
