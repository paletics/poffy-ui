import type {
  FloatingContext,
  Placement,
  Strategy,
  useFloating,
  useInteractions,
} from '@floating-ui/react';
import type { CSSProperties, HTMLProps, MutableRefObject } from 'react';

/**
 * Public options for the shared dropdown behavior hook.
 *
 * `open` controls visibility when provided. Without it, the hook starts closed
 * and owns visibility internally while still notifying `onOpenChange`.
 */
interface UseDropdownBaseOptions {
  /** Internal Floating UI node ID supplied by a React wrapper. */
  nodeId?: string;
  /**
   * Preferred floating placement.
   *
   * @defaultValue `'bottom-start'`
   */
  placement?: Placement;
  /**
   * Distance in pixels between trigger and menu. Non-finite values use the default.
   *
   * @defaultValue `8`
   */
  offset?: number;
  /**
   * Viewport collision padding in pixels. Negative or non-finite values use the default.
   *
   * @defaultValue `8`
   */
  collisionPadding?: number;
  /**
   * CSS positioning strategy.
   *
   * @defaultValue `'absolute'`
   */
  strategy?: Strategy;
  /**
   * Whether arrow-key navigation wraps at either end.
   *
   * @defaultValue `true`
   */
  loop?: boolean;
}

/** Controlled dropdown behavior state. */
export interface ControlledUseDropdownOptions extends UseDropdownBaseOptions {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/** Hook-owned dropdown state with optional change notifications. */
export interface UncontrolledUseDropdownOptions extends UseDropdownBaseOptions {
  open?: never;
  onOpenChange?: (open: boolean) => void;
}

/**
 * Options for `useDropdown`, selecting controlled or hook-owned visibility.
 *
 * Runtime input that supplies `open` without `onOpenChange` warns in development and uses that
 * value only as the initial uncontrolled state; TypeScript callers should use one of the two
 * branches above instead.
 */
export type UseDropdownOptions = ControlledUseDropdownOptions | UncontrolledUseDropdownOptions;

/**
 * One rendered dropdown item in DOM order.
 * `reconcileItems` needs the matching element, typeahead label, and disabled state in the same
 * snapshot so Floating UI keyboard navigation cannot drift from the rendered collection.
 */
export interface DropdownCollectionItem {
  element: HTMLElement;
  label: string | null;
  disabled: boolean;
}

/**
 * Shared non-visual dropdown state returned by the behavior hook.
 *
 * Spread `getReferenceProps`, `getFloatingProps`, and `getItemProps` onto the
 * matching trigger, menu, and item elements. Call `reconcileItems` with one
 * ordered item snapshot so keyboard navigation and typeahead stay aligned.
 */
export interface UseDropdownReturn {
  /** Current open state after controlled/uncontrolled resolution. */
  open: boolean;
  /** Requests a visibility change. The active item resets after the menu closes. */
  onOpenChange: (newOpen: boolean) => void;
  /** Floating UI reference and floating element refs. */
  refs: ReturnType<typeof useFloating>['refs'];
  /**
   * Positioning styles for the floating menu element. The hook also writes
   * `--floating-available-width` and `--floating-available-height` to that element.
   */
  floatingStyles: CSSProperties;
  /** Floating UI interaction context shared by the returned prop getters. */
  context: FloatingContext;
  /** Props for the trigger/reference element. */
  getReferenceProps: (userProps?: HTMLProps<Element>) => Record<string, unknown>;
  /** Props for the floating menu element, including menu role and dismiss handlers. */
  getFloatingProps: ReturnType<typeof useInteractions>['getFloatingProps'];
  /** Props for each menu item, including keyboard navigation handlers. */
  getItemProps: ReturnType<typeof useInteractions>['getItemProps'];
  /** Index active by keyboard navigation or typeahead, or `null` while closed or unhighlighted. */
  activeIndex: number | null;
  /**
   * Replaces the ordered item snapshot while preserving the active DOM item when it remains
   * enabled; otherwise clears the active index.
   */
  reconcileItems: (items: DropdownCollectionItem[]) => void;
  /** Ordered item element refs consumed by Floating UI list navigation. */
  listRef: MutableRefObject<(HTMLElement | null)[]>;
  /** Ordered item text labels consumed by Floating UI typeahead. */
  listItemsRef: MutableRefObject<(string | null)[]>;
}
