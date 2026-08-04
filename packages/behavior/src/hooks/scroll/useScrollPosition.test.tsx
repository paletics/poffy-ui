import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useScrollPosition } from './useScrollPosition';

describe('useScrollPosition', () => {
  it('tracks window scroll coordinates', () => {
    Object.defineProperty(window, 'scrollX', { configurable: true, writable: true, value: 10 });
    Object.defineProperty(window, 'scrollY', { configurable: true, writable: true, value: 20 });

    const { result } = renderHook(() => useScrollPosition());
    expect(result.current).toEqual({ x: 10, y: 20 });

    act(() => {
      window.scrollX = 45;
      window.scrollY = 90;
      window.dispatchEvent(new Event('scroll'));
    });

    expect(result.current).toEqual({ x: 45, y: 90 });
  });

  it('tracks an explicit window and resets when the target becomes null', () => {
    const iframe = document.createElement('iframe');
    document.body.appendChild(iframe);
    const targetWindow = iframe.contentWindow as Window;
    Object.defineProperty(targetWindow, 'scrollX', {
      configurable: true,
      writable: true,
      value: 12,
    });
    Object.defineProperty(targetWindow, 'scrollY', {
      configurable: true,
      writable: true,
      value: 24,
    });
    const { result, rerender } = renderHook(
      ({ target }: { target: Window | null }) => useScrollPosition(target),
      { initialProps: { target: targetWindow as Window | null } },
    );

    expect(result.current).toEqual({ x: 12, y: 24 });
    act(() => {
      Object.defineProperty(targetWindow, 'scrollX', { configurable: true, value: 48 });
      Object.defineProperty(targetWindow, 'scrollY', { configurable: true, value: 96 });
      targetWindow.dispatchEvent(new Event('scroll'));
    });
    expect(result.current).toEqual({ x: 48, y: 96 });

    rerender({ target: null });
    expect(result.current).toEqual({ x: 0, y: 0 });
    iframe.remove();
  });
});
