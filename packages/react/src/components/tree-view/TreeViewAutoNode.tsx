'use client';

import type { ReactNode } from 'react';
import { TreeViewData } from './TreeView.types';
import { TreeViewItem } from './TreeViewItem';
import { TreeViewTrigger } from './TreeViewTrigger';
import { TreeViewContent } from './TreeViewContent';
import { TreeViewLabel } from './TreeViewLabel';
import { useTreeViewContext } from './TreeViewContext';
import { getSafeInteractiveContent } from '@/components/shared/getSafeInteractiveContent';

interface TreeViewAutoNodeProps {
  node: TreeViewData;
  renderLabel?: (node: TreeViewData) => ReactNode;
}

/**
 * Renders one auto-generated TreeView node and its descendants.
 */
export const TreeViewAutoNode = ({ node, renderLabel }: TreeViewAutoNodeProps) => {
  const { classes } = useTreeViewContext();
  const hasChildren = node.children && node.children.length > 0;
  return (
    <TreeViewItem id={node.id} hasChildren={!!hasChildren}>
      <TreeViewTrigger>
        {node.icon && (
          <span key="icon" className={classes.icon}>
            {getSafeInteractiveContent(node.icon, { preserveOpaque: true })}
          </span>
        )}
        <TreeViewLabel key="label">{renderLabel ? renderLabel(node) : node.name}</TreeViewLabel>
      </TreeViewTrigger>
      {hasChildren && node.children && (
        <TreeViewContent>
          {node.children.map((childNode) => (
            <TreeViewAutoNode key={childNode.id} node={childNode} renderLabel={renderLabel} />
          ))}
        </TreeViewContent>
      )}
    </TreeViewItem>
  );
};
