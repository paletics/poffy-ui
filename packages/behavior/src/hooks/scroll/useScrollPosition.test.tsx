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
});
