/** Positions an externally controlled context menu at viewport coordinates. */
export { useContextMenu } from './useContextMenu';

/** Supplies open state and pointer/keyboard trigger handlers for a context menu. */
export { useContextMenuTrigger } from './useContextMenuTrigger';

/** Public position, trigger, floating-props, and hook-return contracts for context menus. */
export type {
  ContextMenuFloatingProps,
  ContextMenuPosition,
  UseContextMenuParams,
  UseContextMenuReturn,
  UseContextMenuTriggerReturn,
} from './useContextMenu.types';
