'use client';

import { getComboBoxKeyboardIntent } from '@poffy-ui/behavior/combobox';
import {
  getFirstEnabledListboxIndex,
  getLastEnabledListboxIndex,
  getNextEnabledListboxIndex,
  getPreviousEnabledListboxIndex,
} from '@poffy-ui/behavior/listbox';
import { useCallback, type ChangeEvent, type KeyboardEvent } from 'react';
import type { ComboBoxContextValue } from './ComboBoxContext';

type InteractionContext = Pick<
  ComboBoxContextValue,
  | 'disabled'
  | 'filteredOptions'
  | 'filterOptions'
  | 'highlightedIndex'
  | 'isOpen'
  | 'listId'
  | 'onChange'
  | 'options'
  | 'readOnly'
  | 'setHighlightedIndex'
  | 'setInputValue'
  | 'setIsOpen'
>;

/** Adapts framework-neutral ComboBox intents to React input events. */
export const useComboBoxInputInteractions = (context: InteractionContext) => {
  const {
    disabled,
    filteredOptions,
    filterOptions,
    highlightedIndex,
    isOpen,
    listId,
    onChange,
    options,
    readOnly,
    setHighlightedIndex,
    setInputValue,
    setIsOpen,
  } = context;
  const openIfClosed = useCallback(() => {
    if (disabled || readOnly) return;
    if (!isOpen) setIsOpen(true);
  }, [disabled, isOpen, readOnly, setIsOpen]);

  const handleModelInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (disabled || readOnly) return;
      const nextInputValue = event.target.value;
      const nextFilteredOptions = filterOptions(nextInputValue);
      setInputValue(nextInputValue);
      openIfClosed();
      setHighlightedIndex(nextFilteredOptions, getFirstEnabledListboxIndex(nextFilteredOptions));
    },
    [disabled, filterOptions, openIfClosed, readOnly, setHighlightedIndex, setInputValue],
  );

  const handleModelKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (disabled || readOnly) return;
      if (event.nativeEvent.isComposing || event.nativeEvent.keyCode === 229) return;

      const intent = getComboBoxKeyboardIntent({
        highlightedIndex,
        isOpen,
        key: event.key,
        optionCount: filteredOptions.length,
      });
      switch (intent) {
        case 'next':
          event.preventDefault();
          openIfClosed();
          setHighlightedIndex(filteredOptions, (previousIndex) =>
            previousIndex < 0
              ? getFirstEnabledListboxIndex(filteredOptions)
              : getNextEnabledListboxIndex(filteredOptions, previousIndex),
          );
          break;
        case 'previous':
          event.preventDefault();
          openIfClosed();
          setHighlightedIndex(filteredOptions, (previousIndex) =>
            previousIndex < 0
              ? getLastEnabledListboxIndex(filteredOptions)
              : getPreviousEnabledListboxIndex(filteredOptions, previousIndex),
          );
          break;
        case 'select': {
          event.preventDefault();
          const option = filteredOptions[highlightedIndex];
          if (!option || option.disabled) return;
          onChange?.(option.value);
          setInputValue(option.label);
          setIsOpen(false);
          break;
        }
        case 'close':
          setIsOpen(false);
          break;
      }
    },
    [
      disabled,
      filteredOptions,
      highlightedIndex,
      isOpen,
      onChange,
      openIfClosed,
      readOnly,
      setHighlightedIndex,
      setInputValue,
      setIsOpen,
    ],
  );

  const activeOption =
    isOpen && highlightedIndex >= 0 ? filteredOptions[highlightedIndex] : undefined;
  const activeOptionIndex = activeOption ? options.indexOf(activeOption) : -1;

  return {
    activeOptionId: activeOptionIndex >= 0 ? `${listId}-option-${activeOptionIndex}` : undefined,
    handleModelInputChange,
    handleModelKeyDown,
    openIfClosed,
  };
};
