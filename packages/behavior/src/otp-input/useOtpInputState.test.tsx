import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useOtpInputState } from './useOtpInputState';

describe('useOtpInputState', () => {
  it('owns segment changes and emits completion once per incomplete-to-complete transition', () => {
    const onChange = vi.fn();
    const onComplete = vi.fn();
    const { result } = renderHook(() => useOtpInputState({ length: 2, onChange, onComplete }));

    act(() => {
      expect(result.current.applyInput('1', 0)).toBe(1);
    });
    act(() => {
      expect(result.current.applyInput('2', 1)).toBeNull();
    });
    act(() => {
      result.current.applyInput('2', 1);
    });

    expect(result.current.segments).toEqual(['1', '2']);
    expect(onComplete).toHaveBeenCalledOnce();
    expect(onComplete).toHaveBeenCalledWith('12');

    act(() => {
      result.current.handleKeyDown({ index: 1, key: 'Backspace' });
    });
    act(() => {
      result.current.applyInput('3', 1);
    });
    expect(onComplete).toHaveBeenLastCalledWith('13');
    expect(onComplete).toHaveBeenCalledTimes(2);
  });

  it('keeps controlled values authoritative while reporting requested edits', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useOtpInputState({ length: 2, onChange, value: ['1', ''] }),
    );

    act(() => result.current.applyInput('2', 1));

    expect(result.current.segments).toEqual(['1', '']);
    expect(onChange).toHaveBeenCalledWith(['1', '2']);
  });

  it('owns composition buffering and direction-aware keyboard intent', () => {
    const { result } = renderHook(() =>
      useOtpInputState({ defaultValue: ['', ''], isRtl: true, length: 2 }),
    );

    act(() => {
      result.current.beginComposition();
      expect(result.current.applyInput('１', 0)).toBeNull();
      expect(result.current.endComposition('', 0)).toBe(1);
    });

    expect(result.current.segments).toEqual(['1', '']);
    expect(result.current.handleKeyDown({ index: 0, key: 'ArrowLeft' })).toEqual({
      handled: true,
      nextFocusIndex: 1,
    });
    expect(result.current.handleKeyDown({ index: 0, key: 'ArrowRight' })).toEqual({
      handled: true,
      nextFocusIndex: null,
    });
  });

  it('resets to the latest normalized defaults after length changes', () => {
    const { result, rerender } = renderHook(
      ({ defaultValue, length }) => useOtpInputState({ defaultValue, length }),
      { initialProps: { defaultValue: ['1', '2'], length: 2 } },
    );
    act(() => result.current.applyInput('9', 0));
    rerender({ defaultValue: ['３', '4', '5'], length: 3 });
    act(() => result.current.reset());

    expect(result.current.segments).toEqual(['3', '4', '5']);
  });
});
