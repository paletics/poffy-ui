'use client';

import {
  getMultiSelectKeyboardIntent,
  useMultiSelectInteractionState,
} from '@poffy-ui/behavior/multi-select';
import {
  getFirstEnabledListboxIndex,
  getLastEnabledListboxIndex,
  getNextEnabledListboxIndex,
  getPreviousEnabledListboxIndex,
} from '@poffy-ui/behavior/listbox';
import {
  useCallback,
  useId,
  type ChangeEvent,
  type KeyboardEvent,
  type PointerEvent,
  type RefObject,
} from 'react';
import type { MultiSelectOption } from './MultiSelect.types';

interface UseMultiSelectInputInteractionsOptions {
  allowCustomValues: boolean;
  disabled: boolean;
  disallowedCustomValues?: ReadonlySet<string>;
  filterOption?: (option: MultiSelectOption, inputValue: string) => boolean;
  getCustomValue?: (inputValue: string) => string;
  inputRef: RefObject<HTMLInputElement | null>;
  locale?: string;
  onChange?: (values: string[]) => void;
  options: readonly MultiSelectOption[];
  readOnly: boolean;
  value: readonly string[];
}

/** Adapts framework-neutral MultiSelect state and intents to React input events. */
export const useMultiSelectInputInteractions = ({
  allowCustomValues,
  disabled,
  disallowedCustomValues,
  filterOption,
  getCustomValue,
  inputRef,
  locale,
  onChange,
  options,
  readOnly,
  value,
}: UseMultiSelectInputInteractionsOptions) => {
  const interactionBlocked = disabled || readOnly;
  const listId = useId();
  const optionIdPrefix = useId();
  const state = useMultiSelectInteractionState({
    allowCustomValues,
    disallowedCustomValues,
    filterOption,
    getCustomValue,
    interactionBlocked,
    locale,
    onValueChange: onChange,
    options,
    value,
  });
  const {
    canSelectCustomValue,
    filteredOptions,
    filterOptions,
    highlightedIndex,
    inputValue,
    isOpen,
    removeValue,
    selectCustomValue,
    selectOption,
    setHighlightedIndex,
    setInputValue,
    setIsOpen,
  } = state;

  const openIfClosed = useCallback(() => {
    if (interactionBlocked || isOpen) return;
    setIsOpen(true);
  }, [interactionBlocked, isOpen, setIsOpen]);
  const focusInput = useCallback(() => inputRef.current?.focus(), [inputRef]);
  const handleInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (interactionBlocked) return;
      const nextInputValue = event.target.value;
      const nextFilteredOptions = filterOptions(nextInputValue);
      setInputValue(nextInputValue);
      openIfClosed();
      setHighlightedIndex(nextFilteredOptions, getFirstEnabledListboxIndex(nextFilteredOptions));
    },
    [filterOptions, interactionBlocked, openIfClosed, setHighlightedIndex, setInputValue],
  );
  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (interactionBlocked) return;
      if (event.nativeEvent.isComposing || event.nativeEvent.keyCode === 229) return;
      if (event.key === 'Tab') {
        setIsOpen(false);
        return;
      }

      const highlightedOption = filteredOptions[highlightedIndex];
      const firstEnabledOption = filteredOptions.find((option) => !option.disabled);
      const intent = getMultiSelectKeyboardIntent({
        canCreateCustomValue: canSelectCustomValue,
        hasEnabledOption: firstEnabledOption !== undefined,
        hasInputValue: inputValue.length > 0,
        highlightedIndex: highlightedOption?.disabled ? -1 : highlightedIndex,
        isOpen,
        key: event.key,
        optionCount: filteredOptions.length,
        selectedValueCount: value.length,
      });

      switch (intent) {
        case 'next':
          event.preventDefault();
          openIfClosed();
          setHighlightedIndex(
            filteredOptions,
            highlightedIndex < 0
              ? getFirstEnabledListboxIndex(filteredOptions)
              : getNextEnabledListboxIndex(filteredOptions, highlightedIndex),
          );
          break;
        case 'previous':
          event.preventDefault();
          openIfClosed();
          setHighlightedIndex(
            filteredOptions,
            highlightedIndex < 0
              ? getLastEnabledListboxIndex(filteredOptions)
              : getPreviousEnabledListboxIndex(filteredOptions, highlightedIndex),
          );
          break;
        case 'first':
          event.preventDefault();
          openIfClosed();
          setHighlightedIndex(filteredOptions, getFirstEnabledListboxIndex(filteredOptions));
          break;
        case 'last':
          event.preventDefault();
          openIfClosed();
          setHighlightedIndex(filteredOptions, getLastEnabledListboxIndex(filteredOptions));
          break;
        case 'select-highlighted':
          if (!highlightedOption || highlightedOption.disabled) return;
          event.preventDefault();
          if (selectOption(highlightedOption.value)) focusInput();
          break;
        case 'select-first':
          if (!firstEnabledOption) return;
          event.preventDefault();
          if (selectOption(firstEnabledOption.value)) focusInput();
          break;
        case 'create-custom':
          if (!canSelectCustomValue) return;
          event.preventDefault();
          if (selectCustomValue()) focusInput();
          break;
        case 'remove-last':
          if (removeValue(value.at(-1) ?? '')) focusInput();
          break;
        case 'close':
          setIsOpen(false);
          break;
      }
    },
    [
      canSelectCustomValue,
      filteredOptions,
      focusInput,
      highlightedIndex,
      inputValue,
      interactionBlocked,
      isOpen,
      openIfClosed,
      removeValue,
      selectCustomValue,
      selectOption,
      setHighlightedIndex,
      setIsOpen,
      value,
    ],
  );
  const handleSelectOption = useCallback(
    (optionValue: string) => {
      if (selectOption(optionValue)) focusInput();
    },
    [focusInput, selectOption],
  );
  const removeTag = useCallback(
    (optionValue: string) => {
      if (removeValue(optionValue)) focusInput();
    },
    [focusInput, removeValue],
  );
  const onPointerDownInput = useCallback(
    (event: PointerEvent<HTMLInputElement>) => {
      if (interactionBlocked || event.button !== 0) return;
      openIfClosed();
    },
    [interactionBlocked, openIfClosed],
  );
  const onToggleOpen = useCallback(
    (nextOpen: boolean) => {
      if (interactionBlocked || nextOpen === isOpen) return;
      setIsOpen(nextOpen);
      if (nextOpen) {
        focusInput();
        setHighlightedIndex(filteredOptions, getFirstEnabledListboxIndex(filteredOptions));
      }
    },
    [filteredOptions, focusInput, interactionBlocked, isOpen, setHighlightedIndex, setIsOpen],
  );
  const activeDescendant =
    isOpen && highlightedIndex >= 0 && highlightedIndex < filteredOptions.length
      ? `${optionIdPrefix}-${highlightedIndex}`
      : undefined;

  return {
    ...state,
    activeDescendant,
    handleInputChange,
    handleKeyDown,
    handleSelectOption,
    listId,
    onPointerDownInput,
    onToggleOpen,
    optionIdPrefix,
    removeTag,
  };
};
