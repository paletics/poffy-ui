import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useRadioGroupState } from './useRadioGroupState';

describe('useRadioGroupState', () => {
  it('updates uncontrolled state', () => {
    const { result } = renderHook(() =>
      useRadioGroupState({
        defaultValue: 'a',
      }),
    );

    expect(result.current.value).toBe('a');

    act(() => {
      result.current.onChange('b');
    });

    expect(result.current.value).toBe('b');
  });

  it('emits changes without mutating controlled state', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useRadioGroupState({
        value: 'a',
        onChange,
      }),
    );

    act(() => {
      result.current.onChange('b');
    });

    expect(result.current.value).toBe('a');
    expect(onChange).toHaveBeenCalledWith('b');
  });

  it('retains the latest controlled value when becoming uncontrolled', () => {
    const { result, rerender } = renderHook(
      ({ value }: { value?: string }) => useRadioGroupState({ value }),
      { initialProps: { value: 'a' } as { value?: string } },
    );

    rerender({ value: 'b' });
    rerender({ value: undefined });

    expect(result.current.value).toBe('b');
  });
});
