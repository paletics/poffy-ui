import { act, renderHook } from '@testing-library/react';
import { StrictMode, type ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { useDialogOpenState } from './useDialogOpenState';

describe('useDialogOpenState', () => {
  it('uses defaultOpen and updates uncontrolled state', () => {
    const { result } = renderHook(() => useDialogOpenState({ defaultOpen: true }));

    expect(result.current.open).toBe(true);
    act(() => result.current.onOpenChange(false));
    expect(result.current.open).toBe(false);
  });

  it('keeps controlled state owned by open while notifying changes', () => {
    const onOpenChange = vi.fn();
    const { result } = renderHook(() =>
      useDialogOpenState({ defaultOpen: false, onOpenChange, open: true }),
    );

    act(() => result.current.onOpenChange(false));

    expect(result.current.open).toBe(true);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('hands the latest controlled value to uncontrolled mode on release', () => {
    const { result, rerender } = renderHook(
      ({ open }: { open: boolean | undefined }) => useDialogOpenState({ defaultOpen: false, open }),
      { initialProps: { open: true as boolean | undefined } },
    );

    rerender({ open: undefined });
    expect(result.current.open).toBe(true);
    act(() => result.current.onOpenChange(false));
    expect(result.current.open).toBe(false);
  });

  it('forwards all callback arguments', () => {
    const onOpenChange = vi.fn();
    const { result } = renderHook(() =>
      useDialogOpenState<[Event, string]>({ defaultOpen: false, onOpenChange }),
    );
    const event = new Event('keydown');

    act(() => result.current.onOpenChange(true, event, 'escape-key'));

    expect(onOpenChange).toHaveBeenCalledWith(true, event, 'escape-key');
  });

  it('uses a replacement callback after rerender', () => {
    const first = vi.fn();
    const second = vi.fn();
    const { result, rerender } = renderHook(
      ({ onOpenChange }: { onOpenChange: (open: boolean) => void }) =>
        useDialogOpenState({ defaultOpen: false, onOpenChange }),
      { initialProps: { onOpenChange: first } },
    );

    rerender({ onOpenChange: second });
    act(() => result.current.onOpenChange(true));

    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledOnce();
  });

  it('notifies exactly once in StrictMode', () => {
    const onOpenChange = vi.fn();
    const wrapper = ({ children }: { children: ReactNode }) => <StrictMode>{children}</StrictMode>;
    const { result } = renderHook(() => useDialogOpenState({ defaultOpen: false, onOpenChange }), {
      wrapper,
    });

    act(() => result.current.onOpenChange(true));

    expect(result.current.open).toBe(true);
    expect(onOpenChange).toHaveBeenCalledOnce();
  });
});
