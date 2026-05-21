'use client';

import { forwardRef } from 'react';
import { cx } from '@/styled-system/css';
import { TreeViewContentProps } from './TreeView.types';
import { useTreeViewContext, useTreeViewItemContext } from './TreeViewContext';
import { CollapseTransition } from '../animations';

/**
 * The container for nested TreeViewItems.
 * Renders through CollapseTransition to support animated expanding/collapsing.
 *
 * ### Notes
 * Must live inside the `TreeViewItem` it belongs to. It renders a nested
 * `role="group"` list and stays mounted while collapsed for animation support.
 *
 * ### AI Context & Architecture
 * - **Tier**: Molecules
 * - **Stack**: CollapseTransition
 * - **Props**: TreeViewContentProps
 *
 * ### Design Tokens
 * - **layout**: uses the `treeView` content slot for nested indentation and vertical rhythm.
 * - **motion**: delegates height and fade timing to `CollapseTransition`.
 *
 * ### Variant Logic
 * - Inherits the parent `TreeViewRoot` appearance; do not style nested groups independently.
 *
 * ### Accessibility
 * - **Role**: group.
 * - **Pattern**: nested WAI-ARIA Tree group owned by the surrounding `TreeViewItem`.
 * - **Required**: render only inside the item controlled by the matching `TreeViewTrigger`.
 *
 * ### AI Usage
 * - Do: wrap child `TreeViewItem` elements for an expandable node.
 * - Don't: render as a standalone list outside `TreeViewRoot`.
 *
 * @example Nested group
 * ```tsx
 * import { TreeViewContent, TreeViewItem } from '@poffy-ui/react/tree-view';
 *
 * <TreeViewContent>
 *   <TreeViewItem id="child">...</TreeViewItem>
 * </TreeViewContent>
 * ```
 */
export const TreeViewContent = forwardRef<HTMLUListElement, TreeViewContentProps>(
  ({ children, className, asChild: _asChild, ...props }, ref) => {
    const { expandedIds, classes } = useTreeViewContext();
    const { id } = useTreeViewItemContext();
    const isExpanded = expandedIds.has(id);

    return (
      <CollapseTransition
        isOpen={isExpanded}
        animationType="height-fade"
        keepMounted
        customData={{ duration: 0.28 }}
        className={cx(classes.content, className)}
      >
        <ul ref={ref} role="group" {...(props as React.HTMLAttributes<HTMLUListElement>)}>
          {children}
        </ul>
      </CollapseTransition>
    );
  },
);
TreeViewContent.displayName = 'TreeViewContent';
