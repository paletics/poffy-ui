'use client';

import { forwardRef } from 'react';
import { cx } from '@/styled-system/css';
import { TreeViewCheckboxProps } from './TreeView.types';
import { useTreeViewContext, useTreeViewItemContext } from './TreeViewContext';
import { Checkbox } from '../inputs/Checkbox';

/**
 * A specialized checkbox for TreeViewItems that integrates with the TreeView context
 * to support cascading selection logic and indeterminate states automatically.
 *
 * ### Notes
 * Use only in selectable trees. Provide `childrenIds` when a parent checkbox
 * should select or clear all descendants; otherwise only the current item ID is
 * affected.
 *
 * ### AI Context & Architecture
 * - **Tier**: Atoms
 * - **Stack**: Checkbox, TreeView context
 * - **Props**: TreeViewCheckboxProps
 *
 * ### Design Tokens
 * - **layout**: inherits row alignment from the tree item and checkbox sizing from `Checkbox`.
 * - **color**: uses standard checkbox checked and indeterminate state tokens.
 *
 * ### Variant Logic
 * - Tree selection state is contextual; do not pass independent `checked` state.
 *
 * ### Accessibility
 * - **Role**: checkbox.
 * - **Keyboard**: Space toggles selection when the checkbox is focused.
 * - **Required**: provide `childrenIds` for parent nodes when selection should cascade to descendants.
 *
 * ### AI Usage
 * - Do: place near the label inside the item trigger/content composition.
 * - Don't: use for non-tree forms; use the standard Checkbox component.
 *
 * @example Cascading selection
 * ```tsx
 * import { TreeViewCheckbox } from '@poffy-ui/react/tree-view';
 *
 * <TreeViewCheckbox childrenIds={['child-1', 'child-2']} aria-label="Select folder" />
 * ```
 */
export const TreeViewCheckbox = forwardRef<HTMLInputElement, Omit<TreeViewCheckboxProps, 'size'>>(
  ({ className, childrenIds, onClick, onChange, ...props }, ref) => {
    const { selectedIds, toggleSelection } = useTreeViewContext();
    const { id, childrenIds: contextChildrenIds } = useTreeViewItemContext();

    const resolvedChildrenIds = childrenIds ?? contextChildrenIds ?? [];

    const isChecked = selectedIds.has(id);
    let isIndeterminate = false;

    if (!isChecked && resolvedChildrenIds.length > 0) {
      const someChildrenSelected = resolvedChildrenIds.some((childId: string) =>
        selectedIds.has(childId),
      );
      isIndeterminate = someChildrenSelected;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      toggleSelection(id, e.target.checked, resolvedChildrenIds);
      onChange?.(e);
    };

    const handleCheckboxClick = (e: React.MouseEvent<HTMLInputElement>) => {
      e.stopPropagation();
      onClick?.(e);
    };

    return (
      <Checkbox
        ref={ref}
        className={cx('treeview-checkbox', className)}
        checked={isChecked}
        indeterminate={isIndeterminate}
        onChange={handleChange}
        onClick={handleCheckboxClick}
        {...props}
      />
    );
  },
);
TreeViewCheckbox.displayName = 'TreeViewCheckbox';
