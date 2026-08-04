import { TreeViewAuto } from './TreeViewAuto';
import { TreeViewRoot } from './TreeViewRoot';
import { TreeViewItem } from './TreeViewItem';
import { TreeViewTrigger } from './TreeViewTrigger';
import { TreeViewContent } from './TreeViewContent';
import { TreeViewLabel } from './TreeViewLabel';
import { TreeViewCheckbox } from './TreeViewCheckbox';

const treeViewParts = {
  Root: TreeViewRoot,
  Item: TreeViewItem,
  Trigger: TreeViewTrigger,
  Content: TreeViewContent,
  Label: TreeViewLabel,
  Checkbox: TreeViewCheckbox,
};

/**
 * TreeView namespace combining data-driven construction and compound APIs.
 *
 * Calling `TreeView` uses the data-driven `TreeViewAuto` API. Use `.Root`,
 * `.Item`, `.Trigger`, `.Content`, `.Label`, and `.Checkbox` when node markup
 * or controls need custom composition.
 */
export const TreeView = Object.assign(TreeViewAuto, treeViewParts);
export {
  TreeViewAuto,
  TreeViewCheckbox,
  TreeViewContent,
  TreeViewItem,
  TreeViewLabel,
  TreeViewRoot,
  TreeViewTrigger,
};
export type {
  TreeViewBuilderProps,
  ControlledTreeViewExpandedProps,
  ControlledTreeViewSelectedProps,
  TreeViewCheckboxOwnProps,
  TreeViewCheckboxProps,
  TreeViewContentOwnProps,
  TreeViewContentProps,
  TreeViewData,
  TreeViewItemOwnProps,
  TreeViewItemProps,
  TreeViewLabelOwnProps,
  TreeViewLabelProps,
  TreeViewLabelAsChildProps,
  TreeViewLabelComponent,
  TreeViewLabelDefaultProps,
  TreeViewRootOwnProps,
  TreeViewRootProps,
  TreeViewExpandedStateProps,
  TreeViewSelectedStateProps,
  TreeViewTriggerOwnProps,
  TreeViewTriggerProps,
  TreeViewVariantSubset,
  UncontrolledTreeViewExpandedProps,
  UncontrolledTreeViewSelectedProps,
} from './TreeView.types';
