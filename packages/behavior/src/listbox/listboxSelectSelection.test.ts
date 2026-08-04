import { describe, expect, it } from 'vitest';
import {
  getListboxSelectOptionIdentity,
  getListboxSelectOptionIndex,
  reconcileListboxSelectSelection,
} from './listbox-select';
import type { ListboxSelectOptionLike } from './useListboxSelectState.types';

const option = (value: string, label: string, disabled = false): ListboxSelectOptionLike => ({
  disabled,
  label,
  value,
});

describe('listbox select selection identity', () => {
  it('preserves a same-value option with a distinct label across reorder', () => {
    const initial = [option('same', 'First'), option('same', 'Second')];
    const identity = getListboxSelectOptionIdentity(initial, 1);
    const result = reconcileListboxSelectSelection({
      isControlled: false,
      options: [option('other', 'Other'), ...initial],
      selectedIdentity: identity,
      selectedValue: 'same',
    });

    expect(result.selectedIndex).toBe(2);
    expect(result.identityNeedsUpdate).toBe(false);
  });

  it('tracks an exact duplicate by occurrence', () => {
    const options = [option('same', 'Same'), option('same', 'Same'), option('same', 'Same')];
    const identity = getListboxSelectOptionIdentity(options, 1);

    expect(identity).toEqual({ label: 'Same', occurrence: 1, value: 'same' });
    expect(getListboxSelectOptionIndex(options, identity)).toBe(1);
  });

  it('falls back to the first enabled option when an uncontrolled value disappears', () => {
    const result = reconcileListboxSelectSelection({
      isControlled: false,
      options: [option('disabled', 'Disabled', true), option('next', 'Next')],
      selectedIdentity: { label: 'Removed', occurrence: 0, value: 'removed' },
      selectedValue: 'removed',
    });

    expect(result).toMatchObject({
      identityNeedsUpdate: true,
      nextIdentity: { label: 'Next', occurrence: 0, value: 'next' },
      nextValue: 'next',
      selectedIndex: 1,
      valueNeedsUpdate: true,
    });
  });

  it('resolves a controlled duplicate value to its first occurrence', () => {
    const options = [option('same', 'First'), option('same', 'Second')];
    expect(
      reconcileListboxSelectSelection({
        isControlled: true,
        options,
        selectedIdentity: getListboxSelectOptionIdentity(options, 1),
        selectedValue: 'same',
      }).selectedIndex,
    ).toBe(0);
  });
});
