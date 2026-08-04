import { act, renderHook } from '@testing-library/react';
import { useLayoutEffect } from 'react';
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

  it('attaches to an explicit window and becomes inert for null', () => {
    const iframe = document.createElement('iframe');
    document.body.appendChild(iframe);
    const targetWindow = iframe.contentWindow as Window;
    const listener = vi.fn();
    const { rerender } = renderHook(
      ({ target }: { target: Window | null }) =>
        useEventListener('resize', listener, undefined, true, target),
      { initialProps: { target: targetWindow as Window | null } },
    );

    act(() => targetWindow.dispatchEvent(new Event('resize')));
    expect(listener).toHaveBeenCalledTimes(1);
    act(() => window.dispatchEvent(new Event('resize')));
    expect(listener).toHaveBeenCalledTimes(1);

    rerender({ target: null });
    act(() => targetWindow.dispatchEvent(new Event('resize')));
    expect(listener).toHaveBeenCalledTimes(1);
    iframe.remove();
  });

  it('uses the newest listener during layout effects after a rerender', () => {
    const firstListener = vi.fn();
    const nextListener = vi.fn();
    const { rerender } = renderHook(
      ({ listener }) => {
        useEventListener('resize', listener);
        useLayoutEffect(() => {
          window.dispatchEvent(new Event('resize'));
        }, [listener]);
      },
      { initialProps: { listener: firstListener } },
    );

    firstListener.mockClear();
    rerender({ listener: nextListener });

    expect(firstListener).not.toHaveBeenCalled();
    expect(nextListener).toHaveBeenCalledTimes(1);
  });
});
