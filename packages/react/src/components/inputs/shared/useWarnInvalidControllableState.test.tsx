import { renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useWarnInvalidControllableState } from './useWarnInvalidControllableState';

describe('useWarnInvalidControllableState', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('reports a missing controlled handler without changing the supplied value', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    const { result } = renderHook(() => {
      const value = 'owned';
      useWarnInvalidControllableState({
        componentName: 'Example',
        value,
        defaultValue: undefined,
        handler: undefined,
      });
      return value;
    });

    expect(result.current).toBe('owned');
    expect(warn).toHaveBeenCalledOnce();
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('remains read-only'));
  });

  it('reports each invalid pairing once per mounted component', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const props = {
      componentName: 'Example',
      value: 'owned',
      defaultValue: 'initial',
      handler: 'not callable',
    };
    const { rerender } = renderHook(() => useWarnInvalidControllableState(props));

    rerender();

    expect(warn).toHaveBeenCalledTimes(3);
    expect(warn.mock.calls.map(([message]) => message)).toEqual(
      expect.arrayContaining([
        expect.stringContaining('requires a callable change handler'),
        expect.stringContaining('is not callable'),
        expect.stringContaining('both a controlled value and a default value'),
      ]),
    );
  });
});
