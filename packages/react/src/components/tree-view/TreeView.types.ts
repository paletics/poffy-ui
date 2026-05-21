import { ElementType, ReactNode } from 'react';
import { NavigationAppearance, PrimitiveProps } from '@poffy-ui/types';
import { treeView, TreeViewVariantProps } from '@/styled-system/recipes';

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
  /** Optional icon rendered before the label. */
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
  /**
   * Legacy appearance alias.
   *
   * ### Notes
   * Prefer `appearance` in new code. Use this only when maintaining older call
   * sites that still pass `default` or `ghost`.
   *
   * @defaultValue `undefined`
   */
  variant?: 'default' | 'ghost';
}

/**
 * Properties for the auto-constructing TreeView.
 *
 * @example
 * ```tsx
 * import { TreeView } from '@poffy-ui/react/tree-view';
 * ```
 *
 * ### Notes
 * Use this API when data is already a nested tree. Use the compound
 * components when markup, custom controls, or per-node layout must be hand-authored.
 * The root renders with `role="tree"` and generated items render `role="treeitem"`.
 *
 * Related: `TreeViewData`
 * Related: `TreeViewRootProps`
 */
export type TreeViewBuilderProps<T extends ElementType = 'ul'> = PrimitiveProps<
  T,
  TreeViewVariantSubset
> & {
  /** Node data used to construct the tree recursively. */
  data: TreeViewData[];
  /** Custom label renderer for each node. */
  renderLabel?: (node: TreeViewData) => ReactNode;
  /**
   * Node IDs expanded on initial uncontrolled render.
   *
   * @defaultValue `[]`
   */
  defaultExpandedIds?: string[];
  /**
   * Node IDs selected on initial uncontrolled render.
   *
   * @defaultValue `[]`
   */
  defaultSelectedIds?: string[];
  /** Additional CSS class names merged onto the root tree element. */
  className?: string;
};

/**
 * Context value for the TreeView compound components.
 *
 * ### Notes
 * This is shared by TreeView internals. Application code should prefer
 * the public components instead of reading context directly.
 */
export interface TreeViewContextValue {
  /** Currently expanded node IDs. */
  expandedIds: Set<string>;
  /** Toggles a node between expanded and collapsed states. */
  toggleNode: (id: string) => void;
  /** Currently selected node IDs. */
  selectedIds: Set<string>;
  /** Updates selected state for a node and optional descendant IDs. */
  toggleSelection: (id: string, isSelected: boolean, childrenIds?: string[]) => void;
  /** Generated Panda CSS recipe classes for TreeView slots. */
  classes: ReturnType<typeof treeView>;
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
export interface TreeViewRootOwnProps extends TreeViewVariantSubset {
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
  /** Controlled set of expanded node IDs. */
  expandedIds?: string[];
  /** Callback fired when expanded node IDs change. */
  onExpandedChange?: (expandedIds: string[]) => void;
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
  /** Controlled set of selected node IDs. */
  selectedIds?: string[];
  /** Callback fired when selected node IDs change. */
  onSelectedChange?: (selectedIds: string[]) => void;
  /** Additional CSS class names merged onto the root tree element. */
  className?: string;
}

/**
 * Comprehensive properties for the TreeViewRoot component.
 */
export type TreeViewRootProps = PrimitiveProps<'ul', TreeViewRootOwnProps>;

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
  /** Whether the item owns a nested child group. */
  hasChildren?: boolean;
  /** Descendant IDs used for cascading selection. */
  childrenIds?: string[];
  /** Additional CSS class names merged onto the item element. */
  className?: string;
}

/**
 * Comprehensive properties for the TreeViewItem component.
 */
export type TreeViewItemProps = PrimitiveProps<'li', TreeViewItemOwnProps>;

/**
 * Own properties for a TreeView trigger.
 *
 * ### Notes
 * Renders the disclosure control for expandable items. Keep labels in
 * `TreeViewLabel` so the trigger remains predictable for keyboard and screen reader users.
 * Do not nest other interactive controls inside the trigger; place selection
 * controls adjacent to the label using `TreeViewCheckbox`.
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
export type TreeViewTriggerProps = PrimitiveProps<'button', TreeViewTriggerOwnProps>;

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
export type TreeViewContentProps = PrimitiveProps<'ul', TreeViewContentOwnProps>;

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
export type TreeViewLabelProps = PrimitiveProps<'span', TreeViewLabelOwnProps>;

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
export type TreeViewCheckboxProps = PrimitiveProps<'input', TreeViewCheckboxOwnProps>;
