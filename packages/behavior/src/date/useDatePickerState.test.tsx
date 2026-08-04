import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useDatePickerState } from './useDatePickerState';

describe('useDatePickerState', () => {
  it('normalizes invalid values and owns uncontrolled changes', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useDatePickerState({
        defaultValue: new Date(Number.NaN),
        onChange,
      }),
    );
    expect(result.current.value).toBeNull();

    const nextDate = new Date(2026, 6, 30);
    act(() => result.current.commitValue(nextDate));
    expect(result.current.value).toBe(nextDate);
    expect(onChange).toHaveBeenCalledWith(nextDate);
  });

  it('rejects unavailable dates and exposes an orphan controlled selection', () => {
    const controlledValue = new Date(2026, 6, 10);
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useDatePickerState({
        isDateDisabled: (date) => date.getDate() === 10,
        minDate: new Date(2026, 6, 5),
        onChange,
        value: controlledValue,
      }),
    );
    expect(result.current.hasUnavailableSelection).toBe(true);

    act(() => result.current.commitValue(new Date(2026, 6, 4)));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('blocks transitions and resets to the latest default while uncontrolled', () => {
    const { result, rerender } = renderHook(
      ({ blocked, defaultValue }) =>
        useDatePickerState({
          defaultValue,
          interactionBlocked: blocked,
        }),
      {
        initialProps: {
          blocked: true,
          defaultValue: new Date(2026, 6, 1),
        },
      },
    );
    act(() => result.current.commitValue(new Date(2026, 6, 2)));
    expect(result.current.value?.getDate()).toBe(1);

    rerender({ blocked: false, defaultValue: new Date(2026, 6, 3) });
    act(() => {
      result.current.commitValue(new Date(2026, 6, 4));
      result.current.reset();
    });
    expect(result.current.value?.getDate()).toBe(3);
  });
});
