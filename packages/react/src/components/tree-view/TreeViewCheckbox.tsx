'use client';

import { forwardRef, useLayoutEffect, useMemo, useRef } from 'react';
import { cx } from '@/styled-system/css';
import { TreeViewCheckboxProps } from './TreeView.types';
import { useTreeViewContext, useTreeViewItemContext } from './TreeViewContext';
import { Checkbox } from '../inputs/Checkbox';

/**
 * Reflects selection state owned by its TreeViewItem.
 *
 * Provide `childrenIds` when a parent toggle should cascade to descendants;
 * this component does not accept independent checked state. Its native input
 * is hidden from assistive technology and removed from tab order because the
 * owning treeitem exposes the selection state. Pointer interaction restores
 * focus to that item.
 */
export const TreeViewCheckbox = forwardRef<HTMLInputElement, Omit<TreeViewCheckboxProps, 'size'>>(
  ({ className, childrenIds, disabled = false, onClick, onChange, onMouseDown, ...props }, ref) => {
    const { selectedIds, toggleSelection, registerCheckboxItem } = useTreeViewContext();
    const {
      id,
      childrenIds: contextChildrenIds,
      isAmbiguous,
      setSelectable,
    } = useTreeViewItemContext();
    const isDisabled = disabled || isAmbiguous;

    const resolvedChildrenIds = useMemo(
      () => childrenIds ?? contextChildrenIds ?? [],
      [childrenIds, contextChildrenIds],
    );

    useLayoutEffect(() => {
      const unregisterCheckboxItem = registerCheckboxItem();
      setSelectable(resolvedChildrenIds, isDisabled);
      return () => {
        unregisterCheckboxItem();
        setSelectable(null);
      };
    }, [isDisabled, registerCheckboxItem, resolvedChildrenIds, setSelectable]);

    const selectedChildCount = resolvedChildrenIds.filter((childId) =>
      selectedIds.has(childId),
    ).length;
    const isParent = resolvedChildrenIds.length > 0;
    const isChecked =
      !isAmbiguous &&
      (isParent ? selectedChildCount === resolvedChildrenIds.length : selectedIds.has(id));
    const isIndeterminate = !isAmbiguous && isParent && selectedChildCount > 0 && !isChecked;
    const renderedStateRef = useRef({ checked: isChecked, indeterminate: isIndeterminate });
    useLayoutEffect(() => {
      renderedStateRef.current = { checked: isChecked, indeterminate: isIndeterminate };
    }, [isChecked, isIndeterminate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (isDisabled) return;
      onChange?.(e);
      if (e.defaultPrevented) {
        const input = e.currentTarget;
        queueMicrotask(() => {
          if (!input.isConnected) return;
          input.checked = renderedStateRef.current.checked;
          input.indeterminate = renderedStateRef.current.indeterminate;
        });
        return;
      }
      toggleSelection(id, e.target.checked, resolvedChildrenIds);
    };

    const handleCheckboxClick = (e: React.MouseEvent<HTMLInputElement>) => {
      e.stopPropagation();
      onClick?.(e);
      if (isDisabled || e.defaultPrevented) return;
      e.currentTarget.closest<HTMLElement>('[role="treeitem"]')?.focus();
    };

    const handleCheckboxMouseDown = (e: React.MouseEvent<HTMLInputElement>) => {
      onMouseDown?.(e);
      if (isDisabled || e.defaultPrevented) return;
      // The native input is intentionally aria-hidden and excluded from the
      // roving tab order. Keep pointer focus on its owning tree item instead.
      e.preventDefault();
    };

    return (
      <Checkbox
        ref={ref}
        className={cx('treeview-checkbox', className)}
        {...props}
        disabled={isDisabled}
        checked={isChecked}
        indeterminate={isIndeterminate}
        tabIndex={-1}
        aria-hidden
        onChange={handleChange}
        onClick={handleCheckboxClick}
        onMouseDown={handleCheckboxMouseDown}
      />
    );
  },
);
TreeViewCheckbox.displayName = 'TreeViewCheckbox';
