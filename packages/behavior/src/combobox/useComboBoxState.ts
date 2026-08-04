import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useControllableState } from '../hooks';
import {
  filterListboxOptions,
  getListboxHighlightedIndex,
  getListboxHighlightedValue,
} from '../listbox';
import type { ComboBoxOptionLike } from './combobox.types';
import type { UseComboBoxStateOptions, UseComboBoxStateReturn } from './useComboBoxState.types';

/**
 * Owns ComboBox selection, input filtering, highlight, and popup state.
 *
 * Selection and input are independently controlled when their value props are present. With
 * `reconcileSelection` enabled, a selected value removed from `options` is exposed as `null` and
 * requests `onValueChange(null)` once, including in controlled mode. Blocked interactions cannot
 * open or change selection and close an open popup asynchronously. `reset` updates hook-owned
 * state without invoking change callbacks, clears highlight, and closes the popup.
 */
export const useComboBoxState = <TOption extends ComboBoxOptionLike>({
  defaultInputValue,
  defaultValue = null,
  filterOption,
  inputValue: controlledInputValue,
  interactionBlocked = false,
  locale,
  onInputValueChange,
  onValueChange,
  options,
  reconcileSelection = true,
  value,
}: UseComboBoxStateOptions<TOption>): UseComboBoxStateReturn<TOption> => {
  const [requestedOpen, setRequestedOpen] = useState(false);
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

  const {
    isControlled: isValueControlled,
    value: selectedValue,
    setValue: setSelectionState,
  } = useControllableState<string | null>({ value, defaultValue });
  const lastNotifiedOrphanValueRef = useRef<string | null | undefined>(undefined);
  const selectedValueIsPresent =
    selectedValue == null ? true : options.some((option) => option.value === selectedValue);
  useEffect(() => {
    if (selectedValueIsPresent) {
      lastNotifiedOrphanValueRef.current = undefined;
      return;
    }
    if (!reconcileSelection || lastNotifiedOrphanValueRef.current === selectedValue) return;
    lastNotifiedOrphanValueRef.current = selectedValue;
    setSelectionState(null);
    onValueChange?.(null);
  }, [onValueChange, reconcileSelection, selectedValue, selectedValueIsPresent, setSelectionState]);
  const resolvedSelectedValue =
    selectedValueIsPresent || !reconcileSelection ? selectedValue : null;
  const initialInputValue =
    defaultInputValue ??
    options.find((option) => option.value === resolvedSelectedValue)?.label ??
    '';
  const {
    isControlled: isInputValueControlled,
    value: inputValue,
    setValue: setInputState,
  } = useControllableState<string>({
    value: controlledInputValue,
    defaultValue: initialInputValue,
  });
  const setInputValue = useCallback(
    (nextInputValue: string) => {
      if (nextInputValue === inputValue) return;
      setInputState(nextInputValue);
      onInputValueChange?.(nextInputValue);
    },
    [inputValue, onInputValueChange, setInputState],
  );
  const setSelectedValue = useCallback(
    (nextValue: string | null) => {
      if (interactionBlocked || nextValue === resolvedSelectedValue) return;
      setSelectionState(nextValue);
      onValueChange?.(nextValue);
    },
    [interactionBlocked, onValueChange, resolvedSelectedValue, setSelectionState],
  );
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
  const [highlightedValue, setHighlightedValue] = useState<string>();
  const highlightedIndex = getListboxHighlightedIndex(filteredOptions, highlightedValue);
  const setHighlightedIndex = useCallback(
    (
      targetOptions: readonly TOption[],
      nextIndex: number | ((previousIndex: number) => number),
    ) => {
      const previousIndex = getListboxHighlightedIndex(targetOptions, highlightedValue);
      const resolvedIndex = typeof nextIndex === 'function' ? nextIndex(previousIndex) : nextIndex;
      setHighlightedValue(getListboxHighlightedValue(targetOptions, resolvedIndex));
    },
    [highlightedValue],
  );
  const reset = useCallback(
    (nextValue: string | null, nextInputValue?: string) => {
      const reconciledValue =
        !isValueControlled &&
        nextValue !== null &&
        !options.some((option) => option.value === nextValue)
          ? null
          : nextValue;
      const effectiveValue = isValueControlled ? resolvedSelectedValue : reconciledValue;
      setSelectionState(reconciledValue);
      setInputState(
        nextInputValue ?? options.find((option) => option.value === effectiveValue)?.label ?? '',
      );
      setHighlightedValue(undefined);
      setRequestedOpen(false);
    },
    [isValueControlled, options, resolvedSelectedValue, setInputState, setSelectionState],
  );

  return {
    filteredOptions,
    filterOptions,
    highlightedIndex,
    inputValue,
    isInputValueControlled,
    isOpen,
    isValueControlled,
    reset,
    selectedValue: resolvedSelectedValue,
    setHighlightedIndex,
    setInputValue,
    setIsOpen,
    setSelectedValue,
  };
};
