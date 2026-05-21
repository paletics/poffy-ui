import type { FloatingContext, useFloating, useInteractions } from '@floating-ui/react';
import type { CSSProperties, HTMLProps, RefObject } from 'react';

/**
 * Public options for the shared dropdown behavior hook.
 *
 * ### Notes
 * `open` controls visibility when provided. Without it, the hook starts closed
 * and owns visibility internally while still notifying `onOpenChange`.
 */
export interface UseDropdownOptions {
  /**
   * Controlled open state.
   *
   * @defaultValue `undefined` (uncontrolled, initially closed)
   */
  open?: boolean;
  /** Callback fired whenever the hook requests an open-state change. */
  onOpenChange?: (open: boolean) => void;
}

/**
 * Shared non-visual dropdown state returned by the behavior hook.
 *
 * ### Notes
 * Spread `getReferenceProps`, `getFloatingProps`, and `getItemProps` onto the
 * matching trigger, menu, and item elements. Register each item element in
 * `listRef` and text label in `listItemsRef` so keyboard navigation and
 * typeahead stay aligned with rendered order.
 */
export interface UseDropdownReturn {
  /** Current open state after controlled/uncontrolled resolution. */
  open: boolean;
  /** Requests a visibility change and resets active/disabled item state on close. */
  onOpenChange: (newOpen: boolean) => void;
  /** Floating UI reference and floating element refs. */
  refs: ReturnType<typeof useFloating>['refs'];
  /** Positioning styles for the floating menu element. */
  floatingStyles: CSSProperties;
  /** Floating UI interaction context shared by the returned prop getters. */
  context: FloatingContext;
  /** Props for the trigger/reference element. */
  getReferenceProps: (userProps?: HTMLProps<Element>) => Record<string, unknown>;
  /** Props for the floating menu element, including menu role and dismiss handlers. */
  getFloatingProps: ReturnType<typeof useInteractions>['getFloatingProps'];
  /** Props for each menu item, including keyboard navigation handlers. */
  getItemProps: ReturnType<typeof useInteractions>['getItemProps'];
  /** Index of the item currently active by keyboard navigation or typeahead. */
  activeIndex: number | null;
  /** Marks an item index as disabled so keyboard navigation skips it. */
  setDisabledIndex: (index: number, disabled: boolean) => void;
  /** Ordered item element refs consumed by Floating UI list navigation. */
  listRef: RefObject<(HTMLElement | null)[]>;
  /** Ordered item text labels consumed by Floating UI typeahead. */
  listItemsRef: RefObject<string[]>;
}
