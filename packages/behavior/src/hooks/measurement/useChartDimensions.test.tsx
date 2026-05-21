import { act, renderHook } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { useChartDimensions } from './useChartDimensions';

describe('useChartDimensions', () => {
  it('measures the current container and reacts to ResizeObserver updates', () => {
    let resizeCallback: ResizeObserverCallback | undefined;

    class ResizeObserverMock {
      constructor(callback: ResizeObserverCallback) {
        resizeCallback = callback;
      }

      disconnect = vi.fn();
      observe = vi.fn();
      unobserve = vi.fn();
    }

    vi.stubGlobal('ResizeObserver', ResizeObserverMock);

    const ref = createRef<HTMLDivElement>();
    const element = document.createElement('div');
    ref.current = element;
    vi.spyOn(element, 'getBoundingClientRect').mockReturnValue({
      width: 400,
      height: 300,
      x: 0,
      y: 0,
      top: 0,
      right: 400,
      bottom: 300,
      left: 0,
      toJSON: () => ({}),
    });

    const { result } = renderHook(() => useChartDimensions(ref));

    expect(result.current).toEqual({
      width: 400,
      height: 300,
      innerWidth: 320,
      innerHeight: 240,
    });

    vi.spyOn(element, 'getBoundingClientRect').mockReturnValue({
      width: 500,
      height: 320,
      x: 0,
      y: 0,
      top: 0,
      right: 500,
      bottom: 320,
      left: 0,
      toJSON: () => ({}),
    });

    act(() => {
      resizeCallback?.([], {} as ResizeObserver);
    });

    expect(result.current).toEqual({
      width: 500,
      height: 320,
      innerWidth: 420,
      innerHeight: 260,
    });
  });

  it('reattaches when ref.current points to a different node after rerender', () => {
    class ResizeObserverMock {
      constructor(_callback: ResizeObserverCallback) {
        void _callback;
      }

      disconnect = vi.fn();
      observe = vi.fn();
      unobserve = vi.fn();
    }

    vi.stubGlobal('ResizeObserver', ResizeObserverMock);

    const ref = createRef<HTMLDivElement>();
    const first = document.createElement('div');
    const second = document.createElement('div');

    vi.spyOn(first, 'getBoundingClientRect').mockReturnValue({
      width: 300,
      height: 200,
      x: 0,
      y: 0,
      top: 0,
      right: 300,
      bottom: 200,
      left: 0,
      toJSON: () => ({}),
    });
    vi.spyOn(second, 'getBoundingClientRect').mockReturnValue({
      width: 640,
      height: 360,
      x: 0,
      y: 0,
      top: 0,
      right: 640,
      bottom: 360,
      left: 0,
      toJSON: () => ({}),
    });

    ref.current = first;
    const { result, rerender } = renderHook(() => useChartDimensions(ref));
    expect(result.current.width).toBe(300);

    act(() => {
      ref.current = second;
      rerender();
    });

    expect(result.current).toEqual({
      width: 640,
      height: 360,
      innerWidth: 560,
      innerHeight: 300,
    });
  });
});
