import { NavigationAppearance, PrimitiveProps } from '@poffy-ui/types';
import type { ReactElement, ReactNode, RefAttributes } from 'react';
import type { PortalTargetProps } from '@/providers/PortalProvider.types';
import type { Placement, Strategy } from '@floating-ui/react';
import type {
  DefaultHostProps,
  RetargetedAsChildHostProps,
} from '@/components/shared/polymorphicAsChild.types';
import type { DelegatedButtonHostProps } from '@/components/shared/buttonDelegation';


interface DropdownBaseRootProps {
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

  /** Preferred menu placement relative to the trigger. */
  placement?: Placement;
  /** Distance in pixels between trigger and menu. */
  offset?: number;
  /** Viewport collision padding in pixels. */
  collisionPadding?: number;
  /** CSS positioning strategy used by the floating menu. */
  strategy?: Strategy;
  /** Whether arrow-key navigation wraps at either end. */
  loop?: boolean;

  /**
   * Compound children, typically `DropdownTrigger` followed by `DropdownMenu`.
   */
  children: ReactNode;
}

/** Controlled Dropdown state. */
export interface ControlledDropdownRootProps extends DropdownBaseRootProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/** Dropdown-owned state with optional change notifications. */
export interface UncontrolledDropdownRootProps extends DropdownBaseRootProps {
  open?: never;
  onOpenChange?: (open: boolean) => void;
}

/** Public props for DropdownRoot. */
export type DropdownRootProps = ControlledDropdownRootProps | UncontrolledDropdownRootProps;

/**
 * Props for the DropdownTrigger component.
 *
 * ### Notes
 * Renders a button by default and registers itself as the Floating UI reference.
 * Native anchors are converted into non-navigating menu buttons. Opaque custom
 * components must render a button-compatible host and forward DOM props and refs;
 * link-like custom components fall back to the native button.
 */
export type DropdownTriggerProps = Omit<
  PrimitiveProps<'button'>,
  | 'aria-controls'
  | 'aria-disabled'
  | 'aria-expanded'
  | 'aria-haspopup'
  | 'role'
  | 'tabIndex'
  | 'type'
>;

/**
 * Props for the DropdownMenu component.
 *
 * ### Notes
 * Must be rendered inside `Dropdown`. The implementation supplies `role="menu"`,
 * focus management, portal placement, and Floating UI positioning.
 */
export type DropdownMenuProps = Omit<
  PrimitiveProps<'div', PortalTargetProps>,
  'aria-labelledby' | 'id' | 'role' | 'tabIndex'
>;

/**
 * Own props for a selectable DropdownItem.
 *
 * ### Notes
 * Items are keyboard reachable through roving focus and typeahead. Disabled items
 * remain visible but are skipped by keyboard navigation. The default button
 * surface reduces interactive or opaque child components to text fallback;
 * use plain text or non-interactive native presentation elements for item content.
 */
export interface DropdownItemBaseProps {
  /**
   * Whether the item is disabled.
   * @defaultValue false
   */
  disabled?: boolean;

  /** Explicit typeahead text, useful for icon-only or richly formatted items. */
  textValue?: string;

  /**
   * Callback fired when the item is selected (clicked).
   */
  onSelect?: () => void;
  /** Whether selecting this item closes the menu. @defaultValue true */
  closeOnSelect?: boolean;
}

/**
 * Props for the DropdownItem component.
 *
 * ### Notes
 * Renders a button by default. Use `asChild` to delegate to a router link for
 * navigation items while preserving menuitem semantics. A disabled native anchor
 * loses its destination; a disabled custom host with an explicit `href` or `to`
 * falls back to the native button.
 */
type DropdownItemNativeProps = Omit<
  PrimitiveProps<'button', DropdownItemBaseProps>,
  'aria-disabled' | 'id' | 'role' | 'tabIndex' | 'type'
>;
/** Props for DropdownItem rendered with its default host. */
export type DropdownItemDefaultProps = DefaultHostProps<DropdownItemNativeProps>;
type DropdownItemDelegatedBaseProps = DelegatedButtonHostProps<DropdownItemNativeProps>;
type DropdownItemRetargetedProps = RetargetedAsChildHostProps<
  DropdownItemDelegatedBaseProps,
  HTMLElement
>;
/** Props for DropdownItem delegated to an asChild host. */
export type DropdownItemAsChildProps = Omit<DropdownItemRetargetedProps, 'onSelect'> &
  Pick<DropdownItemBaseProps, 'onSelect'>;
/** Public props for DropdownItem. */
export type DropdownItemProps = DropdownItemDefaultProps | DropdownItemAsChildProps;

/** Callable DropdownItem contract preserving default and delegated HTML refs. */
export interface DropdownItemComponent {
  (props: DropdownItemDefaultProps & RefAttributes<HTMLButtonElement>): ReactElement | null;
  (props: DropdownItemAsChildProps & RefAttributes<HTMLElement>): ReactElement | null;
  (
    props:
      | (DropdownItemDefaultProps & RefAttributes<HTMLButtonElement>)
      | (DropdownItemAsChildProps & RefAttributes<HTMLElement>),
  ): ReactElement | null;
}

/**
 * Props for the DropdownSeparator component.
 *
 * ### Notes
 * Decorative separator inside `DropdownMenu`; do not make it focusable.
 */
export type DropdownSeparatorProps = Omit<
  PrimitiveProps<'div'>,
  'contentEditable' | 'role' | 'tabIndex'
>;

/**
 * Props for the DropdownLabel component.
 *
 * ### Notes
 * Non-interactive text label inside `DropdownMenu`; use it to group menu
 * actions, not as a selectable item.
 */
export type DropdownLabelProps = Omit<
  PrimitiveProps<'div'>,
  'contentEditable' | 'role' | 'tabIndex'
>;
