import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useEventListener } from './useEventListener';

describe('useEventListener', () => {
  it('attaches the listener and cleans it up', () => {
    const listener = vi.fn();
    const addSpy = vi.spyOn(window, 'addEventListener');
    const removeSpy = vi.spyOn(window, 'removeEventListener');
    const { unmount } = renderHook(() => useEventListener('resize', listener));

    expect(addSpy).toHaveBeenCalledWith('resize', expect.any(Function), undefined);

    act(() => {
      window.dispatchEvent(new Event('resize'));
    });

    expect(listener).toHaveBeenCalledTimes(1);

    unmount();

    expect(removeSpy).toHaveBeenCalledWith('resize', expect.any(Function), undefined);
  });

  it('does not attach when shouldAttach is false', () => {
    const listener = vi.fn();
    const addSpy = vi.spyOn(window, 'addEventListener');
    const initialCallCount = addSpy.mock.calls.length;

    renderHook(() => useEventListener('resize', listener, undefined, false));

    expect(addSpy.mock.calls).toHaveLength(initialCallCount);
  });
});
