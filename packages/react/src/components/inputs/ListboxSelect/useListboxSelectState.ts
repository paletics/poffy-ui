import { useState } from 'react';
import type { KeyboardEvent, RefObject } from 'react';
import {
  getFirstEnabledListboxIndex,
  getLastEnabledListboxIndex,
  getNextEnabledListboxIndex,
  getPreviousEnabledListboxIndex,
} from '@poffy-ui/behavior/listbox';
import type { ListboxSelectProps } from './ListboxSelect.types';
import {
  getInitialListboxSelectValue,
  getListboxSelectSelectedIndex,
  type ListboxSelectOptionRecord,
} from './ListboxSelect.utils';

interface UseListboxSelectStateParams {
  disabled: boolean;
  nativeSelectRef: RefObject<HTMLSelectElement | null>;
  options: ListboxSelectOptionRecord[];
  props: ListboxSelectProps;
  valueProp: ListboxSelectProps['value'];
}

/**
 * Manages custom ListboxSelect open state, highlighted option, and native select syncing.
 */
export const useListboxSelectState = ({
  disabled,
  nativeSelectRef,
  options,
  props,
  valueProp,
}: UseListboxSelectStateParams) => {
  const isControlled = valueProp !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(() =>
    getInitialListboxSelectValue(props, options),
  );
  const selectedValue = isControlled ? String(valueProp ?? '') : uncontrolledValue;
  const selectedIndex = getListboxSelectSelectedIndex(options, selectedValue);
  const [isOpen, setIsOpen] = useState(false);
  const firstEnabledIndex = getFirstEnabledListboxIndex(options);
  const lastEnabledIndex = getLastEnabledListboxIndex(options);
  const [highlightedIndex, setHighlightedIndex] = useState(() =>
    selectedIndex >= 0 ? selectedIndex : firstEnabledIndex,
  );

  const commitValue = (nextValue: string) => {
    if (!isControlled) {
      setUncontrolledValue(nextValue);
    }
    const nativeSelect = nativeSelectRef.current;
    if (!nativeSelect) return;
    nativeSelect.value = nextValue;
    nativeSelect.dispatchEvent(new Event('change', { bubbles: true }));
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (disabled || nextOpen === isOpen) return;
    setIsOpen(nextOpen);
    if (nextOpen) {
      setHighlightedIndex(selectedIndex >= 0 ? selectedIndex : firstEnabledIndex);
    }
  };

  const handleSelectOption = (index: number) => {
    const option = options[index];
    if (!option || option.disabled) return;
    commitValue(option.value);
    setIsOpen(false);
    setHighlightedIndex(index);
  };

  const toggleFromTrigger = () => {
    handleOpenChange(!isOpen);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (!isOpen) {
          handleOpenChange(true);
          break;
        }
        setHighlightedIndex((index) =>
          index < 0 ? firstEnabledIndex : getNextEnabledListboxIndex(options, index),
        );
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (!isOpen) {
          handleOpenChange(true);
          break;
        }
        setHighlightedIndex((index) =>
          index < 0 ? lastEnabledIndex : getPreviousEnabledListboxIndex(options, index),
        );
        break;
      case 'Home':
        event.preventDefault();
        setHighlightedIndex(firstEnabledIndex);
        break;
      case 'End':
        event.preventDefault();
        setHighlightedIndex(lastEnabledIndex);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (!isOpen) {
          handleOpenChange(true);
          break;
        }
        handleSelectOption(highlightedIndex);
        break;
      case 'Escape':
        if (isOpen) {
          event.preventDefault();
          setIsOpen(false);
        }
        break;
      case 'Tab':
        setIsOpen(false);
        break;
    }
  };

  return {
    handleKeyDown,
    handleOpenChange,
    handleSelectOption,
    highlightedIndex,
    isOpen,
    selectedIndex,
    selectedValue,
    setHighlightedIndex,
    toggleFromTrigger,
  };
};
