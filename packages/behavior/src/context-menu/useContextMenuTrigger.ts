'use client';

import { useCallback, useState } from 'react';
import type { ContextMenuPosition, UseContextMenuTriggerReturn } from './useContextMenu.types';

/**
 * Shared open-state and anchor tracking for context-menu triggers.
 *
 * Attach `onContextMenu` to the element that should open the menu. The handler
 * prevents the browser context menu, stores the trigger element, and records
 * viewport coordinates for `useContextMenu`. Attach the returned `onKeyDown`
 * handler as well to support the Context Menu key and Shift+F10.
 */
export const useContextMenuTrigger = (): UseContextMenuTriggerReturn => {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<ContextMenuPosition>({ x: 0, y: 0 });
  const [target, setTarget] = useState<HTMLElement | null>(null);

  const openAt = useCallback((nextTarget: HTMLElement, nextPosition: ContextMenuPosition) => {
    setTarget(nextTarget);
    setOpen(true);
    setPosition(nextPosition);
  }, []);

  const onContextMenu = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      event.preventDefault();
      openAt(event.currentTarget, { x: event.clientX, y: event.clientY });
    },
    [openAt],
  );

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLElement>) => {
      const isContextMenuKey = event.key === 'ContextMenu';
      const isShiftF10 = event.shiftKey && event.key === 'F10';
      if (!isContextMenuKey && !isShiftF10) return;

      event.preventDefault();
      const rect = event.currentTarget.getBoundingClientRect();
      openAt(event.currentTarget, { x: rect.left, y: rect.bottom });
    },
    [openAt],
  );

  const onClose = useCallback(() => {
    setOpen(false);
    setTarget(null);
  }, []);

  return {
    open,
    position,
    target,
    onContextMenu,
    onKeyDown,
    onClose,
  };
};
