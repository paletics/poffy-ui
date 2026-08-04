import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useMultiSelectInteractionState } from './useMultiSelectInteractionState';

describe('useMultiSelectInteractionState', () => {
  it('rejects disallowed values after custom-value normalization', () => {
    const onValueChange = vi.fn();
    const { result } = renderHook(() =>
      useMultiSelectInteractionState({
        allowCustomValues: true,
        disallowedCustomValues: new Set(['duplicate']),
        getCustomValue: (input) => input.trim().toLowerCase(),
        onValueChange,
        options: [],
        value: [],
      }),
    );

    act(() => result.current.setInputValue(' Duplicate '));

    expect(result.current.canSelectCustomValue).toBe(false);
    expect(result.current.selectCustomValue()).toBe(false);
    expect(onValueChange).not.toHaveBeenCalled();
  });
});
