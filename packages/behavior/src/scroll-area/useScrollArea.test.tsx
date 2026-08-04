import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useScrollArea } from './useScrollArea';

describe('useScrollArea', () => {
  it('provides refs, viewport id, and pointer handlers', () => {
    const { result } = renderHook(() => useScrollArea());

    expect(result.current.viewportId).toContain('scroll-area-');
    expect(result.current.viewportRef.current).toBeNull();
    expect(result.current.vScrollbarRef.current).toBeNull();
    expect(result.current.hScrollbarRef.current).toBeNull();
    expect(result.current.vThumbRef.current).toBeNull();
    expect(result.current.hThumbRef.current).toBeNull();
    expect(result.current.getThumbPointerDown('vertical')).toEqual(expect.any(Function));
    expect(result.current.getThumbPointerDown('horizontal')).toEqual(expect.any(Function));
  });

  it('cleans up active drag listeners on unmount', () => {
    const addSpy = vi.spyOn(window, 'addEventListener');
    const removeSpy = vi.spyOn(window, 'removeEventListener');
    const { result, unmount } = renderHook(() => useScrollArea());
    const viewport = document.createElement('div');
    const scrollbar = document.createElement('div');

    Object.defineProperties(viewport, {
      clientHeight: { configurable: true, value: 100 },
      scrollHeight: { configurable: true, value: 400 },
    });
    Object.defineProperty(scrollbar, 'clientHeight', {
      configurable: true,
      value: 100,
    });

    result.current.viewportRef.current = viewport;
    result.current.vScrollbarRef.current = scrollbar;

    act(() => {
      result.current.getThumbPointerDown('vertical')({
        button: 0,
        clientY: 0,
        isPrimary: true,
        pointerId: 1,
        preventDefault: vi.fn(),
      } as unknown as React.PointerEvent<HTMLDivElement>);
    });

    expect(addSpy).toHaveBeenCalledWith('pointermove', expect.any(Function));
    expect(addSpy).toHaveBeenCalledWith('pointerup', expect.any(Function));
    expect(addSpy).toHaveBeenCalledWith('pointercancel', expect.any(Function));

    unmount();

    expect(removeSpy).toHaveBeenCalledWith('pointermove', expect.any(Function));
    expect(removeSpy).toHaveBeenCalledWith('pointerup', expect.any(Function));
    expect(removeSpy).toHaveBeenCalledWith('pointercancel', expect.any(Function));
  });
});
