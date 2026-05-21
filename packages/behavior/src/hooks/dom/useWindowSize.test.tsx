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
});
