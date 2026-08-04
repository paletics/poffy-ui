'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type {
  SplitButtonBehaviorItem,
  UseSplitButtonOptions,
  UseSplitButtonReturn,
} from './useSplitButton.types';

const getEnabledIndices = (items: SplitButtonBehaviorItem[]): number[] =>
  items.flatMap((item, index) => (item.disabled ? [] : index));

const getNextArrowDownIndex = (enabledIndices: number[], focusedIndex: number): number => {
  if (enabledIndices.length === 0) return -1;

  const currentPosition = enabledIndices.indexOf(focusedIndex);
  if (currentPosition === -1 || currentPosition === enabledIndices.length - 1) {
    return enabledIndices[0] ?? -1;
  }

  return enabledIndices[currentPosition + 1] ?? -1;
};

const getNextArrowUpIndex = (enabledIndices: number[], focusedIndex: number): number => {
  if (enabledIndices.length === 0) return -1;

  const currentPosition = enabledIndices.indexOf(focusedIndex);
  if (currentPosition <= 0) {
    return enabledIndices[enabledIndices.length - 1] ?? -1;
  }

  return enabledIndices[currentPosition - 1] ?? -1;
};

/**
 * Shared menu state and keyboard interactions for split buttons.
 *
 * This hook owns disclosure state, focused menu index, outside-pointer close,
 * Escape close, and ArrowUp/ArrowDown/Enter/Space menu-item activation. React
 * split-button components should wrap it with the primary action button, menu
 * trigger, `aria-haspopup`, `aria-expanded`, `role="menu"`, `role="menuitem"`,
 * focus restoration, and visible labels for both actions.
 */
export const useSplitButton = ({
  disabled = false,
  items,
}: UseSplitButtonOptions): UseSplitButtonReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [previousDisabled, setPreviousDisabled] = useState(disabled);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLElement | null>(null);

  if (disabled !== previousDisabled) {
    setPreviousDisabled(disabled);
    if (disabled) {
      setIsOpen(false);
      setFocusedIndex(-1);
    }
  }

  const closeMenu = useCallback(() => {
    setIsOpen(false);
    setFocusedIndex(-1);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const ownerDocument =
      rootRef.current?.ownerDocument ?? (typeof document === 'undefined' ? undefined : document);
    if (!ownerDocument) return;

    const handlePointerDownOutside = (event: MouseEvent) => {
      const eventPath = event.composedPath();
      const isWithinRoot = rootRef.current ? eventPath.includes(rootRef.current) : false;
      const isWithinMenu = menuRef.current ? eventPath.includes(menuRef.current) : false;
      if (isWithinRoot || isWithinMenu) return;

      const target = event.target;
      const NodeConstructor = ownerDocument.defaultView?.Node;
      if (
        NodeConstructor &&
        target instanceof NodeConstructor &&
        rootRef.current &&
        !rootRef.current.contains(target) &&
        !menuRef.current?.contains(target)
      ) {
        closeMenu();
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMenu();
      }
    };

    ownerDocument.addEventListener('mousedown', handlePointerDownOutside);
    ownerDocument.addEventListener('keydown', handleEscapeKey);
    return () => {
      ownerDocument.removeEventListener('mousedown', handlePointerDownOutside);
      ownerDocument.removeEventListener('keydown', handleEscapeKey);
    };
  }, [closeMenu, isOpen]);

  const toggleMenu = useCallback(() => {
    if (disabled) return;

    setIsOpen((prev) => !prev);
    setFocusedIndex(-1);
  }, [disabled]);

  const onMenuItemClick = useCallback(
    (itemIndex: number) => {
      if (disabled) return;
      const item = items[itemIndex];
      if (!item || item.disabled) return;

      item.onClick?.();
      closeMenu();
    },
    [closeMenu, disabled, items],
  );

  const onMenuKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLElement>) => {
      if (disabled) return;
      const enabledIndices = getEnabledIndices(items);

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          setFocusedIndex((currentIndex) => getNextArrowDownIndex(enabledIndices, currentIndex));
          break;
        case 'ArrowUp':
          event.preventDefault();
          setFocusedIndex((currentIndex) => getNextArrowUpIndex(enabledIndices, currentIndex));
          break;
        case 'Enter':
        case ' ':
          event.preventDefault();
          if (focusedIndex >= 0) {
            onMenuItemClick(focusedIndex);
          }
          break;
        case 'Escape':
          event.preventDefault();
          closeMenu();
          break;
      }
    },
    [closeMenu, disabled, focusedIndex, items, onMenuItemClick],
  );

  return {
    focusedIndex,
    isOpen,
    menuRef,
    rootRef,
    closeMenu,
    onMenuItemClick,
    onMenuKeyDown,
    setFocusedIndex,
    toggleMenu,
  };
};
