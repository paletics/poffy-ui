import { describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import {
  getComboBoxKeyboardIntent,
  getDuplicateComboBoxValues,
  getUnambiguousComboBoxOptions,
} from './combobox';
import { useComboBoxState } from './useComboBoxState';

describe('combobox behavior', () => {
  it('fails closed for every option with a duplicate value', () => {
    const options = [
      { label: 'First', value: 'duplicate' },
      { label: 'Unique', value: 'unique' },
      { label: 'Second', value: 'duplicate' },
    ];

    expect(getDuplicateComboBoxValues(options)).toEqual(['duplicate']);
    expect(getUnambiguousComboBoxOptions(options)).toEqual([options[1]]);
  });

  it('only claims Enter when an open list has a highlighted option', () => {
    expect(
      getComboBoxKeyboardIntent({
        highlightedIndex: -1,
        isOpen: false,
        key: 'Enter',
        optionCount: 2,
      }),
    ).toBeUndefined();
    expect(
      getComboBoxKeyboardIntent({
        highlightedIndex: 1,
        isOpen: true,
        key: 'Enter',
        optionCount: 2,
      }),
    ).toBe('select');
  });

  it('maps list navigation and only closes an open popup', () => {
    expect(
      getComboBoxKeyboardIntent({
        highlightedIndex: -1,
        isOpen: false,
        key: 'ArrowDown',
        optionCount: 0,
      }),
    ).toBe('next');
    expect(
      getComboBoxKeyboardIntent({
        highlightedIndex: -1,
        isOpen: false,
        key: 'Escape',
        optionCount: 0,
      }),
    ).toBeUndefined();
  });

  it('keeps selection, filtering, and highlight in one state model', () => {
    const options = [
      { label: 'Alpha', value: 'alpha' },
      { label: 'Beta', value: 'beta' },
    ];
    const { result } = renderHook(() => useComboBoxState({ options }));

    act(() => {
      result.current.setInputValue('be');
      result.current.setIsOpen(true);
    });
    expect(result.current.filteredOptions).toEqual([options[1]]);
    expect(result.current.isOpen).toBe(true);

    act(() => result.current.setHighlightedIndex(result.current.filteredOptions, 0));
    expect(result.current.highlightedIndex).toBe(0);

    act(() => result.current.setSelectedValue('beta'));
    expect(result.current.selectedValue).toBe('beta');
  });

  it('clears an uncontrolled selection when its option disappears', () => {
    const onValueChange = vi.fn();
    const alpha = { label: 'Alpha', value: 'alpha' };
    const { result, rerender } = renderHook(
      ({ options }) =>
        useComboBoxState({
          defaultValue: 'alpha',
          onValueChange,
          options,
        }),
      { initialProps: { options: [alpha] } },
    );

    rerender({ options: [] });

    expect(result.current.selectedValue).toBeNull();
    expect(onValueChange).toHaveBeenCalledWith(null);
  });

  it('notifies a controlled orphan once even when callback identity changes', () => {
    const firstCallback = vi.fn();
    const secondCallback = vi.fn();
    const { rerender } = renderHook(
      ({ onValueChange }) =>
        useComboBoxState({
          onValueChange,
          options: [],
          value: 'missing',
        }),
      { initialProps: { onValueChange: firstCallback } },
    );

    expect(firstCallback).toHaveBeenCalledOnce();
    rerender({ onValueChange: secondCallback });

    expect(firstCallback).toHaveBeenCalledOnce();
    expect(secondCallback).not.toHaveBeenCalled();
  });

  it('defers orphan reconciliation while the collection is incomplete', () => {
    const onValueChange = vi.fn();
    const { result, rerender } = renderHook(
      ({ reconcileSelection }) =>
        useComboBoxState({
          onValueChange,
          options: [],
          reconcileSelection,
          value: 'remote',
        }),
      { initialProps: { reconcileSelection: false } },
    );

    expect(result.current.selectedValue).toBe('remote');
    expect(onValueChange).not.toHaveBeenCalled();

    rerender({ reconcileSelection: true });
    expect(result.current.selectedValue).toBeNull();
    expect(onValueChange).toHaveBeenCalledOnce();
  });

  it('resets uncontrolled text and transient state without changing controlled selection', () => {
    const onInputValueChange = vi.fn();
    const onValueChange = vi.fn();
    const options = [
      { label: 'Alpha', value: 'alpha' },
      { label: 'Beta', value: 'beta' },
    ];
    const { result } = renderHook(() =>
      useComboBoxState({
        onInputValueChange,
        onValueChange,
        options,
        value: 'alpha',
      }),
    );

    act(() => {
      result.current.setInputValue('query');
      result.current.setIsOpen(true);
      result.current.setHighlightedIndex(options, 1);
    });
    onInputValueChange.mockClear();
    onValueChange.mockClear();

    act(() => result.current.reset('beta', 'reset query'));

    expect(result.current.selectedValue).toBe('alpha');
    expect(result.current.inputValue).toBe('reset query');
    expect(result.current.isOpen).toBe(false);
    expect(result.current.highlightedIndex).toBe(-1);
    expect(onInputValueChange).not.toHaveBeenCalled();
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('resets uncontrolled selection without changing controlled text', () => {
    const onInputValueChange = vi.fn();
    const onValueChange = vi.fn();
    const options = [
      { label: 'Alpha', value: 'alpha' },
      { label: 'Beta', value: 'beta' },
    ];
    const { result } = renderHook(() =>
      useComboBoxState({
        defaultValue: 'alpha',
        inputValue: 'external query',
        onInputValueChange,
        onValueChange,
        options,
      }),
    );

    act(() => result.current.setSelectedValue('beta'));
    onInputValueChange.mockClear();
    onValueChange.mockClear();

    act(() => result.current.reset('alpha'));

    expect(result.current.selectedValue).toBe('alpha');
    expect(result.current.inputValue).toBe('external query');
    expect(onInputValueChange).not.toHaveBeenCalled();
    expect(onValueChange).not.toHaveBeenCalled();
  });
});
