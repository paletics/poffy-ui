'use client';

import { forwardRef, useEffect, useMemo } from 'react';
import {
  DEFAULT_MAX_TREE_VIEW_DATA_DEPTH,
  prepareTreeViewDataWithMetadata,
} from '@poffy-ui/behavior/tree-view';
import { TreeViewBuilderProps } from './TreeView.types';

import { TreeViewRoot } from './TreeViewRoot';
import { TreeViewAutoContent } from './TreeViewAutoContent';

interface RuntimeEnv {
  process?: { env?: { NODE_ENV?: string } };
}

/**
 * Builds an accessible TreeView from hierarchical data.
 *
 * Keep node IDs stable so expansion and selection stay attached across renders.
 * Data is bounded by `maxAutoTreeDepth`; invalid limits use the default.
 * Duplicate IDs are ignored and warn in development. Compose Root parts
 * directly when nodes require controls beyond the built-in icon and label.
 */
export const TreeViewAuto = forwardRef<HTMLUListElement, TreeViewBuilderProps>(
  ({ data, renderLabel, maxAutoTreeDepth, ...rootProps }, ref) => {
    const requestedMaxDepth = maxAutoTreeDepth ?? DEFAULT_MAX_TREE_VIEW_DATA_DEPTH;
    const normalizedMaxDepth =
      requestedMaxDepth === Infinity ||
      (Number.isFinite(requestedMaxDepth) && Math.floor(requestedMaxDepth) >= 1)
        ? Math.floor(requestedMaxDepth)
        : DEFAULT_MAX_TREE_VIEW_DATA_DEPTH;
    const prepared = useMemo(
      () => prepareTreeViewDataWithMetadata(data, normalizedMaxDepth),
      [data, normalizedMaxDepth],
    );
    useEffect(() => {
      if (prepared.duplicateIds.length === 0) return;
      const nodeEnv = (globalThis as RuntimeEnv).process?.env?.NODE_ENV;
      if (nodeEnv === 'production') return;
      console.warn(
        `[TreeView] Auto tree item ids must be unique. Every node using these ambiguous ids was ignored: ${prepared.duplicateIds.join(', ')}`,
      );
    }, [prepared]);

    return (
      <TreeViewRoot ref={ref} {...rootProps}>
        <TreeViewAutoContent nodes={prepared.data} renderLabel={renderLabel} />
      </TreeViewRoot>
    );
  },
);
TreeViewAuto.displayName = 'TreeView';
