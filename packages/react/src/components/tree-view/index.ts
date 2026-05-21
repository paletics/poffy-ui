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
 * Public TreeView namespace combining auto-construction and compound APIs.
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
  TreeViewCheckboxOwnProps,
  TreeViewCheckboxProps,
  TreeViewContentOwnProps,
  TreeViewContentProps,
  TreeViewData,
  TreeViewItemOwnProps,
  TreeViewItemProps,
  TreeViewLabelOwnProps,
  TreeViewLabelProps,
  TreeViewRootOwnProps,
  TreeViewRootProps,
  TreeViewTriggerOwnProps,
  TreeViewTriggerProps,
  TreeViewVariantSubset,
} from './TreeView.types';
