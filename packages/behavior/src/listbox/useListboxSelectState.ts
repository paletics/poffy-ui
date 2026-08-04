'use client';

import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { useControllableState } from '../hooks/state';
import {
  getFirstEnabledListboxIndex,
  getLastEnabledListboxIndex,
  getNextEnabledListboxIndex,
  getPreviousEnabledListboxIndex,
} from './listbox';
import {
  getListboxSelectOptionIdentity,
  getListboxSelectOptionIndex,
  getListboxSelectSelectedIndex,
  reconcileListboxSelectSelection,
} from './listbox-select';
import type {
  ListboxSelectOptionLike,
  UseListboxSelectStateOptions,
  UseListboxSelectStateReturn,
} from './useListboxSelectState.types';

/**
 * Coordinates single-select listbox ownership, open state, highlighting, and keyboard intent.
 *
 * Selection follows stable option identity when an uncontrolled option collection is reordered;
 * controlled values remain value-owned. `selectIndex` accepts only enabled options, requests a
 * selection only when its index changes, and closes the popup. `handleKeyDown` returns whether
 * the key was handled so the caller can decide whether to prevent its default behavior. IME
 * composition and blocked interactions are left unhandled; a blocked or empty collection cannot
 * be opened.
 */
export const useListboxSelectState = <
  TOption extends ListboxSelectOptionLike = ListboxSelectOptionLike,
>({
  defaultValue,
  interactionBlocked = false,
  isInteractionBlockedNow,
  onRequestSelection,
  options,
  value: controlledValue,
}: UseListboxSelectStateOptions<TOption>): UseListboxSelectStateReturn => {
  const initialIndex = getListboxSelectSelectedIndex(options, defaultValue);
  const defaultSelectionRef = useRef({
    identity: getListboxSelectOptionIdentity(options, initialIndex),
    value: defaultValue,
  });
  useLayoutEffect(() => {
    defaultSelectionRef.current = {
      identity: getListboxSelectOptionIdentity(
        options,
        getListboxSelectSelectedIndex(options, defaultValue),
      ),
      value: defaultValue,
    };
  }, [defaultValue, options]);

  const {
    isControlled,
    value: selectedValue,
    setValue,
  } = useControllableState({ value: controlledValue, defaultValue });
  const firstEnabledIndex = getFirstEnabledListboxIndex(options);
  const valueSelectedIndex = getListboxSelectSelectedIndex(options, selectedValue);
  const [selectedIdentity, setSelectedIdentity] = useState(() =>
    getListboxSelectOptionIdentity(options, valueSelectedIndex),
  );
  const [previousIsControlled, setPreviousIsControlled] = useState(isControlled);
  if (isControlled !== previousIsControlled) {
    setPreviousIsControlled(isControlled);
    if (!isControlled) {
      setSelectedIdentity(getListboxSelectOptionIdentity(options, valueSelectedIndex));
    }
  }

  const reconciledSelection = reconcileListboxSelectSelection({
    isControlled,
    options,
    selectedIdentity,
    selectedValue,
  });
  const selectedIndex = reconciledSelection.selectedIndex;
  if (reconciledSelection.valueNeedsUpdate) setValue(reconciledSelection.nextValue);
  if (reconciledSelection.identityNeedsUpdate) {
    setSelectedIdentity(reconciledSelection.nextIdentity);
  }

  const blocked = [interactionBlocked, options.length === 0].some(Boolean);
  const isBlockedNow = useCallback(
    () => [blocked, isInteractionBlockedNow?.() === true].some(Boolean),
    [blocked, isInteractionBlockedNow],
  );
  const [requestedOpen, setRequestedOpen] = useState(false);
  const [previousBlocked, setPreviousBlocked] = useState(blocked);
  if (blocked !== previousBlocked) {
    setPreviousBlocked(blocked);
    if (blocked) setRequestedOpen(false);
  }
  const isOpen = requestedOpen && !blocked;
  const [highlightedIdentity, setHighlightedIdentity] = useState(() =>
    getListboxSelectOptionIdentity(options, selectedIndex >= 0 ? selectedIndex : firstEnabledIndex),
  );
  const highlightedIndex = getListboxSelectOptionIndex(options, highlightedIdentity);
  const setHighlightedIndex = useCallback(
    (index: number) => {
      setHighlightedIdentity(getListboxSelectOptionIdentity(options, index));
    },
    [options],
  );
  const setOpen = useCallback(
    (nextOpen: boolean) => {
      if ((nextOpen && isBlockedNow()) || nextOpen === isOpen) return;
      setRequestedOpen(nextOpen);
      if (nextOpen) {
        setHighlightedIndex(selectedIndex >= 0 ? selectedIndex : firstEnabledIndex);
      }
    },
    [firstEnabledIndex, isBlockedNow, isOpen, selectedIndex, setHighlightedIndex],
  );
  const selectIndex = useCallback(
    (index: number) => {
      const option = options[index];
      if (isBlockedNow() || !option || option.disabled) return false;
      if (index !== selectedIndex) onRequestSelection?.(index);
      setRequestedOpen(false);
      setHighlightedIndex(index);
      return true;
    },
    [isBlockedNow, onRequestSelection, options, selectedIndex, setHighlightedIndex],
  );
  const handleSelectionChange = useCallback(
    (nextValue: string, nextIndex: number) => {
      if (isBlockedNow() || nextIndex === selectedIndex) return false;
      setValue(nextValue);
      if (!isControlled) {
        setSelectedIdentity(getListboxSelectOptionIdentity(options, nextIndex));
      }
      setHighlightedIndex(nextIndex);
      return true;
    },
    [isBlockedNow, isControlled, options, selectedIndex, setHighlightedIndex, setValue],
  );
  const reset = useCallback(() => {
    const resetSelection = isControlled
      ? {
          identity: getListboxSelectOptionIdentity(options, valueSelectedIndex),
          value: selectedValue,
        }
      : defaultSelectionRef.current;
    if (!isControlled) {
      setValue(resetSelection.value);
      setSelectedIdentity(resetSelection.identity);
    }
    setHighlightedIndex(getListboxSelectOptionIndex(options, resetSelection.identity));
    setRequestedOpen(false);
  }, [isControlled, options, selectedValue, setHighlightedIndex, setValue, valueSelectedIndex]);
  const handleKeyDown = useCallback(
    ({
      isComposing,
      key,
      keyCode,
    }: Parameters<UseListboxSelectStateReturn['handleKeyDown']>[0]) => {
      if (isBlockedNow() || isComposing || keyCode === 229) return false;
      switch (key) {
        case 'ArrowDown':
          if (!isOpen) setOpen(true);
          else {
            setHighlightedIndex(
              highlightedIndex < 0
                ? firstEnabledIndex
                : getNextEnabledListboxIndex(options, highlightedIndex),
            );
          }
          return true;
        case 'ArrowUp':
          if (!isOpen) setOpen(true);
          else {
            setHighlightedIndex(
              highlightedIndex < 0
                ? getLastEnabledListboxIndex(options)
                : getPreviousEnabledListboxIndex(options, highlightedIndex),
            );
          }
          return true;
        case 'Home':
          setHighlightedIndex(firstEnabledIndex);
          return true;
        case 'End':
          setHighlightedIndex(getLastEnabledListboxIndex(options));
          return true;
        case 'Enter':
        case ' ':
          if (!isOpen) setOpen(true);
          else selectIndex(highlightedIndex);
          return true;
        case 'Escape':
          if (!isOpen) return false;
          setRequestedOpen(false);
          return true;
        case 'Tab':
          setRequestedOpen(false);
          return false;
        default:
          return false;
      }
    },
    [
      firstEnabledIndex,
      highlightedIndex,
      isBlockedNow,
      isOpen,
      options,
      selectIndex,
      setHighlightedIndex,
      setOpen,
    ],
  );

  return {
    handleKeyDown,
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
    toggleOpen: () => setOpen(!isOpen),
  };
};
