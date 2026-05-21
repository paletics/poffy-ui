'use client';

import { forwardRef, useCallback, useMemo, useState } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cx } from '@/styled-system/css';
import { TreeViewRootProps } from './TreeView.types';
import { TreeViewProvider } from './TreeViewContext';
import { treeView } from '@/styled-system/recipes';

/**
 * The root container for a TreeView component.
 * Manages expanded and selected state for all descendant tree items.
 *
 * @example
 * ```tsx
 * import { TreeViewItem, TreeViewLabel, TreeViewRoot, TreeViewTrigger } from '@poffy-ui/react/tree-view';
 * ```
 *
 * ### Notes
 * Required structure: render `TreeViewItem` children directly or through nested
 * `TreeViewContent`. Use controlled state only when expansion or selection must
 * sync with external application state.
 *
 * ### AI Context & Architecture
 * - **Tier**: Organisms
 * - **Stack**: Panda CSS (treeView), Context API
 * - **Props**: TreeViewRootProps
 *
 * ### Accessibility
 * Renders `role="tree"` and expects descendant items to render `role="treeitem"`.
 */
export const TreeViewRoot = forwardRef<HTMLUListElement, TreeViewRootProps>(
  (
    {
      children,
      className,
      appearance,
      variant,
      defaultExpandedIds = [],
      expandedIds: controlledExpandedIds,
      onExpandedChange,
      defaultSelectedIds = [],
      selectedIds: controlledSelectedIds,
      onSelectedChange,
      asChild,
      ...props
    },
    ref,
  ) => {
    const [uncontrolledExpandedIds, setUncontrolledExpandedIds] = useState<Set<string>>(
      new Set(defaultExpandedIds),
    );
    const isExpandedControlled = controlledExpandedIds !== undefined;
    const expandedIds = useMemo(
      () => new Set(isExpandedControlled ? controlledExpandedIds : uncontrolledExpandedIds),
      [isExpandedControlled, controlledExpandedIds, uncontrolledExpandedIds],
    );

    const toggleNode = useCallback(
      (id: string) => {
        const next = new Set(expandedIds);
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }

        if (!isExpandedControlled) {
          setUncontrolledExpandedIds(next);
        }
        onExpandedChange?.(Array.from(next));
      },
      [expandedIds, isExpandedControlled, onExpandedChange],
    );

    const [uncontrolledSelectedIds, setUncontrolledSelectedIds] = useState<Set<string>>(
      new Set(defaultSelectedIds),
    );
    const isSelectedControlled = controlledSelectedIds !== undefined;
    const selectedIds = useMemo(
      () => new Set(isSelectedControlled ? controlledSelectedIds : uncontrolledSelectedIds),
      [isSelectedControlled, controlledSelectedIds, uncontrolledSelectedIds],
    );

    const toggleSelection = useCallback(
      (id: string, isSelected: boolean, childrenIds: string[] = []) => {
        const next = new Set(selectedIds);

        const idsToUpdate = [id, ...childrenIds];

        if (isSelected) {
          idsToUpdate.forEach((i) => next.add(i));
        } else {
          idsToUpdate.forEach((i) => next.delete(i));
        }

        if (!isSelectedControlled) {
          setUncontrolledSelectedIds(next);
        }
        onSelectedChange?.(Array.from(next));
      },
      [selectedIds, isSelectedControlled, onSelectedChange],
    );

    const resolvedAppearance =
      appearance ?? (variant === 'ghost' ? 'outline' : variant === 'default' ? 'soft' : 'soft');
    const classes = useMemo(
      () => treeView({ appearance: resolvedAppearance }),
      [resolvedAppearance],
    );

    const contextValue = useMemo(
      () => ({ expandedIds, toggleNode, selectedIds, toggleSelection, classes }),
      [expandedIds, toggleNode, selectedIds, toggleSelection, classes],
    );

    const Component = asChild ? Slot : 'ul';

    return (
      <TreeViewProvider value={contextValue}>
        <Component ref={ref} className={cx(classes.root, className)} role="tree" {...props}>
          {children}
        </Component>
      </TreeViewProvider>
    );
  },
);
TreeViewRoot.displayName = 'TreeViewRoot';
