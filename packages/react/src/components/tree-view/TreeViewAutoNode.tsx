'use client';

import type { ReactNode } from 'react';
import { TreeViewData } from './TreeView.types';
import { TreeViewItem } from './TreeViewItem';
import { TreeViewTrigger } from './TreeViewTrigger';
import { TreeViewContent } from './TreeViewContent';
import { TreeViewLabel } from './TreeViewLabel';
import { useTreeViewContext } from './TreeViewContext';

interface TreeViewAutoNodeProps {
  node: TreeViewData;
  renderLabel?: (node: TreeViewData) => ReactNode;
  collectAllChildrenIds: (nodes?: TreeViewData[]) => string[];
}

/**
 * Renders one auto-generated TreeView node and its descendants.
 */
export const TreeViewAutoNode = ({
  node,
  renderLabel,
  collectAllChildrenIds,
}: TreeViewAutoNodeProps) => {
  const { classes } = useTreeViewContext();
  const hasChildren = node.children && node.children.length > 0;
  const allChildrenIds = hasChildren ? collectAllChildrenIds(node.children) : undefined;

  return (
    <TreeViewItem id={node.id} childrenIds={allChildrenIds} hasChildren={!!hasChildren}>
      <TreeViewTrigger>
        {node.icon && <div className={classes.icon}>{node.icon}</div>}
        {renderLabel ? renderLabel(node) : <TreeViewLabel>{node.name}</TreeViewLabel>}
      </TreeViewTrigger>
      {hasChildren && node.children && (
        <TreeViewContent>
          {node.children.map((childNode) => (
            <TreeViewAutoNode
              key={childNode.id}
              node={childNode}
              renderLabel={renderLabel}
              collectAllChildrenIds={collectAllChildrenIds}
            />
          ))}
        </TreeViewContent>
      )}
    </TreeViewItem>
  );
};
