import { act, renderHook, waitFor } from '@testing-library/react';
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

  it.each([
    { key: 'ContextMenu', shiftKey: false },
    { key: 'F10', shiftKey: true },
  ])('opens from the $key keyboard invocation', ({ key, shiftKey }) => {
    const { result } = renderHook(() => useContextMenuTrigger());
    const target = document.createElement('button');
    const preventDefault = vi.fn();
    vi.spyOn(target, 'getBoundingClientRect').mockReturnValue({
      x: 12,
      y: 24,
      width: 80,
      height: 32,
      top: 24,
      right: 92,
      bottom: 56,
      left: 12,
      toJSON: () => undefined,
    });

    act(() => {
      result.current.onKeyDown({
        key,
        shiftKey,
        preventDefault,
        currentTarget: target,
      } as unknown as React.KeyboardEvent<HTMLElement>);
    });

    expect(preventDefault).toHaveBeenCalledOnce();
    expect(result.current.open).toBe(true);
    expect(result.current.position).toEqual({ x: 12, y: 56 });
    expect(result.current.target).toBe(target);
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

  it('uses target as the floating reference when coordinates are omitted', async () => {
    const target = document.createElement('button');
    document.body.append(target);
    const getBoundingClientRect = vi.spyOn(target, 'getBoundingClientRect').mockReturnValue({
      x: 12,
      y: 24,
      width: 80,
      height: 32,
      top: 24,
      right: 92,
      bottom: 56,
      left: 12,
      toJSON: () => undefined,
    });
    const { result, unmount } = renderHook(() =>
      useContextMenu({
        open: true,
        onClose: vi.fn(),
        target,
      }),
    );
    const floating = document.createElement('div');

    act(() => result.current.menuProps.ref(floating));

    await waitFor(() => expect(getBoundingClientRect).toHaveBeenCalled());
    unmount();
    target.remove();
  });
});
