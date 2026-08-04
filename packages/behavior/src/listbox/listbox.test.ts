import { describe, expect, it } from 'vitest';
import {
  filterListboxOptions,
  getEnabledListboxIndices,
  getFirstEnabledListboxIndex,
  getDuplicateListboxOptionValues,
  getListboxHighlightedIndex,
  getListboxHighlightedValue,
  getLastEnabledListboxIndex,
  getNextEnabledListboxIndex,
  getPreviousEnabledListboxIndex,
  getUnambiguousListboxOptions,
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

  it('uses locale-aware case folding and supports a custom matcher', () => {
    const cities = [
      { label: 'İzmir', value: 'izmir' },
      { label: 'Ankara', value: 'ankara' },
    ];
    expect(filterListboxOptions(cities, 'iz', { locale: 'tr-TR' })).toEqual([cities[0]]);
    expect(
      filterListboxOptions(cities, 'any query', {
        filter: (option) => option.value === 'ankara',
      }),
    ).toEqual([cities[1]]);
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

  it('converts highlight identity against the explicitly supplied collection', () => {
    const valueOptions = [
      { label: 'Alpha', value: 'alpha' },
      { label: 'Beta', value: 'beta' },
    ];
    const filteredOptions = valueOptions.slice(1);

    expect(getListboxHighlightedValue(filteredOptions, 0)).toBe('beta');
    expect(getListboxHighlightedIndex(valueOptions, 'beta')).toBe(1);
    expect(getListboxHighlightedIndex(filteredOptions, 'beta')).toBe(0);
    expect(getListboxHighlightedIndex(filteredOptions, 'alpha')).toBe(-1);
    expect(getListboxHighlightedValue(filteredOptions, -1)).toBeUndefined();
  });

  it('fails closed for every occurrence of a duplicate option value', () => {
    const valueOptions = [
      { label: 'First duplicate', value: 'duplicate' },
      { label: 'Unique', value: 'unique' },
      { label: 'Second duplicate', value: 'duplicate' },
    ];

    expect(getDuplicateListboxOptionValues(valueOptions)).toEqual(['duplicate']);
    expect(getUnambiguousListboxOptions(valueOptions)).toEqual([valueOptions[1]]);
  });
});
