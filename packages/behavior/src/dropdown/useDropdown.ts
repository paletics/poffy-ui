'use client';

import {
  autoUpdate,
  flip,
  offset as floatingOffset,
  shift,
  size,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useListNavigation,
  useRole,
  useTypeahead,
} from '@floating-ui/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useControllableState } from '../hooks/state';
import type {
  DropdownCollectionItem,
  UseDropdownOptions,
  UseDropdownReturn,
} from './useDropdown.types';

interface RuntimeEnv {
  process?: { env?: Record<string, string | undefined> };
}

/**
 * Shared non-visual dropdown state and accessibility behavior backed by Floating UI.
 *
 * This hook owns menu open state, active item index, Floating UI positioning,
 * outside-press and Escape dismissal, menu role props, arrow-key list navigation, and typeahead.
 * React components should wrap it with trigger/list/item DOM, labels, focus
 * styling, selected item semantics, and form submission when the dropdown
 * represents a field value. Controlled consumers pass `open` and commit changes
 * from `onOpenChange`; uncontrolled consumers omit `open`.
 * `reconcileItems` must receive each rendered item in DOM order after a collection change.
 */
export const useDropdown = ({
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  nodeId,
  placement = 'bottom-start',
  offset = 8,
  collisionPadding = 8,
  strategy = 'absolute',
  loop = true,
}: UseDropdownOptions): UseDropdownReturn => {
  const hasControlledHandler = typeof controlledOnOpenChange === 'function';
  useEffect(() => {
    if (controlledOpen === undefined || hasControlledHandler) return;
    if ((globalThis as RuntimeEnv).process?.env?.['NODE_ENV'] === 'production') return;
    console.warn(
      '[useDropdown] `open` without `onOpenChange` falls back to uncontrolled initial state.',
    );
  }, [controlledOpen, hasControlledHandler]);
  const {
    value: open,
    isControlled,
    setValue: setUncontrolledOpen,
  } = useControllableState({
    value: hasControlledHandler ? controlledOpen : undefined,
    defaultValue: !hasControlledHandler && controlledOpen !== undefined ? controlledOpen : false,
  });
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [disabledIndices, setDisabledIndices] = useState<number[]>([]);
  const [previousOpen, setPreviousOpen] = useState(open);
  const activeIndexRef = useRef(activeIndex);

  if (open !== previousOpen) {
    setPreviousOpen(open);
    if (!open) setActiveIndex(null);
  }

  const handleActiveIndexChange = useCallback(
    (nextActiveIndex: number | null) => {
      const resolvedActiveIndex = open ? nextActiveIndex : null;
      activeIndexRef.current = resolvedActiveIndex;
      setActiveIndex(resolvedActiveIndex);
    },
    [open],
  );

  const listRef = useRef<(HTMLElement | null)[]>([]);
  const listItemsRef = useRef<(string | null)[]>([]);
  const resolvedOffset = Number.isFinite(offset) ? offset : 8;
  const resolvedCollisionPadding =
    Number.isFinite(collisionPadding) && collisionPadding >= 0 ? collisionPadding : 8;

  const handleOpenChange = useCallback(
    (newOpen: boolean) => {
      if (!newOpen && !isControlled) {
        handleActiveIndexChange(null);
      }
      if (isControlled) {
        controlledOnOpenChange?.(newOpen);
      } else {
        setUncontrolledOpen(newOpen);
        controlledOnOpenChange?.(newOpen);
      }
    },
    [controlledOnOpenChange, handleActiveIndexChange, isControlled, setUncontrolledOpen],
  );

  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: handleOpenChange,
    placement,
    strategy,
    transform: false,
    middleware: [
      floatingOffset(resolvedOffset),
      flip(),
      shift({ padding: resolvedCollisionPadding }),
      size({
        padding: resolvedCollisionPadding,
        apply({ availableHeight, availableWidth, elements }) {
          elements.floating.style.setProperty(
            '--floating-available-width',
            `${Math.max(0, availableWidth)}px`,
          );
          elements.floating.style.setProperty(
            '--floating-available-height',
            `${Math.max(0, availableHeight)}px`,
          );
        },
      }),
    ],
    whileElementsMounted: autoUpdate,
    nodeId,
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: 'menu' });

  const reconcileItems = useCallback(
    (items: DropdownCollectionItem[]) => {
      const activeElement =
        activeIndexRef.current === null ? null : listRef.current[activeIndexRef.current];
      const elements = items.map((item) => item.element);
      const labels = items.map((item) => item.label);
      const nextDisabledIndices = items.flatMap((item, index) => (item.disabled ? [index] : []));
      const activeItemIndex = activeElement ? elements.indexOf(activeElement) : -1;
      const nextActiveIndex =
        open && activeItemIndex >= 0 && !items[activeItemIndex]?.disabled ? activeItemIndex : -1;

      listRef.current = elements;
      listItemsRef.current = labels;
      setDisabledIndices((current) =>
        current.length === nextDisabledIndices.length &&
        current.every((index, position) => index === nextDisabledIndices[position])
          ? current
          : nextDisabledIndices,
      );
      const next = nextActiveIndex >= 0 ? nextActiveIndex : null;
      activeIndexRef.current = next;
      setActiveIndex((current) => {
        return current === next ? current : next;
      });
    },
    [open],
  );

  const listNavigation = useListNavigation(context, {
    listRef,
    activeIndex: open ? activeIndex : null,
    onNavigate: handleActiveIndexChange,
    loop,
    disabledIndices,
  });

  const typeahead = useTypeahead(context, {
    listRef: listItemsRef,
    activeIndex: open ? activeIndex : null,
    onMatch: handleActiveIndexChange,
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
    activeIndex: open ? activeIndex : null,
    reconcileItems,
    listRef,
    listItemsRef,
  };
};
