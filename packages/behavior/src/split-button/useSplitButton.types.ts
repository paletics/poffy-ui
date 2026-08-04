import type React from 'react';
import type { MutableRefObject } from 'react';

/**
 * Menu item descriptor consumed by split button behavior.
 */
export interface SplitButtonBehaviorItem {
  /** Whether the item is skipped by keyboard navigation and click handling. */
  disabled?: boolean;
  /** Callback fired when the item is activated. */
  onClick?: () => void;
}

/**
 * Options for `useSplitButton`.
 */
export interface UseSplitButtonOptions {
  /**
   * Whether the entire split button interaction is disabled.
   *
   * @defaultValue `false`
   */
  disabled?: boolean;
  /** Menu items controlled by the split button. */
  items: SplitButtonBehaviorItem[];
}

/**
 * State and event handlers returned by `useSplitButton`.
 */
export interface UseSplitButtonReturn {
  /**
   * Index the renderer should focus or mark active, or `-1` when none is requested. The hook does
   * not move DOM focus itself.
   */
  focusedIndex: number;
  /** Whether the menu is open. */
  isOpen: boolean;
  /** Ref for the split button root element used to detect outside pointer closes. */
  rootRef: MutableRefObject<HTMLDivElement | null>;
  /** Ref for the portalled menu, included in outside-pointer containment checks. */
  menuRef: MutableRefObject<HTMLElement | null>;
  /** Closes the menu and clears the requested focused index. */
  closeMenu: () => void;
  /** Activates an enabled menu item by index and closes the menu. */
  onMenuItemClick: (itemIndex: number) => void;
  /** Handles ArrowUp/ArrowDown focus movement, Enter/Space activation, and Escape close. */
  onMenuKeyDown: (event: React.KeyboardEvent<HTMLElement>) => void;
  /**
   * Replaces the requested focused item index without validating it against the current item list.
   * Renderers normally use enabled item indices.
   */
  setFocusedIndex: (index: number) => void;
  /** Toggles menu visibility unless the split button is disabled. */
  toggleMenu: () => void;
}
