'use client';

import type { ReactNode } from 'react';
import { TreeViewData } from './TreeView.types';
import { TreeViewAutoNode } from './TreeViewAutoNode';

interface TreeViewAutoContentProps {
  nodes: TreeViewData[];
  renderLabel?: (node: TreeViewData) => ReactNode;
}

/**
 * Recursively renders TreeView nodes for the auto-construction API.
 */
export const TreeViewAutoContent = ({ nodes, renderLabel }: TreeViewAutoContentProps) => {
  return (
    <>
      {nodes.map((node) => (
        <TreeViewAutoNode key={node.id} node={node} renderLabel={renderLabel} />
      ))}
    </>
  );
};
