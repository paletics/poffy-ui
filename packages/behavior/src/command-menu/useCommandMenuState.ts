'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useControllableState } from '../hooks/state';
import { filterCommandMenuItems, getNextCommandMenuHighlight } from './command-menu';
import type { CommandMenuBehaviorItem } from './command-menu.types';
import type {
  CommandMenuKeyboardInput,
  CommandMenuKeyboardIntent,
  UseCommandMenuStateOptions,
  UseCommandMenuStateReturn,
} from './useCommandMenuState.types';

/** Maps non-composing command-menu keys to navigation or selection intents. */
export const getCommandMenuKeyboardIntent = ({
  isComposing,
  key,
  keyCode,
}: CommandMenuKeyboardInput): CommandMenuKeyboardIntent => {
  if (isComposing || keyCode === 229) return null;
  if (key === 'ArrowDown') return { type: 'move', direction: 'next' };
  if (key === 'ArrowUp') return { type: 'move', direction: 'previous' };
  if (key === 'Home') return { type: 'move', direction: 'first' };
  if (key === 'End') return { type: 'move', direction: 'last' };
  return key === 'Enter' ? { type: 'select' } : null;
};

/**
 * Coordinates command-menu open state, query filtering, highlighting, and selection.
 *
 * Open and query are independently controlled only when each value has its corresponding change
 * callback; otherwise that axis keeps hook-owned state. Filtering, opening, and an uncontrolled
 * query change reset the highlight to the first enabled result, and movement never wraps. Disabling
 * makes the exposed menu closed and prevents selection. `selectItem` ignores disabled items and,
 * by default, closes after notifying `onSelectItem`.
 */
export const useCommandMenuState = <TItem extends CommandMenuBehaviorItem>({
  closeOnSelect = true,
  defaultOpen = false,
  defaultQuery = '',
  disabled = false,
  items,
  locale,
  onOpenChange,
  onQueryChange,
  onSelectItem,
  open: controlledOpen,
  query: controlledQuery,
}: UseCommandMenuStateOptions<TItem>): UseCommandMenuStateReturn<TItem> => {
  const resolvedOnOpenChange = typeof onOpenChange === 'function' ? onOpenChange : undefined;
  const resolvedOnQueryChange = typeof onQueryChange === 'function' ? onQueryChange : undefined;
  const controlsOpen = controlledOpen !== undefined && resolvedOnOpenChange !== undefined;
  const controlsQuery = controlledQuery !== undefined && resolvedOnQueryChange !== undefined;
  const {
    value: open,
    isControlled: isOpenControlled,
    setValue: setUncontrolledOpen,
  } = useControllableState({
    value: controlsOpen ? controlledOpen : undefined,
    defaultValue: !controlsOpen && controlledOpen !== undefined ? controlledOpen : defaultOpen,
  });
  const {
    value: query,
    isControlled: isQueryControlled,
    setValue: setUncontrolledQuery,
  } = useControllableState({
    value: controlsQuery ? controlledQuery : undefined,
    defaultValue: !controlsQuery && controlledQuery !== undefined ? controlledQuery : defaultQuery,
  });
  const [previousDisabled, setPreviousDisabled] = useState(disabled);
  const wasDisabledRef = useRef(disabled);
  const filteredItems = useMemo(
    () => filterCommandMenuItems(items, query, locale),
    [items, locale, query],
  );
  const effectiveOpen = disabled ? false : open;
  const [highlightState, setHighlightState] = useState(() => ({
    filteredItems,
    open: effectiveOpen,
    index: effectiveOpen ? getNextCommandMenuHighlight(filteredItems, -1, 'first') : -1,
  }));
  const highlightInputsChanged =
    highlightState.filteredItems !== filteredItems ? true : highlightState.open !== effectiveOpen;
  const highlightedIndex = highlightInputsChanged
    ? effectiveOpen
      ? getNextCommandMenuHighlight(filteredItems, -1, 'first')
      : -1
    : highlightState.index;

  if (highlightInputsChanged) {
    setHighlightState({ filteredItems, open: effectiveOpen, index: highlightedIndex });
  }
  if (disabled !== previousDisabled) {
    setPreviousDisabled(disabled);
    if (disabled && !isOpenControlled) setUncontrolledOpen(false);
  }

  const setHighlightedIndex = useCallback((nextIndex: number | ((index: number) => number)) => {
    setHighlightState((state) => ({
      ...state,
      index: typeof nextIndex === 'function' ? nextIndex(state.index) : nextIndex,
    }));
  }, []);
  const activeItem =
    effectiveOpen && highlightedIndex >= 0 ? filteredItems[highlightedIndex] : undefined;

  useEffect(() => {
    const wasDisabled = wasDisabledRef.current;
    wasDisabledRef.current = disabled;
    if (!disabled || wasDisabled) return;
    if (isOpenControlled && open) resolvedOnOpenChange?.(false);
  }, [disabled, isOpenControlled, open, resolvedOnOpenChange]);

  const setOpen = useCallback(
    (nextOpen: boolean) => {
      if ((disabled && nextOpen) || nextOpen === open) return;
      if (!isOpenControlled) setUncontrolledOpen(nextOpen);
      resolvedOnOpenChange?.(nextOpen);
      if (!nextOpen) setHighlightedIndex(-1);
    },
    [
      disabled,
      isOpenControlled,
      open,
      resolvedOnOpenChange,
      setHighlightedIndex,
      setUncontrolledOpen,
    ],
  );
  const setQuery = useCallback(
    (nextQuery: string) => {
      if (nextQuery === query) return;
      if (!isQueryControlled) {
        setUncontrolledQuery(nextQuery);
        const nextItems = filterCommandMenuItems(items, nextQuery, locale);
        setHighlightedIndex(getNextCommandMenuHighlight(nextItems, -1, 'first'));
      }
      resolvedOnQueryChange?.(nextQuery);
    },
    [
      isQueryControlled,
      items,
      locale,
      query,
      resolvedOnQueryChange,
      setHighlightedIndex,
      setUncontrolledQuery,
    ],
  );
  const moveHighlight = useCallback(
    (direction: 'first' | 'last' | 'next' | 'previous') => {
      setHighlightedIndex((index) => getNextCommandMenuHighlight(filteredItems, index, direction));
    },
    [filteredItems, setHighlightedIndex],
  );
  const selectItem = useCallback(
    (item: TItem) => {
      if (disabled || item.disabled) return;
      onSelectItem?.(item);
      if (closeOnSelect) setOpen(false);
    },
    [closeOnSelect, disabled, onSelectItem, setOpen],
  );

  return {
    activeItem,
    filteredItems,
    highlightedIndex,
    isQueryControlled,
    moveHighlight,
    open: effectiveOpen,
    query,
    selectItem,
    setHighlightedIndex,
    setOpen,
    setQuery,
  };
};
