'use client';

import {
  autoUpdate,
  flip,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useListNavigation,
  useRole,
  useTypeahead,
} from '@floating-ui/react';
import { useCallback, useRef, useState } from 'react';
import type { UseDropdownOptions, UseDropdownReturn } from './useDropdown.types';

/**
 * Shared non-visual dropdown state and accessibility behavior backed by Floating UI.
 *
 * ### Notes
 * This hook owns menu open state, active item index, Floating UI positioning,
 * outside dismiss, menu role props, arrow-key list navigation, and typeahead.
 * React components should wrap it with trigger/list/item DOM, labels, focus
 * styling, selected item semantics, and form submission when the dropdown
 * represents a field value. Controlled consumers pass `open` and commit changes
 * from `onOpenChange`; uncontrolled consumers omit `open`.
 */
export const useDropdown = ({
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: UseDropdownOptions): UseDropdownReturn => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [disabledIndices, setDisabledIndices] = useState<number[]>([]);

  const listRef = useRef<(HTMLElement | null)[]>([]);
  const listItemsRef = useRef<string[]>([]);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const handleOpenChange = useCallback(
    (newOpen: boolean) => {
      if (isControlled) {
        controlledOnOpenChange?.(newOpen);
      } else {
        setUncontrolledOpen(newOpen);
        controlledOnOpenChange?.(newOpen);
      }

      if (!newOpen) {
        setActiveIndex(null);
        setDisabledIndices([]);
      }
    },
    [controlledOnOpenChange, isControlled],
  );

  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: handleOpenChange,
    transform: false,
    middleware: [offset(8), flip(), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: 'menu' });

  const setDisabledIndex = useCallback((index: number, disabled: boolean) => {
    setDisabledIndices((prev) => {
      if (disabled) {
        return prev.includes(index) ? prev : [...prev, index].sort((a, b) => a - b);
      }

      return prev.filter((item) => item !== index);
    });
  }, []);

  const listNavigation = useListNavigation(context, {
    listRef,
    activeIndex,
    onNavigate: setActiveIndex,
    loop: true,
    disabledIndices,
  });

  const typeahead = useTypeahead(context, {
    listRef: listItemsRef,
    activeIndex,
    onMatch: setActiveIndex,
  });

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([
    click,
    dismiss,
    role,
    listNavigation,
    typeahead,
  ]);

  return {
    open,
    onOpenChange: handleOpenChange,
    refs,
    floatingStyles,
    context,
    getReferenceProps,
    getFloatingProps,
    getItemProps,
    activeIndex,
    setDisabledIndex,
    listRef,
    listItemsRef,
  };
};
