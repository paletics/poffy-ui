import { act, renderHook } from '@testing-library/react';
import { useLayoutEffect, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { useAccordionState } from './useAccordionState';

describe('useAccordionState', () => {
  it('toggles a single item in uncontrolled mode', () => {
    const { result } = renderHook(() =>
      useAccordionState({
        defaultValue: 'item-1',
      }),
    );

    expect(result.current.currentValue).toEqual(['item-1']);

    act(() => {
      result.current.toggle('item-2');
    });

    expect(result.current.currentValue).toEqual(['item-2']);
  });

  it('supports multiple expanded items', () => {
    const { result } = renderHook(() =>
      useAccordionState({
        multiple: true,
        defaultValue: ['item-1'],
      }),
    );

    act(() => {
      result.current.toggle('item-2');
    });

    expect(result.current.currentValue).toEqual(['item-1', 'item-2']);
  });

  it('applies consecutive uncontrolled toggles against the latest value', () => {
    const { result } = renderHook(() =>
      useAccordionState({
        multiple: true,
        defaultValue: ['item-1'],
      }),
    );

    act(() => {
      result.current.toggle('item-2');
      result.current.toggle('item-3');
    });

    expect(result.current.currentValue).toEqual(['item-1', 'item-2', 'item-3']);
  });

  it('closes an item when it is toggled twice before rerendering', () => {
    const { result } = renderHook(() => useAccordionState({ defaultValue: 'item-1' }));

    act(() => {
      result.current.toggle('item-1');
      result.current.toggle('item-1');
    });

    expect(result.current.currentValue).toEqual(['item-1']);
  });

  it('normalizes array values to one item in single mode', () => {
    const { result: uncontrolled } = renderHook(() =>
      useAccordionState({ defaultValue: ['item-1', 'item-2'] } as never),
    );
    expect(uncontrolled.current.currentValue).toEqual(['item-1']);

    const { result: controlled } = renderHook(() =>
      useAccordionState({
        value: ['item-1', 'item-2'],
        onChange: () => undefined,
      } as never),
    );
    expect(controlled.current.currentValue).toEqual(['item-1']);
  });

  it('normalizes uncontrolled values when multiple mode is disabled at runtime', () => {
    const { result, rerender } = renderHook(
      ({ multiple }) =>
        useAccordionState({ multiple, defaultValue: ['item-1', 'item-2'] } as never),
      { initialProps: { multiple: true } },
    );
    expect(result.current.currentValue).toEqual(['item-1', 'item-2']);

    rerender({ multiple: false });
    expect(result.current.currentValue).toEqual(['item-1']);
  });

  it('emits changes without mutating state in controlled mode', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useAccordionState({
        value: 'item-1',
        onChange,
      }),
    );

    act(() => {
      result.current.toggle('item-2');
    });

    expect(result.current.currentValue).toEqual(['item-1']);
    expect(onChange).toHaveBeenCalledWith('item-2');
  });

  it('retains the last controlled value when becoming uncontrolled', () => {
    const onChange = vi.fn();
    const { result, rerender } = renderHook(
      ({ value }) =>
        useAccordionState(
          value === undefined
            ? {}
            : {
                value,
                onChange,
              },
        ),
      { initialProps: { value: 'item-2' as string | undefined } },
    );
    expect(result.current.currentValue).toEqual(['item-2']);

    rerender({ value: undefined });
    expect(result.current.currentValue).toEqual(['item-2']);
  });

  it('retains the latest controlled value when a layout effect releases control', () => {
    const { result } = renderHook(() => {
      const [value, setValue] = useState<string | undefined>('item-2');
      useLayoutEffect(() => {
        setValue(undefined);
      }, []);

      return useAccordionState(
        value === undefined
          ? {}
          : {
              value,
              onChange: () => undefined,
            },
      );
    });

    expect(result.current.currentValue).toEqual(['item-2']);
  });

  it('retains every controlled value in multiple mode when a layout effect releases control', () => {
    const { result } = renderHook(() => {
      const [value, setValue] = useState<string[] | undefined>(['item-1', 'item-2']);
      useLayoutEffect(() => {
        setValue(undefined);
      }, []);

      return useAccordionState(
        value === undefined
          ? { multiple: true }
          : {
              multiple: true,
              value,
              onChange: () => undefined,
            },
      );
    });

    expect(result.current.currentValue).toEqual(['item-1', 'item-2']);
  });

  it('isolates the controlled handoff snapshot from consumer array mutation', () => {
    const controlledValue = ['item-1', 'item-2'];
    const { result, rerender } = renderHook(
      ({ value }) =>
        useAccordionState(
          value === undefined
            ? { multiple: true }
            : {
                multiple: true,
                value,
                onChange: () => undefined,
              },
        ),
      { initialProps: { value: controlledValue as string[] | undefined } },
    );

    controlledValue.splice(0);
    rerender({ value: undefined });

    expect(result.current.currentValue).toEqual(['item-1', 'item-2']);
  });

  it('emits null when a single item closes', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() => useAccordionState({ defaultValue: 'item-1', onChange }));

    act(() => result.current.toggle('item-1'));

    expect(onChange).toHaveBeenCalledWith(null);
  });

  it('does not revive values hidden by switching from multiple to single mode', () => {
    const { result, rerender } = renderHook(
      ({ multiple }) =>
        useAccordionState({ multiple, defaultValue: ['item-1', 'item-2'] } as never),
      { initialProps: { multiple: true } },
    );

    rerender({ multiple: false });
    expect(result.current.currentValue).toEqual(['item-1']);
    rerender({ multiple: true });
    expect(result.current.currentValue).toEqual(['item-1']);
  });

  it('safely falls back for a value paired with a non-function callback', () => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const { result } = renderHook(() =>
      useAccordionState({
        value: 'item-1',
        defaultValue: 'item-2',
        onChange: 'not-a-function',
      } as never),
    );

    act(() => result.current.toggle('item-2'));

    expect(result.current.currentValue).toEqual(['item-2']);
    expect(warning).toHaveBeenCalledWith(expect.stringContaining('falls back to uncontrolled'));
    warning.mockRestore();
  });
});
