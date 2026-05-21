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
 * ### Notes
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
  const rootRef = useRef<HTMLDivElement | null>(null);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
    setFocusedIndex(-1);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDownOutside = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMenu();
      }
    };

    document.addEventListener('mousedown', handlePointerDownOutside);
    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('mousedown', handlePointerDownOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [closeMenu, isOpen]);

  const toggleMenu = useCallback(() => {
    if (disabled) return;

    setIsOpen((prev) => !prev);
    setFocusedIndex(-1);
  }, [disabled]);

  const onMenuItemClick = useCallback(
    (itemIndex: number) => {
      const item = items[itemIndex];
      if (!item || item.disabled) return;

      item.onClick?.();
      closeMenu();
    },
    [closeMenu, items],
  );

  const onMenuKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLElement>) => {
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
    [closeMenu, focusedIndex, items, onMenuItemClick],
  );

  return {
    focusedIndex,
    isOpen,
    rootRef,
    closeMenu,
    onMenuItemClick,
    onMenuKeyDown,
    setFocusedIndex,
    toggleMenu,
  };
};
