import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useCollapsibleState } from './useCollapsibleState';

describe('useCollapsibleState', () => {
  it('toggles uncontrolled state', () => {
    const { result } = renderHook(() => useCollapsibleState({ defaultOpen: false }));

    act(() => result.current.toggle());

    expect(result.current.open).toBe(true);
  });

  it('reports controlled state without mutating it', () => {
    const handleOpenChange = vi.fn();
    const { result } = renderHook(() =>
      useCollapsibleState({ open: false, onOpenChange: handleOpenChange }),
    );

    act(() => result.current.toggle());

    expect(result.current.open).toBe(false);
    expect(result.current.isControlled).toBe(true);
    expect(handleOpenChange).toHaveBeenCalledWith(true);
  });

  it('does not change or notify when disabled', () => {
    const handleOpenChange = vi.fn();
    const { result } = renderHook(() =>
      useCollapsibleState({ defaultOpen: false, disabled: true, onOpenChange: handleOpenChange }),
    );

    act(() => result.current.setOpen(true));

    expect(result.current.open).toBe(false);
    expect(handleOpenChange).not.toHaveBeenCalled();
  });

  it('applies consecutive uncontrolled toggles in one batch', () => {
    const { result } = renderHook(() => useCollapsibleState({ defaultOpen: false }));

    act(() => {
      result.current.toggle();
      result.current.toggle();
    });

    expect(result.current.open).toBe(false);
  });

  it('keeps the last controlled value when becoming uncontrolled', () => {
    const { result, rerender } = renderHook(
      ({ open }: { open?: boolean }) => useCollapsibleState({ open, defaultOpen: false } as never),
      { initialProps: { open: true } as { open?: boolean } },
    );

    rerender({ open: undefined });
    expect(result.current.open).toBe(true);
  });

  it('uses open with a non-function callback as uncontrolled state and warns', () => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const { result } = renderHook(() =>
      useCollapsibleState({
        open: true,
        defaultOpen: false,
        onOpenChange: 'not-a-function',
      } as never),
    );

    act(() => result.current.toggle());

    expect(result.current.open).toBe(false);
    expect(result.current.isControlled).toBe(false);
    expect(warning).toHaveBeenCalledWith(expect.stringContaining('falls back to uncontrolled'));
    warning.mockRestore();
  });

  it('requires both open and a callback before entering controlled mode', () => {
    const onOpenChange = vi.fn();
    const { result, rerender } = renderHook(
      ({ open, callback }: { open?: boolean; callback?: (open: boolean) => void }) =>
        useCollapsibleState({ open, onOpenChange: callback } as never),
      {
        initialProps: { open: undefined, callback: onOpenChange } as {
          open?: boolean;
          callback?: (open: boolean) => void;
        },
      },
    );

    act(() => result.current.toggle());
    expect(result.current.open).toBe(true);
    expect(onOpenChange).toHaveBeenCalledWith(true);

    rerender({ open: false, callback: onOpenChange });
    expect(result.current.open).toBe(false);
    expect(result.current.isControlled).toBe(true);
  });
});
