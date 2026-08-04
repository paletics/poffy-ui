'use client';

import {
  cloneElement,
  forwardRef,
  isValidElement,
  useCallback,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Slot } from '@radix-ui/react-slot';
import { useMergeRefs } from '@poffy-ui/behavior/hooks';
import { getTreeViewKeyboardIntent } from '@poffy-ui/behavior/tree-view';
import { cx } from '@/styled-system/css';
import { TreeViewItemProps } from './TreeView.types';
import { TreeViewItemProvider, useTreeViewContext } from './TreeViewContext';
import { getFallbackChildrenForNativeContainer, isAsChildHost } from '@/components/shared/asChild';

const treeItemAsChildHosts = new Set(['li']);

/**
 * Renders one roving-focus `treeitem` and owns its descendant part context.
 *
 * `id` must be unique in the TreeView; ambiguous IDs are disabled. Set
 * `hasChildren` for expandable branches. Arrow keys, Home/End, and selection
 * keys follow the tree pattern and skip hidden, disabled items. A selectable
 * item exposes checked state, including `mixed` for partially selected child IDs.
 */
export const TreeViewItem = forwardRef<HTMLLIElement, TreeViewItemProps>(
  (
    {
      id,
      children,
      childrenIds,
      hasChildren = false,
      className,
      asChild,
      onFocus,
      onKeyDown,
      ...props
    },
    ref,
  ) => {
    const {
      classes,
      expandedIds,
      selectedIds,
      toggleNode,
      toggleSelection,
      activeInstanceId,
      ambiguousItemInstanceIds,
      ambiguousItemIds,
      setActiveItem,
      registerActiveItem,
      unregisterActiveItem,
      hasCheckboxSelection,
      direction,
    } = useTreeViewContext();
    const instanceId = useId();
    const itemRef = useRef<HTMLLIElement | null>(null);
    const mergedRef = useMergeRefs(itemRef, ref);
    const [isFocusable, setFocusable] = useState(true);
    const [selectionChildrenIds, setSelectionChildrenIds] = useState<string[] | null>(null);
    const [isSelectionDisabled, setSelectionDisabled] = useState(false);
    const canUseAsChild = Boolean(asChild && isAsChildHost(children, treeItemAsChildHosts));
    const Component = canUseAsChild ? Slot : 'li';
    const isAmbiguous = ambiguousItemIds.has(id) ? true : ambiguousItemInstanceIds.has(instanceId);
    const isExpanded = !isAmbiguous && expandedIds.has(id);
    const setItemFocusable = useCallback((nextIsFocusable: boolean) => {
      setFocusable(nextIsFocusable);
    }, []);
    const setSelectable = useCallback(
      (nextChildrenIds: string[] | null, nextIsSelectionDisabled = false) => {
        setSelectionDisabled(nextChildrenIds !== null && nextIsSelectionDisabled);
        setSelectionChildrenIds((current) => {
          if (
            current === nextChildrenIds ||
            (current !== null &&
              nextChildrenIds !== null &&
              current.length === nextChildrenIds.length &&
              current.every((childId, index) => childId === nextChildrenIds[index]))
          ) {
            return current;
          }
          return nextChildrenIds;
        });
      },
      [],
    );
    const isSelectable = selectionChildrenIds !== null;
    const selectedChildCount = selectionChildrenIds?.filter((childId) =>
      selectedIds.has(childId),
    ).length;
    const isChecked =
      !isAmbiguous &&
      (selectionChildrenIds && selectionChildrenIds.length > 0
        ? selectedChildCount === selectionChildrenIds.length
        : selectedIds.has(id));
    const isIndeterminate =
      !isAmbiguous &&
      selectionChildrenIds !== null &&
      selectionChildrenIds.length > 0 &&
      selectedChildCount !== 0 &&
      !isChecked;

    useLayoutEffect(() => {
      if (!itemRef.current) return;
      registerActiveItem(instanceId, id, itemRef.current, isFocusable);
      return () => unregisterActiveItem(instanceId);
    }, [id, instanceId, isFocusable, registerActiveItem, unregisterActiveItem]);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLLIElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented || isAmbiguous) return;

      const tree = event.currentTarget.closest('[role="tree"]');
      const items = Array.from(
        tree?.querySelectorAll<HTMLElement>('[role="treeitem"][data-treeview-item]') ?? [],
      ).filter(
        (item) =>
          !item.closest('[data-state="closed"], [hidden], [aria-hidden="true"], [inert]') &&
          item.getAttribute('aria-disabled') !== 'true' &&
          item.closest('[role="tree"]') === tree,
      );
      const moveFocus = (item: HTMLElement | undefined) => {
        if (!item) return;
        event.preventDefault();
        item.focus();
        item.scrollIntoView?.({ block: 'nearest', inline: 'nearest' });
      };
      const directionTarget = tree ?? event.currentTarget;
      const computedDirection =
        directionTarget.ownerDocument.defaultView?.getComputedStyle(directionTarget).direction;
      const isRtl =
        computedDirection === 'rtl'
          ? true
          : computedDirection === 'ltr'
            ? false
            : direction === 'rtl';
      const intent = getTreeViewKeyboardIntent({
        hasChildren,
        isExpanded,
        isRtl,
        isSelectable,
        key: event.key,
      });
      const index = items.indexOf(event.currentTarget);

      switch (intent) {
        case 'next':
          moveFocus(items[index + 1]);
          return;
        case 'previous':
          moveFocus(items[index - 1]);
          return;
        case 'first':
          moveFocus(items[0]);
          return;
        case 'last':
          moveFocus(items.at(-1));
          return;
        case 'child':
          moveFocus(
            event.currentTarget.querySelector<HTMLElement>(
              '[role="group"] > [role="treeitem"][data-treeview-item]',
            ) ?? undefined,
          );
          return;
        case 'parent':
          moveFocus(
            event.currentTarget
              .closest('[role="group"]')
              ?.parentElement?.closest<HTMLElement>('[role="treeitem"][data-treeview-item]') ??
              undefined,
          );
          return;
        case 'select':
          event.preventDefault();
          if (!isSelectionDisabled) {
            toggleSelection(id, !isChecked, selectionChildrenIds ?? []);
          }
          return;
        case 'expand':
        case 'collapse':
        case 'toggle':
          event.preventDefault();
          toggleNode(id);
          return;
        default:
          return;
      }
    };
    const contextValue = useMemo(
      () => ({
        id,
        instanceId,
        isAmbiguous,
        childrenIds,
        hasChildren,
        setFocusable: setItemFocusable,
        setSelectable,
      }),
      [id, instanceId, isAmbiguous, childrenIds, hasChildren, setItemFocusable, setSelectable],
    );
    const itemTabIndex = isFocusable && !isAmbiguous && activeInstanceId === instanceId ? 0 : -1;
    const itemAriaSelected =
      isSelectable || hasCheckboxSelection ? undefined : !isAmbiguous && selectedIds.has(id);
    const itemAriaChecked = isSelectable ? (isIndeterminate ? 'mixed' : isChecked) : undefined;
    const renderedChildren =
      canUseAsChild && isValidElement<Record<string, unknown>>(children)
        ? cloneElement(children, {
            role: 'treeitem',
            'aria-expanded': hasChildren ? isExpanded : undefined,
            'aria-selected': itemAriaSelected,
            'aria-checked': itemAriaChecked,
            'aria-disabled': !isFocusable || isAmbiguous ? true : undefined,
            tabIndex: itemTabIndex,
            'data-treeview-item': '',
            'data-treeview-item-id': id,
            'data-selected': isSelectable ? isChecked : !isAmbiguous && selectedIds.has(id),
          })
        : asChild && !canUseAsChild
          ? getFallbackChildrenForNativeContainer(children)
          : children;

    return (
      <TreeViewItemProvider value={contextValue}>
        <Component
          ref={mergedRef}
          className={cx(classes.item, className)}
          {...props}
          role="treeitem"
          aria-expanded={hasChildren ? isExpanded : undefined}
          aria-selected={itemAriaSelected}
          aria-checked={itemAriaChecked}
          aria-disabled={!isFocusable || isAmbiguous ? true : undefined}
          tabIndex={itemTabIndex}
          data-treeview-item
          data-treeview-item-id={id}
          data-selected={isSelectable ? isChecked : !isAmbiguous && selectedIds.has(id)}
          onFocus={(event) => {
            onFocus?.(event);
            if (!event.defaultPrevented && !isAmbiguous) setActiveItem(instanceId, id);
          }}
          onKeyDown={handleKeyDown}
        >
          {renderedChildren}
        </Component>
      </TreeViewItemProvider>
    );
  },
);
TreeViewItem.displayName = 'TreeViewItem';
