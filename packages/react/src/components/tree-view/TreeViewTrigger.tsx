'use client';

import { forwardRef } from 'react';
import { Slot, Slottable } from '@radix-ui/react-slot';
import { cx } from '@/styled-system/css';
import { ChevronRightIcon } from '@/components/media/Icon/icons';
import { TreeViewTriggerProps } from './TreeView.types';
import { useTreeViewContext, useTreeViewItemContext } from './TreeViewContext';

/**
 * The interactive element that toggles the expanded/collapsed state of a TreeViewItem.
 * Automatically handles keyboard navigation logic.
 *
 * ### Notes
 * Use once per expandable item. Keep the visible node text in `TreeViewLabel`
 * and place selection checkboxes beside the label instead of nesting extra
 * interactive controls in the trigger.
 *
 * ### AI Context & Architecture
 * - **Tier**: Atoms
 * - **Stack**: Context API, Radix Slot, ChevronRightIcon
 * - **Props**: TreeViewTriggerProps
 *
 * ### Design Tokens
 * - **layout**: uses `treeView` trigger and indicator slot classes for row spacing and icon rotation.
 * - **color**: inherits hover, selected, and focus-visible tokens from the root recipe.
 *
 * ### Accessibility
 * - **Role**: button inside a `role="treeitem"` row.
 * - **Keyboard**: Enter / Space toggles expansion; ArrowRight expands; ArrowLeft collapses.
 * - **Required**: render only one trigger per expandable item and keep interactive controls outside the trigger.
 *
 * ### AI Usage
 * - Do: use for disclosure of child nodes.
 * - Don't: use as a generic row action button.
 *
 * @example Expandable item trigger
 * ```tsx
 * import { TreeViewLabel, TreeViewTrigger } from '@poffy-ui/react/tree-view';
 *
 * <TreeViewTrigger>
 *   <TreeViewLabel>Documents</TreeViewLabel>
 * </TreeViewTrigger>
 * ```
 */
export const TreeViewTrigger = forwardRef<HTMLButtonElement, TreeViewTriggerProps>(
  ({ children, className, hideIndicator, asChild, onClick, onKeyDown, ...props }, ref) => {
    const { expandedIds, toggleNode, classes } = useTreeViewContext();
    const itemContext = useTreeViewItemContext();
    const id = itemContext.id;
    const isExpanded = expandedIds.has(id);
    const isExpandable = itemContext.hasChildren !== false;

    const shouldHideIndicator = hideIndicator ?? itemContext.hasChildren === false;

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e);
      if (e.defaultPrevented) return;
      if (!isExpandable) return;
      toggleNode(id);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
      onKeyDown?.(e);
      if (e.defaultPrevented) return;
      if (!isExpandable) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleNode(id);
      }
      if (e.key === 'ArrowRight' && !isExpanded) {
        toggleNode(id);
      } else if (e.key === 'ArrowLeft' && isExpanded) {
        toggleNode(id);
      }
    };

    const Component = asChild ? Slot : 'button';

    return (
      <Component
        ref={ref}
        className={cx(classes.trigger, className)}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        aria-expanded={shouldHideIndicator ? undefined : isExpanded}
        type={asChild ? undefined : 'button'}
        {...props}
      >
        <div
          className={classes.indicator}
          data-state={isExpanded ? 'expanded' : 'collapsed'}
          data-hidden={shouldHideIndicator ? '' : undefined}
        >
          <ChevronRightIcon />
        </div>
        <Slottable>{children}</Slottable>
      </Component>
    );
  },
);
TreeViewTrigger.displayName = 'TreeViewTrigger';
