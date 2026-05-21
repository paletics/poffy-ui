'use client';

import { cx } from '@/styled-system/css';
import { contextMenu } from '@/styled-system/recipes';
import { Slot } from '@radix-ui/react-slot';
import React, { forwardRef } from 'react';
import type { ContextMenuItem as ItemType } from './ContextMenu.types';

type ContextMenuSlots = ReturnType<typeof contextMenu>;

interface ContextMenuItemProps extends React.HTMLAttributes<HTMLDivElement> {
  item: ItemType;
  onClose: () => void;
  index: number;
  recipeClasses: ContextMenuSlots;
  asChild?: boolean;
}

/**
 * Internal component used by ContextMenu to render individual action items,
 * separators, or sub-menu triggers.
 */
export const ContextMenuItem = forwardRef<HTMLDivElement, ContextMenuItemProps>((props, ref) => {
  const {
    item,
    onClose,
    recipeClasses,
    asChild,
    className,
    onClick,
    onKeyDown,
    tabIndex,
    index: _index,
    ...rest
  } = props;

  if (item.type === 'separator') {
    return (
      <div
        ref={ref}
        className={cx(recipeClasses.separator, item.className)}
        role="separator"
        {...rest}
      />
    );
  }

  const handleClick = (e: React.MouseEvent<HTMLElement> | React.KeyboardEvent) => {
    if (item.disabled) return;

    e.stopPropagation();
    item.onClick?.(e);
    onClick?.(e as React.MouseEvent<HTMLDivElement>);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e);
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick(e);
    }
  };

  const resolvedTabIndex = item.disabled ? -1 : (tabIndex ?? 0);
  const Component = asChild ? Slot : 'div';

  return (
    <Component
      ref={ref}
      role="menuitem"
      tabIndex={resolvedTabIndex}
      className={cx(recipeClasses.item, item.className, className)}
      data-intent={item.danger ? 'danger' : undefined}
      aria-disabled={item.disabled}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      {...rest}
    >
      <div className={recipeClasses.itemContent}>
        {item.icon && <span className={recipeClasses.itemIcon}>{item.icon}</span>}
        <span className={recipeClasses.itemLabel}>{item.label}</span>
      </div>

      {item.type === 'submenu' ? (
        <span className={recipeClasses.itemShortcut} aria-hidden="true">
          {'>'}
        </span>
      ) : (
        item.shortcut && <span className={recipeClasses.itemShortcut}>{item.shortcut}</span>
      )}
    </Component>
  );
});

ContextMenuItem.displayName = 'ContextMenuItem';
