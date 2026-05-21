import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useDropdown } from './useDropdown';

describe('useDropdown', () => {
  it('opens and closes in uncontrolled mode', () => {
    const { result } = renderHook(() => useDropdown({}));

    expect(result.current.open).toBe(false);

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

  it('tracks disabled indices', () => {
    const { result } = renderHook(() => useDropdown({}));

    act(() => {
      result.current.setDisabledIndex(2, true);
      result.current.setDisabledIndex(1, true);
      result.current.setDisabledIndex(2, true);
    });

    act(() => {
      result.current.setDisabledIndex(1, false);
    });

    act(() => {
      result.current.onOpenChange(true);
      result.current.onOpenChange(false);
    });

    expect(result.current.open).toBe(false);
  });
});
