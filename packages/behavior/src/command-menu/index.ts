/** Search, grouping, active-descendant, and non-wrapping highlight helpers for command menus. */
export {
  filterCommandMenuItems,
  getCommandMenuActiveDescendant,
  getCommandMenuItemSearchText,
  getCommandMenuOptionId,
  getNextCommandMenuHighlight,
  groupCommandMenuItems,
} from './command-menu';
/** Registers a prioritized Ctrl/Cmd+K owner on an event target. */
export { registerCommandMenuShortcut } from './globalShortcutRegistry';

/** Converts relevant non-composing key input into command-menu navigation or selection intent. */
export { getCommandMenuKeyboardIntent } from './useCommandMenuState';

/** Coordinates independently controlled visibility/query state, filtering, highlight, and selection. */
export { useCommandMenuState } from './useCommandMenuState';
export type { CommandMenuShortcutRegistration } from './globalShortcutRegistry';
export type { CommandMenuBehaviorItem, CommandMenuGroup } from './command-menu.types';
export type {
  CommandMenuHighlightDirection,
  CommandMenuKeyboardInput,
  CommandMenuKeyboardIntent,
  ControlledUseCommandMenuOpenState,
  ControlledUseCommandMenuQueryState,
  UncontrolledUseCommandMenuOpenState,
  UncontrolledUseCommandMenuQueryState,
  UseCommandMenuOpenState,
  UseCommandMenuQueryState,
  UseCommandMenuStateOptions,
  UseCommandMenuStateReturn,
} from './useCommandMenuState.types';
