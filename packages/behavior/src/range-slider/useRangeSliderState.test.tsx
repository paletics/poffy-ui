import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useRangeSliderState } from './useRangeSliderState';

describe('useRangeSliderState', () => {
  it('owns uncontrolled keyboard changes and commits the last interaction once', () => {
    const onValueChange = vi.fn();
    const onValueCommit = vi.fn();
    const { result } = renderHook(() =>
      useRangeSliderState({
        defaultValue: [20, 80],
        onValueChange,
        onValueCommit,
      }),
    );

    act(() => result.current.applyKeyboardAction('lower', 'increment'));
    expect(result.current.value).toEqual([21, 80]);
    expect(onValueChange).toHaveBeenCalledWith([21, 80], 'lower');

    act(() => {
      result.current.commitInteraction('lower');
      result.current.commitInteraction('lower');
    });
    expect(onValueCommit).toHaveBeenCalledTimes(1);
    expect(onValueCommit).toHaveBeenCalledWith([21, 80], 'lower');
  });

  it('normalizes controlled values without mutating them internally', () => {
    const onValueChange = vi.fn();
    const { result } = renderHook(() =>
      useRangeSliderState({
        max: 10,
        min: 0,
        onValueChange,
        value: [12, -2],
      }),
    );

    expect(result.current.value).toEqual([0, 10]);
    act(() => result.current.moveThumb('lower', 4));
    expect(onValueChange).toHaveBeenCalledWith([4, 10], 'lower');
    expect(result.current.value).toEqual([0, 10]);
  });

  it('cancels a transaction when event-time interaction becomes blocked', () => {
    let blockedNow = false;
    const onValueCommit = vi.fn();
    const { result } = renderHook(() =>
      useRangeSliderState({
        defaultValue: [20, 80],
        isInteractionBlockedNow: () => blockedNow,
        onValueCommit,
      }),
    );

    act(() => result.current.moveThumb('lower', 30));
    blockedNow = true;
    act(() => result.current.commitInteraction('lower'));
    expect(onValueCommit).not.toHaveBeenCalled();
  });

  it('discards a canceled interaction without committing its changed value', () => {
    const onValueCommit = vi.fn();
    const { result } = renderHook(() =>
      useRangeSliderState({
        defaultValue: [20, 80],
        onValueCommit,
      }),
    );

    act(() => result.current.moveThumb('lower', 30));
    act(() => result.current.cancelInteraction());
    act(() => result.current.commitInteraction('lower'));

    expect(result.current.value).toEqual([30, 80]);
    expect(onValueCommit).not.toHaveBeenCalled();
  });

  it('does not clear another thumb transaction from an unrelated commit event', () => {
    const onValueCommit = vi.fn();
    const { result } = renderHook(() =>
      useRangeSliderState({
        defaultValue: [20, 80],
        onValueCommit,
      }),
    );

    act(() => result.current.moveThumb('upper', 90));
    act(() => result.current.commitInteraction('lower'));
    act(() => result.current.commitInteraction('upper'));

    expect(onValueCommit).toHaveBeenCalledOnce();
    expect(onValueCommit).toHaveBeenCalledWith([20, 90], 'upper');
  });

  it('uses the latest default and options on form reset', () => {
    const { result, rerender } = renderHook(
      ({ defaultValue, step }) => useRangeSliderState({ defaultValue, step }),
      { initialProps: { defaultValue: [20, 80] as [number, number], step: 1 } },
    );
    act(() => result.current.moveThumb('lower', 33));
    rerender({ defaultValue: [34, 76], step: 10 });
    act(() => result.current.reset());
    expect(result.current.value).toEqual([30, 80]);
  });
});
