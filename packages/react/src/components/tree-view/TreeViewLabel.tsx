'use client';

import { forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cx } from '@/styled-system/css';
import { TreeViewLabelProps } from './TreeView.types';
import { useTreeViewContext } from './TreeViewContext';

/**
 * A simple label component for a TreeViewItem trigger.
 *
 * ### Notes
 * Use for the visible node name so trigger layout, icons, and selection controls
 * remain consistent. Use `asChild` only for non-interactive text-like elements.
 *
 * ### AI Context & Architecture
 * - **Tier**: Atoms
 * - **Stack**: Panda CSS (treeView), Radix Slot
 * - **Props**: TreeViewLabelProps
 *
 * ### Design Tokens
 * - **typography**: inherits tree row label sizing and weight from the `treeView` label slot.
 * - **layout**: participates in trigger row gap and truncation rules from the tree recipe.
 *
 * ### Accessibility
 * - **Role**: text label inside a tree item trigger.
 * - **Required**: keep the rendered child non-interactive; links, buttons, and menus must live outside the label.
 *
 * ### AI Usage
 * - Do: use for stable visible node text that assistive technology can announce with the tree item.
 * - Don't: use for badges, actions, or nested controls.
 *
 * @example Standard label
 * ```tsx
 * import { TreeViewLabel } from '@poffy-ui/react/tree-view';
 *
 * <TreeViewLabel>Documents</TreeViewLabel>
 * ```
 */
export const TreeViewLabel = forwardRef<HTMLSpanElement, TreeViewLabelProps>(
  ({ children, className, asChild, ...props }, ref) => {
    const { classes } = useTreeViewContext();
    const Component = asChild ? Slot : 'span';

    return (
      <Component ref={ref} className={cx(classes.label, className)} {...props}>
        {children}
      </Component>
    );
  },
);
TreeViewLabel.displayName = 'TreeViewLabel';
