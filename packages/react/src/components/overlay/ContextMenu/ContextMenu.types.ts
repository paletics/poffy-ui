import { PoffyBrand } from '@/providers';
import type { MotionPrimitiveProps } from '@/types/motion';
import type { PortalTargetProps } from '@/providers/PortalProvider.types';
import type { KeyboardEvent, MouseEvent, ReactNode } from 'react';
import type { OverlayTransitionType } from '../../animations/OverlayTransition/OverlayTransition.presets';
import type { PortalOwnerDocument } from '../Portal/Portal.types';

/**
 * Types of context menu items.
 */
export type ContextMenuItemType = 'item' | 'separator';

/**
 * Definition of a single item within ContextMenu.
 *
 * Do: provide stable `id` values when items can reorder.
 */
interface ContextMenuItemBase {
  /** Unique identifier for the item. */
  id?: string;
  /** Custom CSS class name for the item container. */
  className?: string;
}

/** Action item with a required textual accessible name. */
interface ContextMenuActionItem extends ContextMenuItemBase {
  /** Action items are the default item type. */
  type?: 'item';
  /**
   * Visible and accessible action label. Rich presentation belongs in `icon`;
   * keeping the action label textual guarantees a stable menuitem name.
   */
  label: string;
  /** Optional non-interactive icon or presentation to display alongside the label. */
  icon?: ReactNode;
  /** Optional keyboard shortcut hints. */
  shortcut?: string;
  /** Whether the item is interactive. */
  disabled?: boolean;
  /** Whether the item represents a destructive action. */
  danger?: boolean;
  /** Callback fired when the item is clicked or activated via keyboard. */
  onClick?: (e: MouseEvent<HTMLElement> | KeyboardEvent) => void;
}

/** Non-interactive separator between groups of context-menu actions. */
interface ContextMenuSeparatorItem extends ContextMenuItemBase {
  type: 'separator';
}

/** Definition of an action or separator within ContextMenu. */
export type ContextMenuItem = ContextMenuActionItem | ContextMenuSeparatorItem;

/**
 * Props for ContextMenu.
 *
 * ContextMenu is fully controlled: pass `open`, `onClose`, `items`, and a
 * screen `position` or `target` anchor. An open menu cannot be unanchored.
 * It renders a portalled `role="menu"` surface with roving focus for enabled
 * menu items, preserving its owner document through an exit animation.
 * Pair it with `useContextMenuTrigger` on a focusable trigger and forward both
 * its `onContextMenu` and `onKeyDown` handlers so Context Menu and Shift+F10
 * keyboard invocation remain available.
 *
 * Accessibility: menu items should represent actions. Separators are skipped
 * by keyboard navigation, and disabled items are not focusable.
 *
 * Item handlers close the menu unless they prevent the event. Do: close the menu from item handlers after completing an action when retaining it is intentional. Don't:
 * put long-form interactive content inside a context menu; use Popover or
 * Modal for that.
 *
 * @example
 * ```tsx
 * import { ContextMenu } from '@poffy-ui/react/overlay';
 *
 * <ContextMenu
 *   open={open}
 *   onClose={() => setOpen(false)}
 *   position={{ x: event.clientX, y: event.clientY }}
 *   items={[{ id: 'edit', label: 'Edit', onClick: handleEdit }]}
 * />
 * ```
 */
interface ContextMenuBaseProps extends Omit<
  MotionPrimitiveProps<'div', PortalTargetProps>,
  'asChild' | 'children' | 'role'
> {
  /** Theme brand override. */
  brand?: PoffyBrand;
  /** Array of menu item definitions to render. */
  items: ContextMenuItem[];
  /** Whether the context menu is currently visible. */
  open: boolean;
  /** Callback fired when the context menu requests to close. */
  onClose: () => void;
  /**
   * The animation preset to use for the menu transition.
   * @defaultValue 'popover'
   */
  animationType?: OverlayTransitionType;
  /** Owner document used for coordinate-only menus rendered outside the global document. */
  ownerDocument?: PortalOwnerDocument;
}

/** Context-menu configuration anchored to explicit viewport coordinates. */
export interface CoordinateContextMenuProps extends ContextMenuBaseProps {
  /** The screen coordinates { x, y } where the menu should be positioned. */
  position: { x: number; y: number };
  /** Optional context element for the virtual anchor. */
  target?: HTMLElement | null;
}

/** Context-menu configuration anchored to a real element when no coordinates are available. */
export interface TargetContextMenuProps extends ContextMenuBaseProps {
  position?: never;
  /** The reference element to anchor the floating menu. */
  target: HTMLElement;
}

/** Closed context menu before a coordinate or target anchor has been established. */
export interface UnanchoredClosedContextMenuProps extends ContextMenuBaseProps {
  open: false;
  position?: never;
  target?: null;
}

/**
 * Context-menu public props. An open menu always has an explicit anchor, while
 * a closed menu may be mounted before its first invocation establishes one.
 */
export type ContextMenuProps =
  | CoordinateContextMenuProps
  | TargetContextMenuProps
  | UnanchoredClosedContextMenuProps;
