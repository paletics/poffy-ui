'use client';

import {
  getCommandMenuActiveDescendant,
  getCommandMenuKeyboardIntent,
  useCommandMenuState,
} from '@poffy-ui/behavior/command-menu';
import type { UseCommandMenuStateOptions } from '@poffy-ui/behavior/command-menu';
import { useCallback, useEffect, useId, useRef } from 'react';
import type { ChangeEvent, KeyboardEvent } from 'react';
import type { CommandMenuItem } from './CommandMenu.types';

interface UseCommandMenuOptions {
  closeOnSelect: boolean;
  controlledOpen?: boolean;
  controlledQuery?: string;
  defaultOpen: boolean;
  defaultQuery: string;
  disabled: boolean;
  items: CommandMenuItem[];
  locale?: string;
  onOpenChange?: (open: boolean) => void;
  onQueryChange?: (query: string) => void;
}

interface RuntimeEnv {
  process?: { env?: Record<string, string | undefined> };
}

export const useCommandMenu = ({
  closeOnSelect,
  controlledOpen,
  controlledQuery,
  defaultOpen,
  defaultQuery,
  disabled,
  items,
  locale,
  onOpenChange,
  onQueryChange,
}: UseCommandMenuOptions) => {
  const resolvedOnOpenChange = typeof onOpenChange === 'function' ? onOpenChange : undefined;
  const resolvedOnQueryChange = typeof onQueryChange === 'function' ? onQueryChange : undefined;
  const controlsOpen = controlledOpen !== undefined && resolvedOnOpenChange !== undefined;
  const controlsQuery = controlledQuery !== undefined && resolvedOnQueryChange !== undefined;
  useEffect(() => {
    if (controlledOpen === undefined || controlsOpen) return;
    if ((globalThis as RuntimeEnv).process?.env?.['NODE_ENV'] === 'production') return;
    console.warn(
      '[CommandMenu] `open` without `onOpenChange` falls back to uncontrolled initial state.',
    );
  }, [controlledOpen, controlsOpen]);
  useEffect(() => {
    if (controlledQuery === undefined || controlsQuery) return;
    if ((globalThis as RuntimeEnv).process?.env?.['NODE_ENV'] === 'production') return;
    console.warn(
      '[CommandMenu] `query` without `onQueryChange` falls back to uncontrolled initial state.',
    );
  }, [controlledQuery, controlsQuery]);

  const state = useCommandMenuState({
    closeOnSelect,
    defaultOpen,
    defaultQuery,
    disabled,
    items,
    locale,
    onOpenChange: resolvedOnOpenChange,
    onQueryChange: resolvedOnQueryChange,
    onSelectItem: (item) => item.onSelect?.(item),
    open: controlledOpen,
    query: controlledQuery,
    // The React adapter intentionally accepts malformed untyped state pairs so the behavior
    // hook can preserve its documented runtime fallback after issuing development warnings.
  } as UseCommandMenuStateOptions<CommandMenuItem>);
  const listId = useId();
  const optionIdPrefix = useId();
  const optionRefs = useRef(new Map<string, HTMLElement>());
  const registerOption = useCallback((id: string, node: HTMLElement | null) => {
    if (node) optionRefs.current.set(id, node);
    else optionRefs.current.delete(id);
  }, []);
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    state.setQuery(event.currentTarget.value);
  };
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    const intent = getCommandMenuKeyboardIntent({
      isComposing: event.nativeEvent.isComposing,
      key: event.key,
      keyCode: event.nativeEvent.keyCode,
    });
    if (!intent) return;
    event.preventDefault();
    if (intent.type === 'move') state.moveHighlight(intent.direction);
    else if (state.activeItem) state.selectItem(state.activeItem);
  };

  return {
    activeDescendant: getCommandMenuActiveDescendant(
      state.filteredItems,
      state.highlightedIndex,
      optionIdPrefix,
      state.open,
    ),
    filteredItems: state.filteredItems,
    handleInputChange,
    handleKeyDown,
    highlightedIndex: state.highlightedIndex,
    listId,
    open: state.open,
    optionIdPrefix,
    optionRefs,
    query: state.query,
    registerOption,
    selectItem: state.selectItem,
    setHighlightedIndex: state.setHighlightedIndex,
    setOpen: state.setOpen,
  };
};
