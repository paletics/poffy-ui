import { describe, expect, it } from 'vitest';
import { getMultiSelectKeyboardIntent } from './multi-select';

const baseOptions = {
  canCreateCustomValue: false,
  hasEnabledOption: false,
  hasInputValue: false,
  highlightedIndex: -1,
  isOpen: false,
  key: 'Enter',
  optionCount: 0,
  selectedValueCount: 0,
};

describe('multi-select keyboard intent', () => {
  it('preserves native Enter behavior when no selection action exists', () => {
    expect(getMultiSelectKeyboardIntent(baseOptions)).toBeUndefined();
  });

  it('prioritizes a valid open highlight, then an enabled filtered option', () => {
    expect(
      getMultiSelectKeyboardIntent({
        ...baseOptions,
        highlightedIndex: 0,
        isOpen: true,
        optionCount: 1,
      }),
    ).toBe('select-highlighted');
    expect(
      getMultiSelectKeyboardIntent({
        ...baseOptions,
        hasEnabledOption: true,
        hasInputValue: true,
      }),
    ).toBe('select-first');
  });

  it('creates a valid custom value only after selectable options are exhausted', () => {
    expect(
      getMultiSelectKeyboardIntent({
        ...baseOptions,
        canCreateCustomValue: true,
        hasInputValue: true,
      }),
    ).toBe('create-custom');
  });
});
