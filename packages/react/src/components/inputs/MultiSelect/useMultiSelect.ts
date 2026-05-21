'use client';

import {
  filterListboxOptions,
  getFirstEnabledListboxIndex,
  getLastEnabledListboxIndex,
  getNextEnabledListboxIndex,
  getPreviousEnabledListboxIndex,
} from '@poffy-ui/behavior/listbox';
import { ChangeEvent, KeyboardEvent, PointerEvent, RefObject, useId, useState } from 'react';
import type { MultiSelectOption } from './MultiSelect.types';

/**
 * Inputs required to manage MultiSelect state outside the presentational shell.
 */
interface UseMultiSelectOptions {
  allowCustomValues: boolean;
  disabled: boolean;
  getCustomValue?: (inputValue: string) => string;
  inputRef: RefObject<HTMLInputElement | null>;
  onChange?: (values: string[]) => void;
  options: MultiSelectOption[];
  readOnly: boolean;
  value: string[];
}

/**
 * State and event handlers exposed by useMultiSelect.
 */
interface UseMultiSelectResult {
  activeDescendant?: string;
  filteredOptions: MultiSelectOption[];
  handleInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
  handleSelectOption: (optionValue: string) => void;
  highlightedIndex: number;
  inputValue: string;
  isOpen: boolean;
  listId: string;
  onPointerDownInput: (event: PointerEvent<HTMLInputElement>) => void;
  onToggleOpen: (nextOpen: boolean) => void;
  optionIdPrefix: string;
  removeTag: (tagValue: string) => void;
  setIsOpen: (nextOpen: boolean) => void;
}

/**
 * Encapsulates the interaction rules for MultiSelect.
 * Selection changes, highlight movement, and read-only/disabled guards live here
 * so the rendered structure can stay small and predictable.
 */
export const useMultiSelect = ({
  allowCustomValues,
  disabled,
  getCustomValue,
  inputRef,
  onChange,
  options,
  readOnly,
  value,
}: UseMultiSelectOptions): UseMultiSelectResult => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const listId = useId();
  const optionIdPrefix = useId();
  const filteredOptions = filterListboxOptions(options, inputValue);
  const activeDescendant =
    isOpen && highlightedIndex >= 0 && highlightedIndex < filteredOptions.length
      ? `${optionIdPrefix}-${highlightedIndex}`
      : undefined;

  const openIfClosed = () => {
    if (!isOpen) setIsOpen(true);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextInputValue = event.target.value;
    const nextFilteredOptions = filterListboxOptions(options, nextInputValue);
    setInputValue(nextInputValue);
    openIfClosed();
    setHighlightedIndex(getFirstEnabledListboxIndex(nextFilteredOptions));
  };

  const handleSelectOption = (optionValue: string) => {
    const isSelected = value.includes(optionValue);
    onChange?.(isSelected ? value.filter((item) => item !== optionValue) : [...value, optionValue]);
    setInputValue('');
    inputRef.current?.focus();
  };

  const handleSelectCustomValue = () => {
    if (!allowCustomValues) return false;
    const customValue = getCustomValue ? getCustomValue(inputValue) : inputValue.trim();
    if (!customValue || value.includes(customValue)) return false;

    onChange?.([...value, customValue]);
    setInputValue('');
    inputRef.current?.focus();
    return true;
  };

  const removeTag = (tagValue: string) => {
    if (disabled || readOnly) return;
    onChange?.(value.filter((item) => item !== tagValue));
    inputRef.current?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (disabled || readOnly) return;
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        openIfClosed();
        setHighlightedIndex((index) =>
          index < 0
            ? getFirstEnabledListboxIndex(filteredOptions)
            : getNextEnabledListboxIndex(filteredOptions, index),
        );
        break;
      case 'ArrowUp':
        event.preventDefault();
        openIfClosed();
        setHighlightedIndex((index) =>
          index < 0
            ? getLastEnabledListboxIndex(filteredOptions)
            : getPreviousEnabledListboxIndex(filteredOptions, index),
        );
        break;
      case 'Home':
        event.preventDefault();
        openIfClosed();
        setHighlightedIndex(getFirstEnabledListboxIndex(filteredOptions));
        break;
      case 'End':
        event.preventDefault();
        openIfClosed();
        setHighlightedIndex(getLastEnabledListboxIndex(filteredOptions));
        break;
      case 'Enter':
        event.preventDefault();
        if (isOpen && highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
          if (!filteredOptions[highlightedIndex].disabled)
            handleSelectOption(filteredOptions[highlightedIndex].value);
          break;
        }
        if (inputValue) {
          const firstEnabledOption = filteredOptions.find((option) => !option.disabled);
          if (firstEnabledOption) {
            handleSelectOption(firstEnabledOption.value);
            break;
          }
          handleSelectCustomValue();
        }
        break;
      case 'Escape':
        setIsOpen(false);
        inputRef.current?.blur();
        break;
      case 'Backspace':
        if (inputValue === '' && value.length > 0) removeTag(value.at(-1) ?? '');
        break;
      case 'Tab':
        setIsOpen(false);
        break;
    }
  };

  const onPointerDownInput = (event: PointerEvent<HTMLInputElement>) => {
    if (disabled || readOnly || event.button !== 0) return;
    openIfClosed();
  };

  const onToggleOpen = (nextOpen: boolean) => {
    if (disabled || readOnly || nextOpen === isOpen) return;
    setIsOpen(nextOpen);
    if (nextOpen) {
      inputRef.current?.focus();
      setHighlightedIndex(getFirstEnabledListboxIndex(filteredOptions));
    }
  };

  return {
    activeDescendant,
    filteredOptions,
    handleInputChange,
    handleKeyDown,
    handleSelectOption,
    highlightedIndex,
    inputValue,
    isOpen,
    listId,
    onPointerDownInput,
    onToggleOpen,
    optionIdPrefix,
    removeTag,
    setIsOpen,
  };
};
