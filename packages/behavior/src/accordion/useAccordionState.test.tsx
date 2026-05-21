import { act, renderHook } from '@testing-library/react';
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
});
