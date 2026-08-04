import type { CommandMenuBehaviorItem } from './command-menu.types';

/** Non-wrapping command-menu highlight movement. */
export type CommandMenuHighlightDirection = 'first' | 'last' | 'next' | 'previous';

/** Keyboard fields consumed by {@link getCommandMenuKeyboardIntent}. */
export interface CommandMenuKeyboardInput {
  /** Ignore keys delivered during IME composition. */
  isComposing?: boolean;
  /** DOM key value. */
  key: string;
  /** Legacy key code; `229` also marks an IME composition event. */
  keyCode?: number;
}

/** Interpreted navigation or selection action, or `null` for unrelated/composing keys. */
export type CommandMenuKeyboardIntent =
  | { type: 'move'; direction: CommandMenuHighlightDirection }
  | { type: 'select' }
  | null;

interface UseCommandMenuStateBaseOptions<TItem extends CommandMenuBehaviorItem> {
  /** Whether selection requests close after notifying `onSelectItem`. @defaultValue true */
  closeOnSelect?: boolean;
  /** Forces exposed `open` to false and makes selection a no-op. */
  disabled?: boolean;
  /** Full source collection; filtering preserves its items and duplicate ids. */
  items: readonly TItem[];
  /** Optional locale used for case-insensitive query matching. */
  locale?: string;
  /** Receives an enabled item before the optional close request. */
  onSelectItem?: (item: TItem) => void;
}

/** Consumer-owned command-menu visibility. */
export interface ControlledUseCommandMenuOpenState {
  defaultOpen?: never;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

/** Hook-owned command-menu visibility with optional change notifications. */
export interface UncontrolledUseCommandMenuOpenState {
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  open?: never;
}

/** Visibility ownership configuration for a command menu. */
export type UseCommandMenuOpenState =
  | ControlledUseCommandMenuOpenState
  | UncontrolledUseCommandMenuOpenState;

/** Consumer-owned command-menu query. */
export interface ControlledUseCommandMenuQueryState {
  defaultQuery?: never;
  onQueryChange: (query: string) => void;
  query: string;
}

/** Hook-owned command-menu query with optional change notifications. */
export interface UncontrolledUseCommandMenuQueryState {
  defaultQuery?: string;
  onQueryChange?: (query: string) => void;
  query?: never;
}

/** Query ownership configuration for a command menu. */
export type UseCommandMenuQueryState =
  | ControlledUseCommandMenuQueryState
  | UncontrolledUseCommandMenuQueryState;

/** Public command-menu behavior options with independently paired state axes. */
export type UseCommandMenuStateOptions<TItem extends CommandMenuBehaviorItem> =
  UseCommandMenuStateBaseOptions<TItem> & UseCommandMenuOpenState & UseCommandMenuQueryState;

/** Filtered command items, state snapshots, and operations for selection and keyboard highlighting. */
export interface UseCommandMenuStateReturn<TItem extends CommandMenuBehaviorItem> {
  /** Enabled highlighted item, or `undefined` while closed or without a valid highlight. */
  activeItem: TItem | undefined;
  /** Current query results in source order. */
  filteredItems: TItem[];
  /** Enabled highlighted result index, or `-1` without one. */
  highlightedIndex: number;
  /** Whether the query axis is presently externally controlled. */
  isQueryControlled: boolean;
  /** Moves without wrapping and skips disabled commands. */
  moveHighlight: (direction: CommandMenuHighlightDirection) => void;
  /** Effective visibility; always false while disabled. */
  open: boolean;
  /** Current controlled or hook-owned query. */
  query: string;
  /** Notifies for an enabled item and requests close when `closeOnSelect` is true. */
  selectItem: (item: TItem) => void;
  /** Directly replaces the highlight index; callers must keep it compatible with rendered results. */
  setHighlightedIndex: (nextIndex: number | ((index: number) => number)) => void;
  /** Requests visibility; disabled menus ignore requests to open. */
  setOpen: (open: boolean) => void;
  /** Requests a query change; uncontrolled changes reset the highlight to the first enabled result. */
  setQuery: (query: string) => void;
}
