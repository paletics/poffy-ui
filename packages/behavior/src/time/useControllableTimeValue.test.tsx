import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useControllableTimeValue } from './useControllableTimeValue';

/**
 * ### Test Strategy: useControllableTimeValue
 *
 * ### Focus
 * - Parses valid values, preserves empty values, and hands the latest controlled state to uncontrolled mode.
 * - Allows updates only when the caller does not control the value.
 *
 * ### DON'T
 * - Do not test formatting, constraints, or UI-specific callbacks.
 */
describe('useControllableTimeValue', () => {
  it('uses fallback parts while preserving that an invalid default has no value', () => {
    const { result } = renderHook(() => useControllableTimeValue({ defaultValue: 'invalid' }));

    expect(result.current).toMatchObject({
      hasValue: false,
      parts: { hour: 0, minute: 0, second: 0 },
    });
  });

  it('keeps the latest controlled value when ownership is released', () => {
    const { result, rerender } = renderHook(({ value }) => useControllableTimeValue({ value }), {
      initialProps: { value: '09:30' as string | null | undefined },
    });

    rerender({ value: null });
    rerender({ value: undefined });

    expect(result.current).toMatchObject({
      hasValue: false,
      parts: { hour: 0, minute: 0, second: 0 },
    });
  });

  it('updates only while uncontrolled', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useControllableTimeValue({ defaultValue: '09:30', value }),
      { initialProps: { value: undefined as string | undefined } },
    );

    act(() => result.current.setParts({ hour: 10, minute: 15, second: 0 }));
    expect(result.current.parts).toEqual({ hour: 10, minute: 15, second: 0 });

    rerender({ value: '14:45' });
    act(() => result.current.setParts({ hour: 11, minute: 0, second: 0 }));
    expect(result.current.parts).toEqual({ hour: 14, minute: 45, second: 0 });
  });
});
