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

  it('tracks only the explicit window and resets for null', () => {
    const iframe = document.createElement('iframe');
    document.body.appendChild(iframe);
    const targetWindow = iframe.contentWindow as Window;
    const { result, rerender } = renderHook(
      ({ target }: { target: Window | null }) => useMousePosition(target),
      { initialProps: { target: targetWindow as Window | null } },
    );

    act(() => {
      targetWindow.dispatchEvent(new MouseEvent('mousemove', { clientX: 32, clientY: 64 }));
    });
    expect(result.current).toEqual({ x: 32, y: 64 });
    act(() => window.dispatchEvent(new MouseEvent('mousemove', { clientX: 1, clientY: 2 })));
    expect(result.current).toEqual({ x: 32, y: 64 });

    rerender({ target: null });
    expect(result.current).toEqual({ x: 0, y: 0 });
    iframe.remove();
  });
});
