import { useLayoutEffect, useRef } from 'react';
import type { KeyboardEvent, RefObject } from 'react';
import { useListboxSelectState as useListboxSelectBehaviorState } from '@poffy-ui/behavior/listbox/react';
import type { ListboxSelectProps } from './ListboxSelect.types';
import {
  getInitialListboxSelectValue,
  type ListboxSelectOptionRecord,
} from './ListboxSelect.utils';
import { useFormReset } from '@/components/inputs/shared/useFormControlBridge';

interface UseListboxSelectStateParams {
  disabled: boolean;
  isInteractionDisabledNow: () => boolean;
  readOnly: boolean;
  nativeSelectRef: RefObject<HTMLSelectElement | null>;
  options: ListboxSelectOptionRecord[];
  props: ListboxSelectProps;
  valueProp: ListboxSelectProps['value'];
}

/** Connects shared listbox-select behavior to its native select and form adapters. */
export const useListboxSelectState = ({
  disabled,
  isInteractionDisabledNow,
  readOnly,
  nativeSelectRef,
  options,
  props,
  valueProp,
}: UseListboxSelectStateParams) => {
  const controlledValue = valueProp === undefined ? undefined : String(valueProp);
  const initialValue = getInitialListboxSelectValue(props, options);
  const {
    handleKeyDown: handleBehaviorKeyDown,
    handleSelectionChange,
    highlightedIndex,
    isControlled,
    isOpen,
    reset,
    selectedIndex,
    selectedValue,
    selectIndex,
    setHighlightedIndex,
    setOpen,
    toggleOpen,
  } = useListboxSelectBehaviorState({
    value: controlledValue,
    defaultValue: initialValue,
    interactionBlocked: [disabled, readOnly].some(Boolean),
    isInteractionBlockedNow: isInteractionDisabledNow,
    options,
    onRequestSelection: (index) => commitNativeOption(nativeSelectRef.current, index),
  });
  const currentStateRef = useRef({ selectedIndex, selectedValue });
  useLayoutEffect(() => {
    currentStateRef.current = { selectedIndex, selectedValue };
  }, [selectedIndex, selectedValue]);

  useLayoutEffect(() => {
    const nativeSelect = nativeSelectRef.current;
    if (!nativeSelect || selectedIndex < 0 || nativeSelect.selectedIndex === selectedIndex) return;
    nativeSelect.selectedIndex = selectedIndex;
  }, [nativeSelectRef, options, selectedIndex]);

  const formResetRef = useFormReset<HTMLSelectElement>(() => {
    reset();
    if (isControlled && nativeSelectRef.current) {
      nativeSelectRef.current.selectedIndex = currentStateRef.current.selectedIndex;
    }
  });

  const handleNativeChange = (nextValue: string, nextIndex: number) => {
    if (isInteractionDisabledNow()) {
      const nativeSelect = nativeSelectRef.current;
      if (nativeSelect) nativeSelect.selectedIndex = selectedIndex;
      return false;
    }
    const changed = handleSelectionChange(nextValue, nextIndex);
    if (!changed) {
      const nativeSelect = nativeSelectRef.current;
      if (nativeSelect) nativeSelect.selectedIndex = selectedIndex;
    }
    return changed;
  };
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.defaultPrevented) return;
    const handled = handleBehaviorKeyDown({
      isComposing: event.nativeEvent.isComposing,
      key: event.key,
      keyCode: event.nativeEvent.keyCode,
    });
    if (handled) event.preventDefault();
  };

  return {
    handleKeyDown,
    handleNativeChange,
    handleOpenChange: setOpen,
    handleSelectOption: selectIndex,
    formResetRef,
    highlightedIndex,
    isOpen,
    selectedIndex,
    selectedValue,
    setHighlightedIndex,
    toggleFromTrigger: toggleOpen,
  };
};

const commitNativeOption = (nativeSelect: HTMLSelectElement | null, index: number) => {
  if (!nativeSelect) return;
  nativeSelect.selectedIndex = index;
  const EventConstructor = nativeSelect.ownerDocument.defaultView?.Event;
  if (EventConstructor) {
    nativeSelect.dispatchEvent(new EventConstructor('change', { bubbles: true, cancelable: true }));
  }
};
