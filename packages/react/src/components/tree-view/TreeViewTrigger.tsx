'use client';

import { cloneElement, forwardRef, isValidElement, useLayoutEffect } from 'react';
import { Slot, Slottable } from '@radix-ui/react-slot';
import { cx } from '@/styled-system/css';
import { ChevronRightIcon } from '@/components/media/Icon/icons';
import { TreeViewTriggerProps } from './TreeView.types';
import { useTreeViewContext, useTreeViewItemContext } from './TreeViewContext';
import { getFallbackChildrenForNativeButton } from '@/components/shared/asChild';
import { getSafeInteractiveContent } from '@/components/shared/getSafeInteractiveContent';
import { TreeViewLabel } from './TreeViewLabel';
import { guardDisabledActivationHandlers } from '@poffy-ui/behavior/activation';

const isNativeButtonAsChildHost = (children: React.ReactNode) =>
  isValidElement(children) && children.type === 'button';

/**
 * Toggles an expandable TreeViewItem through a native button.
 *
 * Use one per expandable item and keep other interactive controls outside it
 * so tree keyboard navigation stays unambiguous. Delegation accepts only a
 * native button; unsupported children fall back to one. The trigger itself is
 * outside the roving tab sequence, and disabled or ambiguous items cannot toggle.
 */
export const TreeViewTrigger = forwardRef<HTMLButtonElement, TreeViewTriggerProps>(
  (
    {
      children,
      className,
      hideIndicator,
      asChild,
      disabled = false,
      'aria-disabled': ariaDisabled,
      onClick,
      onFocus,
      onKeyDown,
      ...props
    },
    ref,
  ) => {
    const { expandedIds, toggleNode, classes } = useTreeViewContext();
    const itemContext = useTreeViewItemContext();
    const id = itemContext.id;
    const isExpanded = !itemContext.isAmbiguous && expandedIds.has(id);
    const isExpandable = itemContext.hasChildren === true;
    const isDisabled = [
      disabled,
      itemContext.isAmbiguous,
      ariaDisabled === true,
      ariaDisabled === 'true',
    ].some(Boolean);
    const canUseAsChild = Boolean(asChild && isNativeButtonAsChildHost(children));

    const shouldHideIndicator = hideIndicator ?? !itemContext.hasChildren;

    useLayoutEffect(() => {
      itemContext.setFocusable(!isDisabled);
      return () => itemContext.setFocusable(false);
    }, [isDisabled, itemContext]);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (isDisabled) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      onClick?.(e);
      if (e.defaultPrevented) return;
      if (!isExpandable) return;
      toggleNode(id);
    };

    const Component = canUseAsChild ? Slot : 'button';
    const triggerChildren =
      asChild && !canUseAsChild ? getFallbackChildrenForNativeButton(children) : children;
    const guardedChildren = guardDisabledActivationHandlers(
      triggerChildren,
      canUseAsChild && isDisabled,
    );
    const renderedChildren =
      canUseAsChild && isValidElement<{ children?: React.ReactNode }>(guardedChildren)
        ? cloneElement(
            guardedChildren,
            undefined,
            getSafeInteractiveContent(guardedChildren.props.children, { preserveOpaque: true }),
          )
        : Array.isArray(guardedChildren)
          ? guardedChildren.map((child) =>
              isValidElement(child) && child.type === TreeViewLabel
                ? child
                : getSafeInteractiveContent(child, { preserveOpaque: true }),
            )
          : isValidElement(guardedChildren) && guardedChildren.type === TreeViewLabel
            ? guardedChildren
            : getSafeInteractiveContent(guardedChildren, { preserveOpaque: true });
    const ownedChildren =
      canUseAsChild && isValidElement<Record<string, unknown>>(renderedChildren)
        ? cloneElement(renderedChildren, {
            tabIndex: -1,
            'aria-expanded': shouldHideIndicator ? undefined : isExpanded,
            'aria-disabled': isDisabled ? true : undefined,
            disabled: isDisabled,
            type: 'button',
          })
        : renderedChildren;

    return (
      <Component
        ref={ref}
        className={cx(classes.trigger, className)}
        onClick={handleClick}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
        {...props}
        disabled={canUseAsChild ? undefined : isDisabled}
        aria-disabled={isDisabled ? true : undefined}
        tabIndex={-1}
        data-treeview-trigger
        data-treeview-trigger-id={id}
        aria-expanded={shouldHideIndicator ? undefined : isExpanded}
        type={canUseAsChild ? undefined : 'button'}
      >
        <span
          className={classes.indicator}
          data-state={isExpanded ? 'expanded' : 'collapsed'}
          data-hidden={shouldHideIndicator ? '' : undefined}
        >
          <ChevronRightIcon />
        </span>
        <Slottable>{ownedChildren}</Slottable>
      </Component>
    );
  },
);
TreeViewTrigger.displayName = 'TreeViewTrigger';
