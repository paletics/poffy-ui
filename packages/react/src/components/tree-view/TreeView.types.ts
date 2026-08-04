import type { ComponentPropsWithoutRef, ReactElement, ReactNode } from 'react';
import { NativeProps, NavigationAppearance, PrimitiveProps } from '@poffy-ui/types';
import { treeView, TreeViewVariantProps } from '@/styled-system/recipes';
import type {
  DefaultHostProps,
  PolymorphicAsChildComponent,
  RetargetedAsChildHostProps,
} from '@/components/shared/polymorphicAsChild.types';

/**
 * Data structure for the TreeView auto-construction API.
 *
 * @example
 * ```tsx
 * import { TreeView, type TreeViewData } from '@poffy-ui/react/tree-view';
 * ```
 *
 * ### Notes
 * Do: keep `id` values stable across renders so expansion and selection state stays
 * attached to the same node.
 * Don't: derive IDs from array indexes when the tree can be sorted or filtered.
 */
export interface TreeViewData {
  /** Unique node identifier used for expansion and selection state. */
  id: string;
  /** Default visible label for the node. */
  name: string;
  /**
   * Optional decorative icon rendered before the label.
   * Must render non-interactive content; the node name or label supplies the accessible name.
   */
  icon?: ReactNode;
  /** Nested child nodes. */
  children?: TreeViewData[];
}

/**
 * Public TreeView variant props with shared navigation appearance names.
 */
export interface TreeViewVariantSubset extends Omit<
  TreeViewVariantProps,
  'appearance' | 'variant'
> {
  /**
   * Visual appearance mapped to the supported navigation appearance token set.
   *
   * ### Notes
   * Use `soft` for standard nested navigation surfaces. Use `outline` when the
   * tree sits inside a plain panel and row boundaries need stronger separation.
   *
   * @defaultValue `'soft'`
   */
  appearance?: Extract<NavigationAppearance, 'soft' | 'outline'>;
}

/**
 * Context value for the TreeView compound components.
 *
 * ### Notes
 * This is shared by TreeView internals. Application code should prefer
 * the public components instead of reading context directly.
 */
export interface TreeViewContextValue {
  /** Currently expanded node IDs. */
  expandedIds: ReadonlySet<string>;
  /** Toggles a node between expanded and collapsed states. */
  toggleNode: (id: string) => void;
  /** Currently selected node IDs. */
  selectedIds: ReadonlySet<string>;
  /** Updates selected state for a node and optional descendant IDs. */
  toggleSelection: (id: string, isSelected: boolean, childrenIds?: string[]) => void;
  /** Generated Panda CSS recipe classes for TreeView slots. */
  classes: ReturnType<typeof treeView>;
  /** ID of the trigger participating in roving tabindex. */
  activeId: string | null;
  /** Opaque instance ID of the trigger participating in roving tabindex. */
  activeInstanceId: string | null;
  /** Item instances whose shared public ID is currently ambiguous. */
  ambiguousItemInstanceIds: ReadonlySet<string>;
  /** Item IDs known to be ambiguous from the rendered compound children. */
  ambiguousItemIds: ReadonlySet<string>;
  /** Updates the active trigger. Internal keyboard-navigation state. */
  setActiveItem: (instanceId: string, id: string) => void;
  /** Registers a tree item as a possible roving tab stop. */
  registerActiveItem: (
    instanceId: string,
    id: string,
    node: HTMLLIElement,
    isFocusable: boolean,
  ) => void;
  /** Removes a trigger instance from the roving tab stop registry. */
  unregisterActiveItem: (instanceId: string) => void;
  /** Registers checkbox selection semantics for the owning tree. */
  registerCheckboxItem: () => () => void;
  /** Whether tree items use checkbox rather than selected-state semantics. */
  hasCheckboxSelection: boolean;
  /** Direction hint used only when the rendered tree has no resolved CSS direction. */
  direction?: string;
}

/**
 * Own properties for the root TreeView component.
 *
 * @example
 * ```tsx
 * import {
 *   TreeViewContent,
 *   TreeViewItem,
 *   TreeViewLabel,
 *   TreeViewRoot,
 *   TreeViewTrigger,
 * } from '@poffy-ui/react/tree-view';
 * ```
 *
 * ### Notes
 * Required compound structure: `TreeViewRoot` contains `TreeViewItem`; each item
 * contains a `TreeViewTrigger` and optional nested `TreeViewContent`.
 * Use controlled `expandedIds`/`selectedIds` only when state is owned by routing,
 * persistence, or another external store.
 */
interface TreeViewRootBaseOwnProps extends TreeViewVariantSubset {
  /** Additional CSS class names merged onto the root tree element. */
  className?: string;
}

/** Externally owned TreeView expansion state. */
export interface ControlledTreeViewExpandedProps {
  expandedIds: string[];
  onExpandedChange: (expandedIds: string[]) => void;
  defaultExpandedIds?: never;
}

/** TreeView-owned expansion state. */
export interface UncontrolledTreeViewExpandedProps {
  /**
   * Node IDs expanded on initial uncontrolled render.
   *
   * ### Notes
   * Use stable node IDs from the data model. Do not pass array indexes when the
   * tree can be sorted, filtered, or loaded incrementally.
   *
   * @defaultValue `[]`
   */
  defaultExpandedIds?: string[];
  expandedIds?: never;
  onExpandedChange?: (expandedIds: string[]) => void;
}

/** Externally owned TreeView selection state. */
export interface ControlledTreeViewSelectedProps {
  selectedIds: string[];
  onSelectedChange: (selectedIds: string[]) => void;
  defaultSelectedIds?: never;
}

/** TreeView-owned selection state. */
export interface UncontrolledTreeViewSelectedProps {
  /**
   * Node IDs selected on initial uncontrolled render.
   *
   * ### Notes
   * Use this for initial uncontrolled selection only. When selection must follow
   * URL state, persisted preferences, or an external store, use `selectedIds`
   * and `onSelectedChange` instead.
   *
   * @defaultValue `[]`
   */
  defaultSelectedIds?: string[];
  selectedIds?: never;
  onSelectedChange?: (selectedIds: string[]) => void;
}

/** Public props for TreeViewExpandedState. */
export type TreeViewExpandedStateProps =
  | ControlledTreeViewExpandedProps
  | UncontrolledTreeViewExpandedProps;
/** Public props for TreeViewSelectedState. */
export type TreeViewSelectedStateProps =
  | ControlledTreeViewSelectedProps
  | UncontrolledTreeViewSelectedProps;
/** Component-specific props for TreeViewRoot. */
export type TreeViewRootOwnProps = TreeViewRootBaseOwnProps &
  TreeViewExpandedStateProps &
  TreeViewSelectedStateProps;

type TreeViewRootNativeBaseProps = Omit<
  PrimitiveProps<'ul', TreeViewRootBaseOwnProps>,
  'aria-multiselectable' | 'role'
>;

/**
 * Comprehensive properties for the TreeViewRoot component.
 */
export type TreeViewRootProps = TreeViewRootNativeBaseProps &
  TreeViewExpandedStateProps &
  TreeViewSelectedStateProps;

interface TreeViewBuilderOwnProps {
  /** Node data used to construct the tree recursively. */
  data: TreeViewData[];
  /**
   * Custom visible label renderer for each node. It must render non-interactive content.
   * Use compound TreeView parts when a node requires links, buttons, or other controls.
   */
  renderLabel?: (node: TreeViewData) => ReactNode;
  /**
   * Maximum nested data depth rendered by the auto-construction API. This prevents malformed
   * or untrusted data from exhausting the renderer stack. Use `Infinity` only when input
   * depth is already bounded. Fractional values are rounded down; values below `1`, `NaN`,
   * and `-Infinity` use the default of `100`.
   *
   * @defaultValue `100`
   */
  maxAutoTreeDepth?: number;
}

type TreeViewBuilderBaseProps = Omit<TreeViewRootNativeBaseProps, 'children'> &
  TreeViewBuilderOwnProps;

/**
 * Properties for the auto-constructing TreeView.
 *
 * ### Notes
 * Uses the same independent controlled/uncontrolled expansion and selection
 * contracts as `TreeViewRootProps`.
 */
export type TreeViewBuilderProps = TreeViewBuilderBaseProps &
  TreeViewExpandedStateProps &
  TreeViewSelectedStateProps;

/**
 * Own properties for a TreeView item node.
 *
 * ### Notes
 * The `id` must be unique within a `TreeViewRoot` and should match the node used
 * by triggers, checkbox selection, and nested content.
 */
export interface TreeViewItemOwnProps {
  /** Unique node identifier used by triggers and selection controls. */
  id: string;
  /**
   * Whether the item owns a nested child group. Omitted values are leaves.
   * Pass `true` for expandable branches.
   * @defaultValue false
   */
  hasChildren?: boolean;
  /** Descendant IDs used for cascading selection. */
  childrenIds?: string[];
  /** Additional CSS class names merged onto the item element. */
  className?: string;
}

/**
 * Comprehensive properties for the TreeViewItem component.
 */
export type TreeViewItemProps = Omit<
  PrimitiveProps<'li', TreeViewItemOwnProps>,
  'aria-checked' | 'aria-disabled' | 'aria-expanded' | 'aria-selected' | 'role' | 'tabIndex'
>;

/**
 * Own properties for a TreeView trigger.
 *
 * ### Notes
 * Renders the disclosure control for expandable items. Keep labels in
 * `TreeViewLabel` so the trigger remains predictable for keyboard and screen reader users.
 * Do not nest other interactive controls inside the trigger; place selection
 * controls adjacent to the label using `TreeViewCheckbox`.
 * When using `asChild`, provide one native `button`; other hosts safely fall
 * back to the component's native button.
 */
export interface TreeViewTriggerOwnProps {
  /** Hides the default disclosure indicator. */
  hideIndicator?: boolean;
  /** Additional CSS class names merged onto the trigger element. */
  className?: string;
}

/**
 * Comprehensive properties for the TreeViewTrigger component.
 */
export type TreeViewTriggerProps = Omit<
  PrimitiveProps<'button', TreeViewTriggerOwnProps>,
  'aria-expanded' | 'tabIndex' | 'type'
>;

/**
 * Own properties for a TreeView content container.
 *
 * ### Notes
 * Must be nested inside the corresponding `TreeViewItem`. It renders a
 * nested `role="group"` list and is opened or closed by that item's trigger.
 */
export interface TreeViewContentOwnProps {
  /** Additional CSS class names merged onto the nested group element. */
  className?: string;
}

/**
 * Comprehensive properties for the TreeViewContent component.
 */
export type TreeViewContentProps = Omit<NativeProps<'ul', TreeViewContentOwnProps>, 'role'>;

/**
 * Own properties for a TreeView label.
 *
 * ### Notes
 * Use for visible node text inside `TreeViewTrigger`. Keep labels short
 * and stable so typeahead/search integrations can rely on the same text.
 */
export interface TreeViewLabelOwnProps {
  /** Additional CSS class names merged onto the label element. */
  className?: string;
}

/**
 * Comprehensive properties for the TreeViewLabel component.
 */
type TreeViewLabelNativeProps = PrimitiveProps<'span', TreeViewLabelOwnProps>;
/** Props for TreeViewLabel rendered with its default host. */
export type TreeViewLabelDefaultProps = DefaultHostProps<TreeViewLabelNativeProps>;
type TreeViewLabelAsChildElement =
  | ReactElement<ComponentPropsWithoutRef<'abbr'>, 'abbr'>
  | ReactElement<ComponentPropsWithoutRef<'b'>, 'b'>
  | ReactElement<ComponentPropsWithoutRef<'cite'>, 'cite'>
  | ReactElement<ComponentPropsWithoutRef<'code'>, 'code'>
  | ReactElement<ComponentPropsWithoutRef<'em'>, 'em'>
  | ReactElement<ComponentPropsWithoutRef<'i'>, 'i'>
  | ReactElement<ComponentPropsWithoutRef<'mark'>, 'mark'>
  | ReactElement<ComponentPropsWithoutRef<'s'>, 's'>
  | ReactElement<ComponentPropsWithoutRef<'small'>, 'small'>
  | ReactElement<ComponentPropsWithoutRef<'span'>, 'span'>
  | ReactElement<ComponentPropsWithoutRef<'strong'>, 'strong'>
  | ReactElement<ComponentPropsWithoutRef<'sub'>, 'sub'>
  | ReactElement<ComponentPropsWithoutRef<'sup'>, 'sup'>
  | ReactElement<ComponentPropsWithoutRef<'time'>, 'time'>
  | ReactElement<ComponentPropsWithoutRef<'u'>, 'u'>;
/** Props for TreeViewLabel delegated to an asChild host. */
export type TreeViewLabelAsChildProps = RetargetedAsChildHostProps<
  TreeViewLabelNativeProps,
  HTMLElement,
  TreeViewLabelAsChildElement
>;
/** Public props for TreeViewLabel. */
export type TreeViewLabelProps = TreeViewLabelDefaultProps | TreeViewLabelAsChildProps;
/** Polymorphic component call signatures for TreeViewLabel. */
export type TreeViewLabelComponent = PolymorphicAsChildComponent<
  TreeViewLabelDefaultProps,
  TreeViewLabelAsChildProps,
  HTMLSpanElement,
  HTMLElement
>;

/**
 * Own properties for a TreeView checkbox.
 *
 * ### Notes
 * Use only when the tree supports selection. Pass `childrenIds` when checking
 * a parent should cascade to descendants. Stop propagation is handled by the
 * component so checkbox clicks do not toggle expansion.
 */
export interface TreeViewCheckboxOwnProps {
  /** Additional CSS class names merged onto the checkbox input. */
  className?: string;
  /** Descendant IDs used for cascading selection. */
  childrenIds?: string[];
  /** Value submitted by the underlying checkbox input. */
  value?: string;
}

/**
 * Comprehensive properties for the TreeViewCheckbox component.
 */
export type TreeViewCheckboxProps = Omit<
  NativeProps<'input', TreeViewCheckboxOwnProps>,
  'aria-hidden' | 'checked' | 'defaultChecked' | 'tabIndex' | 'type'
>;
