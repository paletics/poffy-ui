import type React from 'react';

/**
 * Screen coordinates for a context menu anchor point.
 *
 * ### Notes
 * Coordinates are viewport/client coordinates, matching `MouseEvent.clientX`
 * and `MouseEvent.clientY`.
 */
export interface ContextMenuPosition {
  x: number;
  y: number;
}

/**
 * Parameters for the shared context-menu positioning hook.
 */
export interface UseContextMenuParams {
  /** Whether the menu should be positioned and visible. */
  open: boolean;
  /** Called when Floating UI dismiss behavior requests closing the menu. */
  onClose: () => void;
  /** Viewport coordinates used as the virtual menu anchor. */
  position?: ContextMenuPosition;
  /** Optional real element used by Floating UI as virtual-anchor context. */
  target?: HTMLElement | null;
}

/**
 * Typed props returned for the floating menu element.
 */
export interface ContextMenuFloatingProps {
  ref: (node: HTMLElement | null) => void;
  style: React.CSSProperties;
  onKeyDown?: React.KeyboardEventHandler<HTMLElement>;
  [key: string]: unknown;
}

/**
 * Return shape for the shared context-menu positioning hook.
 */
export interface UseContextMenuReturn {
  menuProps: ContextMenuFloatingProps;
}

/**
 * Return shape for the shared context-menu trigger hook.
 */
export interface UseContextMenuTriggerReturn {
  open: boolean;
  position: ContextMenuPosition;
  target: HTMLElement | null;
  onContextMenu: React.MouseEventHandler<HTMLElement>;
  onClose: () => void;
}
