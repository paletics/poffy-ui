import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useMousePosition } from './useMousePosition';

describe('useMousePosition', () => {
  it('tracks the latest mousemove position', () => {
    const { result } = renderHook(() => useMousePosition());
    expect(result.current).toEqual({ x: 0, y: 0 });

    act(() => {
      window.dispatchEvent(new MouseEvent('mousemove', { clientX: 128, clientY: 256 }));
    });

    expect(result.current).toEqual({ x: 128, y: 256 });
  });
});
