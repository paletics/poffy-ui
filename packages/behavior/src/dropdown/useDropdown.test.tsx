import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useDropdown } from './useDropdown';

describe('useDropdown', () => {
  it('opens and closes in uncontrolled mode', () => {
    const { result } = renderHook(() => useDropdown({}));

    expect(result.current.open).toBe(false);
    expect(result.current).not.toHaveProperty('setDisabledIndex');

    act(() => {
      result.current.onOpenChange(true);
    });

    expect(result.current.open).toBe(true);

    act(() => {
      result.current.onOpenChange(false);
    });

    expect(result.current.open).toBe(false);
  });

  it('emits changes in uncontrolled mode', () => {
    const onOpenChange = vi.fn();
    const { result } = renderHook(() => useDropdown({ onOpenChange }));

    act(() => {
      result.current.onOpenChange(true);
      result.current.onOpenChange(false);
    });

    expect(result.current.open).toBe(false);
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('emits changes without mutating controlled open state', () => {
    const onOpenChange = vi.fn();
    const { result } = renderHook(() =>
      useDropdown({
        open: true,
        onOpenChange,
      }),
    );

    act(() => {
      result.current.onOpenChange(false);
    });

    expect(result.current.open).toBe(true);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('retains the latest controlled state when becoming uncontrolled', () => {
    const { result, rerender } = renderHook(
      ({ open }: { open?: boolean }) =>
        useDropdown(open === undefined ? {} : { open, onOpenChange: () => undefined }),
      { initialProps: { open: false } as { open?: boolean } },
    );

    rerender({ open: true });
    rerender({ open: undefined });

    expect(result.current.open).toBe(true);
  });

  it('falls back to uncontrolled initial state for untyped open without a callback', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const { result } = renderHook(() => useDropdown({ open: true } as never));

    act(() => result.current.onOpenChange(false));

    expect(result.current.open).toBe(false);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('falls back to uncontrolled'));
    warn.mockRestore();
  });

  it('replaces element and label refs from one ordered collection snapshot', () => {
    const first = document.createElement('button');
    const second = document.createElement('button');
    const { result } = renderHook(() => useDropdown({}));

    act(() => {
      result.current.reconcileItems([
        { element: second, label: null, disabled: true },
        { element: first, label: 'First', disabled: false },
      ]);
    });

    expect(result.current.listRef.current).toEqual([second, first]);
    expect(result.current.listItemsRef.current).toEqual([null, 'First']);
  });
});
