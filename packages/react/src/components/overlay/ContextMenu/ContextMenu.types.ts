import { PoffyBrand } from '@/providers';
import { ContextMenuVariantProps } from '@/styled-system/recipes';
import type { MotionPrimitiveProps } from '@/types/motion';
import type { KeyboardEvent, MouseEvent, ReactNode } from 'react';
import type { OverlayTransitionType } from '../../animations/OverlayTransition/OverlayTransition.presets';

/**
 * Types of context menu items.
 */
export type ContextMenuItemType = 'item' | 'separator' | 'submenu';

/**
 * Definition of a single item within ContextMenu.
 *
 * Do: provide stable `id` values when items can reorder. Don't: rely on
 * `children` submenu behavior yet; nested menu rendering is intentionally not
 * implemented.
 */
export interface ContextMenuItem {
  /** Unique identifier for the item. */
  id?: string;
  /** The type of menu item. @defaultValue 'item' */
  type?: ContextMenuItemType;
  /** The content to display for the item. */
  label?: ReactNode;
  /** Optional icon to display alongside the label. */
  icon?: ReactNode;
  /** Optional keyboard shortcut hints. */
  shortcut?: string;
  /** Whether the item is interactive. */
  disabled?: boolean;
  /** Whether the item represents a destructive action. */
  danger?: boolean;
  /** Callback fired when the item is clicked or activated via keyboard. */
  onClick?: (e: MouseEvent<HTMLElement> | KeyboardEvent) => void;
  /** Custom CSS class name for the item container. */
  className?: string;
  /**
   * Sub-menu items for nested menus.
   *
   * Future behavior: this is not yet implemented. Passing this field has no
   * effect; the `submenu` type currently only renders a trailing arrow
   * indicator.
   */
  children?: ContextMenuItem[];
}

/**
 * Props for ContextMenu.
 *
 * ContextMenu is fully controlled: pass `open`, `onClose`, `items`, and a
 * screen `position` or `target` anchor. It renders a portalled `role="menu"`
 * surface with roving focus for enabled menu items.
 *
 * Accessibility: menu items should represent actions. Separators are skipped
 * by keyboard navigation, and disabled items are not focusable.
 *
 * Do: close the menu from item handlers after completing an action. Don't:
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
export interface ContextMenuProps extends MotionPrimitiveProps<'div'> {
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
  /** The screen coordinates { x, y } where the menu should be positioned. */
  position?: { x: number; y: number };
  /** The reference element to anchor the floating menu. */
  target?: HTMLElement | null;
}

/**
 * Public ContextMenu props including recipe variants.
 */
export type ContextMenuCombinedProps = ContextMenuProps & ContextMenuVariantProps;
