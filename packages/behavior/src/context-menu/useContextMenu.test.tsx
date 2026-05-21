import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useContextMenu } from './useContextMenu';
import { useContextMenuTrigger } from './useContextMenuTrigger';

describe('context-menu behavior hooks', () => {
  it('tracks trigger state and anchor position', () => {
    const { result } = renderHook(() => useContextMenuTrigger());

    const preventDefault = vi.fn();

    act(() => {
      result.current.onContextMenu({
        preventDefault,
        currentTarget: document.body,
        clientX: 24,
        clientY: 32,
      } as unknown as React.MouseEvent<HTMLElement>);
    });

    expect(preventDefault).toHaveBeenCalled();
    expect(result.current.open).toBe(true);
    expect(result.current.position).toEqual({ x: 24, y: 32 });
    expect(result.current.target).toBe(document.body);
  });

  it('provides floating menu props', () => {
    const onClose = vi.fn();
    const { result } = renderHook(() =>
      useContextMenu({
        open: true,
        onClose,
        position: { x: 10, y: 20 },
        target: document.body,
      }),
    );

    expect(result.current.menuProps.ref).toEqual(expect.any(Function));
    expect(result.current.menuProps.style).toBeTruthy();
  });
});
