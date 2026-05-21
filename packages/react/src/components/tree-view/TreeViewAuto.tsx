'use client';

import { forwardRef } from 'react';
import { TreeViewBuilderProps, TreeViewData } from './TreeView.types';

import { TreeViewRoot } from './TreeViewRoot';
import { TreeViewAutoContent } from './TreeViewAutoContent';

const collectAllChildrenIds = (nodes?: TreeViewData[]): string[] => {
  if (!nodes) return [];
  let ids: string[] = [];
  nodes.forEach((node) => {
    ids.push(node.id);
    if (node.children) {
      ids = ids.concat(collectAllChildrenIds(node.children));
    }
  });
  return ids;
};

/**
 * Auto-renders a full TreeView from hierarchical data.
 * Recursively builds TreeViewItem → TreeViewTrigger → TreeViewContent nodes
 * from a flat `TreeViewData[]` input.
 *
 * ### AI Context & Architecture
 * - **Tier**: Organisms
 * - **Stack**: TreeViewRoot / TreeViewItem / TreeViewTrigger / TreeViewContent / TreeViewLabel
 * - **Props**: TreeViewBuilderProps
 *
 * ### Design Tokens
 * - **layout**: delegates row spacing, nesting indentation, and disclosure icon sizing to the `treeView` recipe.
 * - **color**: inherits tree item foreground and selected-state tokens from `TreeViewRoot`.
 *
 * ### Variant Logic
 * - **appearance="soft"**: Default navigation tree surface for sidebars and settings panels.
 * - **appearance="outline"**: Use when the tree needs stronger row separation in dense panels.
 *
 * ### Accessibility
 * - **Role**: renders `role="tree"` through `TreeViewRoot` and nested `role="treeitem"` nodes.
 * - **Keyboard**: Enter / Space toggles expansion; ArrowLeft / ArrowRight collapse or expand items.
 * - **Required**: keep every `TreeViewData.id` stable across renders so expansion and selection remain attached to the same logical node.
 *
 * ### AI Usage
 * - Do: use when a nested data model should generate the entire tree.
 * - Don't: use when each node needs custom controls beyond label and icon; compose `TreeViewRoot` parts instead.
 *
 * @example Auto-generated tree
 * ```tsx
 * import { TreeViewAuto } from '@poffy-ui/react/tree-view';
 *
 * <TreeViewAuto
 *   data={[{ id: '1', name: 'Root', children: [{ id: '2', name: 'Child' }] }]}
 *   renderLabel={(node) => <strong>{node.name}</strong>}
 * />
 * ```
 *
 * @example Initial expanded state
 * ```tsx
 * import { TreeViewAuto } from '@poffy-ui/react/tree-view';
 *
 * <TreeViewAuto data={nodes} defaultExpandedIds={['docs']} />
 * ```
 */
export const TreeViewAuto = forwardRef<HTMLUListElement, TreeViewBuilderProps>(
  ({ data, renderLabel, defaultExpandedIds, defaultSelectedIds, className, ...props }, ref) => {
    return (
      <TreeViewRoot
        ref={ref}
        defaultExpandedIds={defaultExpandedIds}
        defaultSelectedIds={defaultSelectedIds}
        className={className}
        {...(props as React.HTMLAttributes<HTMLUListElement>)}
      >
        <TreeViewAutoContent
          nodes={data}
          renderLabel={renderLabel}
          collectAllChildrenIds={collectAllChildrenIds}
        />
      </TreeViewRoot>
    );
  },
);
TreeViewAuto.displayName = 'TreeView';
