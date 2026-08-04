'use client';

import { forwardRef, useLayoutEffect, useRef } from 'react';
import { cx } from '@/styled-system/css';
import { getDeepActiveElement, getDOMTreeRoot, useMergeRefs } from '@poffy-ui/behavior/hooks';
import { TreeViewContentProps } from './TreeView.types';
import { useTreeViewContext, useTreeViewItemContext } from './TreeViewContext';
import { CollapseTransition } from '../animations';

/**
 * Renders the nested `role="group"` for an expandable TreeViewItem.
 *
 * It remains mounted while collapsed so the disclosure transition can finish.
 * If collapse would hide a focused descendant, focus returns to the owning
 * item, preserving the TreeView roving-focus contract. It is intentionally a
 * fixed nested `ul`, not a polymorphic content container.
 */
export const TreeViewContent = forwardRef<HTMLUListElement, TreeViewContentProps>(
  (contentProps, ref) => {
    const {
      children,
      className,
      asChild: _legacyAsChild,
      ...props
    } = contentProps as TreeViewContentProps & { asChild?: unknown };
    void _legacyAsChild;
    const { activeId, expandedIds, classes, setActiveItem } = useTreeViewContext();
    const { id, instanceId, isAmbiguous } = useTreeViewItemContext();
    const isExpanded = !isAmbiguous && expandedIds.has(id);
    const contentRef = useRef<HTMLUListElement | null>(null);
    const mergedRef = useMergeRefs(contentRef, ref);

    useLayoutEffect(() => {
      const activeItemIsDescendant = Array.from(
        contentRef.current?.querySelectorAll<HTMLElement>('[data-treeview-item-id]') ?? [],
      ).some((item) => {
        const { treeviewItemId } = item.dataset;
        return treeviewItemId === activeId;
      });
      const tree = contentRef.current?.closest('[role="tree"]');
      const parentItem = Array.from(
        tree?.querySelectorAll<HTMLElement>('[data-treeview-item-id]') ?? [],
      ).find((item) => {
        const { treeviewItemId } = item.dataset;
        return treeviewItemId === id;
      });
      const activeElement = parentItem ? getDeepActiveElement(getDOMTreeRoot(parentItem)) : null;
      const focusedDescendant =
        parentItem !== undefined &&
        parentItem !== activeElement &&
        parentItem.contains(activeElement);
      if (isExpanded || (!activeItemIsDescendant && !focusedDescendant)) return;

      if (focusedDescendant) parentItem.focus();

      setActiveItem(instanceId, id);
    }, [activeId, id, instanceId, isExpanded, setActiveItem]);

    return (
      <CollapseTransition
        isOpen={isExpanded}
        animationType="height-fade"
        keepMounted
        customData={{ duration: 0.28 }}
        className={cx(classes.content, className)}
      >
        <ul ref={mergedRef} {...props} role="group">
          {children}
        </ul>
      </CollapseTransition>
    );
  },
);
TreeViewContent.displayName = 'TreeViewContent';
