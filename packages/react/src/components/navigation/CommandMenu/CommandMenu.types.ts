import { PoffyBrand, PoffyResolvedColorMode } from '@/providers';
import { CommandMenuVariantProps } from '@/styled-system/recipes';
import type { CommandMenuBehaviorItem } from '@poffy-ui/behavior/command-menu';
import type { NativeProps } from '@poffy-ui/types';
import type { ReactNode } from 'react';
import type { PortalTargetProps } from '@/providers/PortalProvider.types';
import type { PortalOwnerDocument } from '@/components/overlay/Portal/Portal.types';

/** Public visual variant props for CommandMenu. */
export type CommandMenuVariants = CommandMenuVariantProps;

/** Renderable command item, extending behavior-layer search, grouping, and disabled-state data. */
export interface CommandMenuItem extends CommandMenuBehaviorItem {
  /** Optional leading visual. */
  icon?: ReactNode;
  /** Called when this command is selected. */
  onSelect?: (item: CommandMenuItem) => void;
}

/** Localized visible and accessible strings for the command-dialog input and result list. */
export interface CommandMenuMessages {
  label: string;
  placeholder: string;
  emptyMessage: string;
  resultsLabel: (label: string) => string;
}

interface CommandMenuBaseOwnProps extends CommandMenuVariants, PortalTargetProps {
  /** Available commands. */
  items: CommandMenuItem[];

  /** Dialog accessible label. */
  label?: string;

  /** Search input placeholder. */
  placeholder?: string;

  /** Empty state text. */
  emptyMessage?: string;

  /** BCP 47 locale overriding the nearest LocaleProvider for default text. */
  locale?: string;

  /** Partial localized default text overrides. */
  messages?: Partial<CommandMenuMessages>;

  /** Whether selection closes the menu. */
  closeOnSelect?: boolean;

  /** Enables Cmd/Ctrl+K global opener. Prefer consumer-owned shortcuts for app shells. */
  globalShortcut?: boolean;

  /**
   * Priority used when multiple command menus register the same shortcut target.
   * The highest priority wins; equal priorities resolve to the latest stable registration.
   */
  globalShortcutPriority?: number;

  /**
   * Optional event scope for the global shortcut. A resolver is evaluated after each render so it
   * can return a target that mounts later; while it returns null, no fallback listener is added.
   */
  globalShortcutTarget?:
    | Document
    | ShadowRoot
    | HTMLElement
    | null
    | (() => Document | ShadowRoot | HTMLElement | null);

  /**
   * Owner document used for the default body portal. An explicit `portalContainer` or nearest
   * `PortalProvider` takes precedence. A resolver returning `null` suppresses the default portal.
   * This does not change the independently configured `globalShortcutTarget`.
   */
  ownerDocument?: PortalOwnerDocument;

  /** Disables opening and selection. */
  disabled?: boolean;

  /** Theme brand override. */
  brand?: PoffyBrand;

  /** Theme color mode override. */
  theme?: PoffyResolvedColorMode;
}

/** Controlled state props for CommandMenuOpen. */
export interface ControlledCommandMenuOpenProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultOpen?: never;
}

/** Uncontrolled state props for CommandMenuOpen. */
export interface UncontrolledCommandMenuOpenProps {
  open?: never;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/** Public props for CommandMenuOpenState. */
export type CommandMenuOpenStateProps =
  | ControlledCommandMenuOpenProps
  | UncontrolledCommandMenuOpenProps;

/** Controlled state props for CommandMenuQuery. */
export interface ControlledCommandMenuQueryProps {
  query: string;
  onQueryChange: (query: string) => void;
  defaultQuery?: never;
}

/** Uncontrolled state props for CommandMenuQuery. */
export interface UncontrolledCommandMenuQueryProps {
  query?: never;
  defaultQuery?: string;
  onQueryChange?: (query: string) => void;
}

/** Public props for CommandMenuQueryState. */
export type CommandMenuQueryStateProps =
  | ControlledCommandMenuQueryProps
  | UncontrolledCommandMenuQueryProps;

/** Component-specific props for CommandMenu. */
export type CommandMenuOwnProps = CommandMenuBaseOwnProps &
  CommandMenuOpenStateProps &
  CommandMenuQueryStateProps;

/**
 * Props for the data-driven command menu. Custom children are not supported;
 * supply commands through `items`.
 */
type CommandMenuNativeBaseProps = Omit<NativeProps<'div', CommandMenuBaseOwnProps>, 'children'>;

/** Public props for CommandMenu. */
export type CommandMenuProps = CommandMenuNativeBaseProps &
  CommandMenuOpenStateProps &
  CommandMenuQueryStateProps;
