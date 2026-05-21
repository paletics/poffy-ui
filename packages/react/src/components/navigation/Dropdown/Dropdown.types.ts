import { NavigationAppearance, PrimitiveProps } from '@poffy-ui/types';
import { ReactNode } from 'react';

/**
 * Props for the root Dropdown component.
 *
 * @example
 * ```tsx
 * import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@poffy-ui/react/navigation';
 * ```
 *
 * ### Notes
 * Required compound structure: render one `DropdownTrigger` and one
 * `DropdownMenu` inside `Dropdown`; render `DropdownItem`, `DropdownLabel`, and
 * `DropdownSeparator` inside the menu. The root renders no DOM node.
 *
 * ### AI Usage
 * - Do: use for command menus attached to a trigger.
 * - Don't: use for form selection; use a select/listbox component instead.
 */
export interface DropdownRootProps {
  /**
   * Size variant of the dropdown elements.
   * @defaultValue 'md'
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Public menu surface treatment.
   * @defaultValue 'soft'
   */
  appearance?: Extract<NavigationAppearance, 'soft' | 'outline'>;

  /**
   * Whether the dropdown is open (controlled state).
   */
  open?: boolean;

  /**
   * Callback fired when the open state changes.
   */
  onOpenChange?: (open: boolean) => void;

  /**
   * Compound children, typically `DropdownTrigger` followed by `DropdownMenu`.
   */
  children: ReactNode;
}

/**
 * Props for the DropdownTrigger component.
 *
 * ### Notes
 * Renders a button by default and registers itself as the Floating UI reference.
 * Use `asChild` for router links or custom button components that can accept ARIA
 * and event props.
 */
export type DropdownTriggerProps = PrimitiveProps<'button'>;

/**
 * Props for the DropdownMenu component.
 *
 * ### Notes
 * Must be rendered inside `Dropdown`. The implementation supplies `role="menu"`,
 * focus management, portal placement, and Floating UI positioning.
 */
export type DropdownMenuProps = PrimitiveProps<'div'>;

/**
 * Own props for a selectable DropdownItem.
 *
 * ### Notes
 * Items are keyboard reachable through roving focus and typeahead. Disabled items
 * remain visible but are skipped by keyboard navigation.
 */
export interface DropdownItemBaseProps {
  /**
   * Whether the item is disabled.
   * @defaultValue false
   */
  disabled?: boolean;

  /**
   * Callback fired when the item is selected (clicked).
   */
  onSelect?: () => void;
}

/**
 * Props for the DropdownItem component.
 *
 * ### Notes
 * Renders a button by default. Use `asChild` to delegate to a router link for
 * navigation items while preserving menuitem semantics.
 */
export type DropdownItemProps = PrimitiveProps<'button', DropdownItemBaseProps>;

/**
 * Props for the DropdownSeparator component.
 *
 * ### Notes
 * Decorative separator inside `DropdownMenu`; do not make it focusable.
 */
export type DropdownSeparatorProps = PrimitiveProps<'div'>;

/**
 * Props for the DropdownLabel component.
 *
 * ### Notes
 * Non-interactive text label inside `DropdownMenu`; use it to group menu
 * actions, not as a selectable item.
 */
export type DropdownLabelProps = PrimitiveProps<'div'>;
