'use client';

import {
  autoUpdate,
  flip,
  offset,
  shift,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
  type VirtualElement,
} from '@floating-ui/react';
import { useCallback, useEffect, useMemo } from 'react';
import type React from 'react';
import type {
  ContextMenuFloatingProps,
  ContextMenuPosition,
  UseContextMenuParams,
  UseContextMenuReturn,
} from './useContextMenu.types';

const useVirtualAnchor = (
  position?: ContextMenuPosition | null,
  contextElement?: Element | null,
): VirtualElement | null => {
  const x = position?.x;
  const y = position?.y;

  return useMemo<VirtualElement | null>(() => {
    if (x == null || y == null) return null;

    return {
      getBoundingClientRect: () => ({
        width: 0,
        height: 0,
        x,
        y,
        top: y,
        left: x,
        right: x,
        bottom: y,
      }),
      contextElement: contextElement ?? undefined,
    };
  }, [contextElement, x, y]);
};

/**
 * Shared floating-positioning behavior for context menus.
 *
 * ### Notes
 * This hook does not own open state; callers pass the current state, anchor
 * coordinates, and `onClose`. It creates a virtual fixed-position anchor,
 * applies Floating UI menu role/dismiss behavior, and hides the menu until the
 * first positioning pass completes. React components should provide trigger
 * handling, item roles, keyboard item navigation, and focus restoration.
 */
export const useContextMenu = ({
  open,
  onClose,
  position,
  target,
}: UseContextMenuParams): UseContextMenuReturn => {
  const virtualElement = useVirtualAnchor(position, target);

  const { refs, floatingStyles, context, isPositioned } = useFloating<HTMLElement>({
    open,
    onOpenChange: (isOpen) => {
      if (!isOpen) onClose();
    },
    placement: 'bottom-start',
    strategy: 'fixed',
    middleware: [offset(2), flip(), shift({ padding: 10 })],
    whileElementsMounted: autoUpdate,
    transform: false,
  });

  const { setPositionReference } = refs;

  useEffect(() => {
    if (open) {
      setPositionReference(virtualElement as Element);
    }
  }, [open, setPositionReference, virtualElement]);

  const dismiss = useDismiss(context);
  const role = useRole(context, { role: 'menu' });
  const { getFloatingProps } = useInteractions([dismiss, role]);

  const setMenuRef = useCallback(
    (node: HTMLElement | null) => {
      refs.setFloating(node);
    },
    [refs],
  );

  return {
    menuProps: {
      ref: setMenuRef,
      style: {
        ...floatingStyles,
        visibility: isPositioned ? 'visible' : 'hidden',
      } as React.CSSProperties,
      ...getFloatingProps(),
    } as ContextMenuFloatingProps,
  };
};
