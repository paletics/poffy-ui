/** Logical tree action derived from a navigation key and the focused node's state. */
export type TreeViewKeyboardIntent =
  | 'child'
  | 'collapse'
  | 'expand'
  | 'first'
  | 'last'
  | 'next'
  | 'parent'
  | 'previous'
  | 'select'
  | 'toggle';

/** Focused-node state used to interpret a tree-view navigation key, including RTL direction. */
export interface GetTreeViewKeyboardIntentOptions {
  /** Whether the focused item has navigable child items. */
  hasChildren: boolean;
  /** Current expansion state of the focused item. */
  isExpanded: boolean;
  /** Whether horizontal child/parent keys are reversed. */
  isRtl: boolean;
  /** Whether Space selects rather than toggles an item with children. */
  isSelectable: boolean;
  /** DOM key value to interpret. */
  key: string;
}

/** Controlled or uncontrolled expanded and selected node IDs for a tree view. */
export interface UseTreeViewStateOptions {
  /** Initial uncontrolled expansion ids. */
  defaultExpandedIds?: readonly string[];
  /** Initial uncontrolled selection ids. */
  defaultSelectedIds?: readonly string[];
  /** Controlled expansion ids; callers must reflect `onExpandedChange`. */
  expandedIds?: readonly string[];
  /** Receives the full next expansion-id list after every toggle request. */
  onExpandedChange?: (expandedIds: string[]) => void;
  /** Receives the full next selection-id list after every selection request. */
  onSelectedChange?: (selectedIds: string[]) => void;
  /** Controlled selection ids; callers must reflect `onSelectedChange`. */
  selectedIds?: readonly string[];
}

/** Normalized node state and operations that preserve parent or child selection policy. */
export interface UseTreeViewStateReturn {
  /** Current expansion ids as a deduplicated set. */
  expandedIds: ReadonlySet<string>;
  /** Whether expansion is controlled independently of selection. */
  isExpandedControlled: boolean;
  /** Whether selection is controlled independently of expansion. */
  isSelectedControlled: boolean;
  /** Current selected ids as a deduplicated set. */
  selectedIds: ReadonlySet<string>;
  /** Toggles one expansion id and requests the full next list. */
  toggleNode: (id: string) => void;
  /**
   * Adds or removes the id and explicitly supplied descendant ids. This hook does not traverse
   * tree data itself.
   */
  toggleSelection: (id: string, isSelected: boolean, childrenIds?: readonly string[]) => void;
}
