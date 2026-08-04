import type React from 'react';

/**
 * Screen coordinates for a context menu anchor point.
 *
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
  /**
   * Called when Floating UI's outside-press dismissal requests closing the menu. Escape is
   * deliberately left to the component so its own key handler can cancel that action.
   */
  onClose: () => void;
  /** Viewport coordinates used as the virtual menu anchor. */
  position?: ContextMenuPosition;
  /** Optional real element used by Floating UI as virtual-anchor context. */
  target?: HTMLElement | null;
  /** Internal Floating UI node ID supplied by the React overlay wrapper. */
  nodeId?: string;
}

/**
 * Typed props returned for the floating menu element.
 */
export interface ContextMenuFloatingProps {
  /** Attach this callback to the positioned menu element. */
  ref: (node: HTMLElement | null) => void;
  /** Fixed-position styles, initially hidden until Floating UI has calculated a position. */
  style: React.CSSProperties;
  onKeyDown?: React.KeyboardEventHandler<HTMLElement>;
  [key: string]: unknown;
}

/**
 * Return shape for the shared context-menu positioning hook.
 */
export interface UseContextMenuReturn {
  /** Spread these props onto the floating menu element. */
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
  /** Opens the menu for the Context Menu key or Shift+F10. */
  onKeyDown: React.KeyboardEventHandler<HTMLElement>;
  onClose: () => void;
}
