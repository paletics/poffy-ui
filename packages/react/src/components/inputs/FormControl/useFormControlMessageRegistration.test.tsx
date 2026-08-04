import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useFormControlMessageRegistration } from './useFormControlMessageRegistration';

/**
 * ### Test Strategy: useFormControlMessageRegistration
 * - **Focus**: registration cleanup on ID changes, disable transitions, and unmount.
 * - **DON'T**: Do not test FormControl context state or message DOM rendering.
 */
describe('useFormControlMessageRegistration', () => {
  it('cleans up the previous registration when the ID changes or registration is disabled', () => {
    const removeFirst = vi.fn();
    const removeSecond = vi.fn();
    const register = vi
      .fn<(id: string) => () => void>()
      .mockReturnValueOnce(removeFirst)
      .mockReturnValueOnce(removeSecond);
    const { rerender, unmount } = renderHook(
      ({ id, enabled }) => useFormControlMessageRegistration(register, id, enabled),
      { initialProps: { id: 'helper-one', enabled: true } },
    );

    rerender({ id: 'helper-two', enabled: true });
    expect(removeFirst).toHaveBeenCalledTimes(1);
    expect(register).toHaveBeenLastCalledWith('helper-two');

    rerender({ id: 'helper-two', enabled: false });
    expect(removeSecond).toHaveBeenCalledTimes(1);

    unmount();
    expect(removeSecond).toHaveBeenCalledTimes(1);
  });
});
