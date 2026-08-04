import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { getWheelPickerKeyboardAction, useWheelPickerState } from './useWheelPickerState';

const columns = [
  {
    id: 'letter',
    label: 'Letter',
    options: [
      { label: 'A', value: 'a' },
      { disabled: true, label: 'B', value: 'b' },
      { label: 'C', value: 'c' },
    ],
  },
];

describe('useWheelPickerState', () => {
  it('maps supported keyboard input without depending on a DOM event', () => {
    expect(getWheelPickerKeyboardAction({ key: 'ArrowDown' })).toEqual({
      direction: 1,
      type: 'move',
    });
    expect(getWheelPickerKeyboardAction({ key: 'Home' })).toEqual({
      edge: 'first',
      type: 'edge',
    });
    expect(getWheelPickerKeyboardAction({ defaultPrevented: true, key: 'End' })).toBeUndefined();
  });

  it('owns uncontrolled selection and skips disabled options', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useWheelPickerState({ columns, defaultValue: { letter: 'a' }, onChange }),
    );

    act(() => {
      expect(result.current.handleKeyDown({ key: 'ArrowDown' }, 'letter')).toBe(true);
    });

    expect(result.current.selectedValue).toEqual({ letter: 'c' });
    expect(onChange).toHaveBeenCalledWith({ letter: 'c' }, 'letter');
  });

  it('requests controlled changes without mutating the selected value', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useWheelPickerState({ columns, onChange, value: { letter: 'a' } }),
    );

    act(() => result.current.commitValue('letter', 'c'));

    expect(result.current.selectedValue).toEqual({ letter: 'a' });
    expect(onChange).toHaveBeenCalledWith({ letter: 'c' }, 'letter');
  });

  it('checks dynamic interaction blocking at event time', () => {
    let blocked = false;
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useWheelPickerState({
        columns,
        defaultValue: { letter: 'a' },
        isInteractionDisabled: () => blocked,
        onChange,
      }),
    );
    blocked = true;

    act(() => {
      expect(result.current.handleKeyDown({ key: 'End' }, 'letter')).toBe(false);
      result.current.commitValue('letter', 'c');
    });

    expect(result.current.selectedValue).toEqual({ letter: 'a' });
    expect(onChange).not.toHaveBeenCalled();
  });
});
