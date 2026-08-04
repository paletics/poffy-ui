import { act, fireEvent, render, renderHook, screen } from '@testing-library/react';
import { createElement, Fragment, StrictMode, useLayoutEffect, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { useControllableState } from './useControllableState';

/**
 * ### Test Strategy: useControllableState
 * - **Focus**: controlled ownership, immediate controlled-to-uncontrolled handoff,
 *   and uncontrolled updates in normal and StrictMode rendering.
 * - **DON'T**: Do not test feature-specific callbacks, validation, or disabled policies.
 */
describe('useControllableState', () => {
  it('keeps the latest controlled value in the render that releases control', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useControllableState({ value, defaultValue: false }),
      { initialProps: { value: true as boolean | undefined } },
    );

    expect(result.current.value).toBe(true);
    rerender({ value: undefined });

    expect(result.current.value).toBe(true);
    expect(result.current.isControlled).toBe(false);
  });

  it('keeps a controlled false value when control is released', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useControllableState({ value, defaultValue: true }),
      { initialProps: { value: false as boolean | undefined } },
    );

    rerender({ value: undefined });

    expect(result.current.value).toBe(false);
  });

  it('does not update controlled state internally', () => {
    const { result } = renderHook(() => useControllableState({ value: false, defaultValue: true }));

    act(() => result.current.setValue(true));

    expect(result.current.value).toBe(false);
  });

  it('updates uncontrolled state and supports updater functions', () => {
    const { result } = renderHook(() => useControllableState({ defaultValue: 1 }));

    act(() => result.current.setValue((current) => current + 1));

    expect(result.current.value).toBe(2);
  });

  it('does not overwrite an update requested from a release layout effect', () => {
    const { result, rerender } = renderHook(
      ({ value, updateOnRelease }) => {
        const state = useControllableState({ value, defaultValue: false });
        const { setValue } = state;

        useLayoutEffect(() => {
          if (value === undefined && updateOnRelease) setValue(false);
        }, [setValue, updateOnRelease, value]);

        return state;
      },
      { initialProps: { value: true as boolean | undefined, updateOnRelease: false } },
    );

    rerender({ value: undefined, updateOnRelease: true });

    expect(result.current.value).toBe(false);
  });

  it('preserves a child layout update that runs before the parent handoff effect', () => {
    const Child = ({
      isReleased,
      setValue,
    }: {
      isReleased: boolean;
      setValue: (value: boolean) => void;
    }) => {
      useLayoutEffect(() => {
        if (isReleased) setValue(false);
      }, [isReleased, setValue]);
      return null;
    };

    const Parent = () => {
      const [controlledValue, setControlledValue] = useState<boolean | undefined>(true);
      const state = useControllableState({ value: controlledValue, defaultValue: true });

      return createElement(
        Fragment,
        null,
        createElement('button', { onClick: () => setControlledValue(undefined) }, 'Release'),
        createElement('output', { 'data-testid': 'controlled-value' }, String(state.value)),
        createElement(Child, {
          isReleased: controlledValue === undefined,
          setValue: state.setValue,
        }),
      );
    };

    render(createElement(Parent));
    fireEvent.click(screen.getByRole('button', { name: 'Release' }));

    expect(screen.getByTestId('controlled-value').textContent).toBe('false');
  });

  it('preserves handoff behavior in StrictMode', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useControllableState({ value, defaultValue: false }),
      {
        initialProps: { value: true as boolean | undefined },
        wrapper: StrictMode,
      },
    );

    rerender({ value: undefined });

    expect(result.current.value).toBe(true);
  });

  it('commits an updated controlled value before an earlier layout effect releases control', () => {
    const { result } = renderHook(() => {
      const [value, setValue] = useState<string | undefined>('A');

      useLayoutEffect(() => {
        if (value === 'B') setValue(undefined);
      }, [value]);

      const state = useControllableState({ value, defaultValue: 'default' });
      return { ...state, updateControlledValue: setValue };
    });

    act(() => result.current.updateControlledValue('B'));

    expect(result.current.value).toBe('B');
    expect(result.current.isControlled).toBe(false);
  });

  it('commits an updated controlled value before layout-effect release in StrictMode', () => {
    const { result } = renderHook(
      () => {
        const [value, setValue] = useState<string | undefined>('A');

        useLayoutEffect(() => {
          if (value === 'B') setValue(undefined);
        }, [value]);

        const state = useControllableState({ value, defaultValue: 'default' });
        return { ...state, updateControlledValue: setValue };
      },
      { wrapper: StrictMode },
    );

    act(() => result.current.updateControlledValue('B'));

    expect(result.current.value).toBe('B');
    expect(result.current.isControlled).toBe(false);
  });

  it('does not schedule state updates for a fresh controlled object on every render', () => {
    const renderSpy = vi.fn();

    const { rerender } = renderHook(() => {
      renderSpy();
      return useControllableState({ value: { id: 'item-1' }, defaultValue: { id: 'default' } });
    });

    expect(renderSpy).toHaveBeenCalledTimes(1);
    rerender();
    expect(renderSpy).toHaveBeenCalledTimes(2);
  });

  it('hands off the exact latest committed controlled reference', () => {
    const { result, rerender } = renderHook(
      ({ controlled }) => {
        const value = { id: 'item-1' };
        return useControllableState({
          value: controlled ? value : undefined,
          defaultValue: { id: 'default' },
        });
      },
      { initialProps: { controlled: true } },
    );

    rerender({ controlled: true });
    const latestControlledValue = result.current.value;

    rerender({ controlled: false });

    expect(result.current.value).toBe(latestControlledValue);
  });
});
