'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  filterListboxOptions,
  getListboxHighlightedIndex,
  getListboxHighlightedValue,
} from '../listbox';
import type { MultiSelectOptionLike } from './multi-select.types';
import type {
  UseMultiSelectInteractionStateOptions,
  UseMultiSelectInteractionStateReturn,
} from './useMultiSelectInteractionState.types';

/**
 * Owns MultiSelect filtering, highlight, input, and popup state while the caller owns values.
 *
 * Selection and removal request a replacement array through `onValueChange`; callers must reflect
 * it through `value`. Custom values use `getCustomValue` or trimmed input and are unavailable when
 * empty, already selected, explicitly disallowed, or interaction is blocked. Blocked interactions
 * cannot open or change values and close an open popup asynchronously.
 */
export const useMultiSelectInteractionState = <TOption extends MultiSelectOptionLike>({
  allowCustomValues,
  disallowedCustomValues,
  filterOption,
  getCustomValue,
  interactionBlocked = false,
  locale,
  onValueChange,
  options,
  value,
}: UseMultiSelectInteractionStateOptions<TOption>): UseMultiSelectInteractionStateReturn<TOption> => {
  const [requestedOpen, setRequestedOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [highlightedValue, setHighlightedValue] = useState<string>();
  const isOpen = requestedOpen && !interactionBlocked;

  useEffect(() => {
    if (!interactionBlocked) return undefined;
    let active = true;
    queueMicrotask(() => {
      if (active) setRequestedOpen(false);
    });
    return () => {
      active = false;
    };
  }, [interactionBlocked]);

  const setIsOpen = useCallback(
    (nextOpen: boolean) => {
      if (interactionBlocked && nextOpen) return;
      setRequestedOpen((previous) => (previous === nextOpen ? previous : nextOpen));
    },
    [interactionBlocked],
  );
  const filterOptions = useCallback(
    (nextInputValue: string) =>
      filterListboxOptions(options, nextInputValue, { locale, filter: filterOption }),
    [filterOption, locale, options],
  );
  const filteredOptions = useMemo(() => filterOptions(inputValue), [filterOptions, inputValue]);
  const highlightedIndex = getListboxHighlightedIndex(filteredOptions, highlightedValue);
  const setHighlightedIndex = useCallback((targetOptions: readonly TOption[], index: number) => {
    setHighlightedValue(getListboxHighlightedValue(targetOptions, index));
  }, []);
  const normalizedCustomValue = allowCustomValues
    ? getCustomValue
      ? getCustomValue(inputValue)
      : inputValue.trim()
    : '';
  const canSelectCustomValue =
    !interactionBlocked &&
    normalizedCustomValue.length > 0 &&
    !disallowedCustomValues?.has(normalizedCustomValue) &&
    !value.includes(normalizedCustomValue);

  const selectOption = useCallback(
    (optionValue: string) => {
      if (interactionBlocked) return false;
      const nextValue = value.includes(optionValue)
        ? value.filter((item) => item !== optionValue)
        : [...value, optionValue];
      onValueChange?.([...nextValue]);
      setInputValue('');
      return true;
    },
    [interactionBlocked, onValueChange, value],
  );
  const selectCustomValue = useCallback(() => {
    if (!canSelectCustomValue) return false;
    onValueChange?.([...value, normalizedCustomValue]);
    setInputValue('');
    return true;
  }, [canSelectCustomValue, normalizedCustomValue, onValueChange, value]);
  const removeValue = useCallback(
    (optionValue: string) => {
      if (interactionBlocked || !value.includes(optionValue)) return false;
      onValueChange?.(value.filter((item) => item !== optionValue));
      return true;
    },
    [interactionBlocked, onValueChange, value],
  );
  const resetTransientState = useCallback(() => {
    setInputValue('');
    setHighlightedValue(undefined);
    setRequestedOpen(false);
  }, []);

  return {
    canSelectCustomValue,
    filteredOptions,
    filterOptions,
    highlightedIndex,
    inputValue,
    isOpen,
    removeValue,
    resetTransientState,
    selectCustomValue,
    selectOption,
    setHighlightedIndex,
    setInputValue,
    setIsOpen,
  };
};
