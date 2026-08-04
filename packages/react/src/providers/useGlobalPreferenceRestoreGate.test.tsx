import { act, renderHook } from '@testing-library/react';
import { StrictMode, type ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { useGlobalPreferenceRestoreGate } from './useGlobalPreferenceRestoreGate';

describe('useGlobalPreferenceRestoreGate', () => {
  it('restores once per enabled cycle', () => {
    const firstRestore = vi.fn();
    const secondRestore = vi.fn();
    const { result, rerender } = renderHook(
      ({ enabled, restore }) => useGlobalPreferenceRestoreGate({ enabled, restore }),
      { initialProps: { enabled: false, restore: firstRestore } },
    );

    expect(result.current).toBe(false);
    expect(firstRestore).not.toHaveBeenCalled();

    rerender({ enabled: true, restore: firstRestore });
    expect(result.current).toBe(true);
    expect(firstRestore).toHaveBeenCalledOnce();

    rerender({ enabled: true, restore: secondRestore });
    expect(secondRestore).not.toHaveBeenCalled();

    rerender({ enabled: false, restore: secondRestore });
    expect(result.current).toBe(false);
    rerender({ enabled: true, restore: secondRestore });
    expect(result.current).toBe(true);
    expect(secondRestore).toHaveBeenCalledOnce();
  });

  it('does not restore twice during StrictMode effect replay', () => {
    const restore = vi.fn();
    const wrapper = ({ children }: { children: ReactNode }) => <StrictMode>{children}</StrictMode>;

    const { result } = renderHook(
      () => useGlobalPreferenceRestoreGate({ enabled: true, restore }),
      { wrapper },
    );

    expect(result.current).toBe(true);
    expect(restore).toHaveBeenCalledOnce();
  });

  it('waits for a revision even when restore schedules no state change', () => {
    const restore = vi.fn();
    const { result } = renderHook(() => useGlobalPreferenceRestoreGate({ enabled: true, restore }));

    act(() => undefined);
    expect(result.current).toBe(true);
    expect(restore).toHaveBeenCalledOnce();
  });
});
