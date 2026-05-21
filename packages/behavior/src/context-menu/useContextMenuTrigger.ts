'use client';

import { useCallback, useState } from 'react';
import type { ContextMenuPosition, UseContextMenuTriggerReturn } from './useContextMenu.types';

/**
 * Shared open-state and anchor tracking for context-menu triggers.
 *
 * ### Notes
 * Attach `onContextMenu` to the element that should open the menu. The handler
 * prevents the browser context menu, stores the trigger element, and records
 * viewport coordinates for `useContextMenu`. React components should still
 * expose keyboard access, usually by opening the same menu from a dedicated
 * button or an application-level shortcut.
 */
export const useContextMenuTrigger = (): UseContextMenuTriggerReturn => {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<ContextMenuPosition>({ x: 0, y: 0 });
  const [target, setTarget] = useState<HTMLElement | null>(null);

  const onContextMenu = useCallback((event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    setTarget(event.currentTarget);
    setOpen(true);
    setPosition({ x: event.clientX, y: event.clientY });
  }, []);

  const onClose = useCallback(() => {
    setOpen(false);
    setTarget(null);
  }, []);

  return {
    open,
    position,
    target,
    onContextMenu,
    onClose,
  };
};
