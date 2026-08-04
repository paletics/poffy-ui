import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useWindowSize } from './useWindowSize';

describe('useWindowSize', () => {
  it('reads the current viewport and updates on resize', () => {
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      writable: true,
      value: 1200,
    });
    Object.defineProperty(window, 'innerHeight', {
      configurable: true,
      writable: true,
      value: 800,
    });

    const { result } = renderHook(() => useWindowSize());
    expect(result.current).toEqual({ width: 1200, height: 800 });

    act(() => {
      window.innerWidth = 640;
      window.innerHeight = 480;
      window.dispatchEvent(new Event('resize'));
    });

    expect(result.current).toEqual({ width: 640, height: 480 });
  });

  it('tracks an explicit window and resets when the target becomes null', () => {
    const iframe = document.createElement('iframe');
    document.body.appendChild(iframe);
    const targetWindow = iframe.contentWindow as Window;
    Object.defineProperty(targetWindow, 'innerWidth', { configurable: true, value: 720 });
    Object.defineProperty(targetWindow, 'innerHeight', { configurable: true, value: 540 });
    const { result, rerender } = renderHook(
      ({ target }: { target: Window | null }) => useWindowSize(target),
      { initialProps: { target: targetWindow as Window | null } },
    );

    expect(result.current).toEqual({ width: 720, height: 540 });
    rerender({ target: null });
    expect(result.current).toEqual({ width: 0, height: 0 });
    iframe.remove();
  });
});
