'use client';

import { forwardRef, useMemo } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cx } from '@/styled-system/css';
import { TreeViewItemProps } from './TreeView.types';
import { TreeViewItemProvider, useTreeViewContext } from './TreeViewContext';

/**
 * Represents a single node (item) in the TreeView.
 * Provides context for triggers and content associated with this item.
 *
 * ### Notes
 * `id` must be unique inside the current TreeView. Set `hasChildren` when the
 * item owns nested content so trigger indicators and ARIA state remain accurate.
 *
 * ### AI Context & Architecture
 * - **Tier**: Molecules
 * - **Stack**: Panda CSS (treeView), Context API
 * - **Props**: TreeViewItemProps
 *
 * ### Accessibility
 * Renders `role="treeitem"` and should be placed inside `TreeViewRoot` or
 * `TreeViewContent`.
 */
export const TreeViewItem = forwardRef<HTMLLIElement, TreeViewItemProps>(
  ({ id, children, childrenIds, hasChildren, className, asChild, ...props }, ref) => {
    const { classes } = useTreeViewContext();
    const Component = asChild ? Slot : 'li';
    const contextValue = useMemo(
      () => ({ id, childrenIds, hasChildren }),
      [id, childrenIds, hasChildren],
    );

    return (
      <TreeViewItemProvider value={contextValue}>
        <Component ref={ref} className={cx(classes.item, className)} role="treeitem" {...props}>
          {children}
        </Component>
      </TreeViewItemProvider>
    );
  },
);
TreeViewItem.displayName = 'TreeViewItem';
