'use client';

import { cx } from '@/styled-system/css';
import { contextMenu } from '@/styled-system/recipes';
import React, { forwardRef } from 'react';
import type { ContextMenuItem as ItemType } from './ContextMenu.types';
import { getSafeMenuItemContent } from './getSafeMenuItemContent';

type ContextMenuSlots = ReturnType<typeof contextMenu>;

interface ContextMenuItemProps extends React.HTMLAttributes<HTMLDivElement> {
  item: ItemType;
  onClose: () => void;
  index: number;
  recipeClasses: ContextMenuSlots;
}

/**
 * Internal component used by ContextMenu to render action items and separators.
 */
export const ContextMenuItem = forwardRef<HTMLDivElement, ContextMenuItemProps>((props, ref) => {
  const {
    item,
    onClose,
    recipeClasses,
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
    if (!e.defaultPrevented) onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e);
  };

  const resolvedTabIndex = item.disabled ? -1 : (tabIndex ?? 0);
  const runtimeLabel = item.label as React.ReactNode;
  const safeLabel = getSafeMenuItemContent(runtimeLabel);
  const needsRuntimeAccessibleFallback =
    typeof runtimeLabel === 'string' ? runtimeLabel.trim().length === 0 : true;
  return (
    <div
      ref={ref}
      role="menuitem"
      tabIndex={resolvedTabIndex}
      className={cx(recipeClasses.item, item.className, className)}
      data-intent={item.danger ? 'danger' : undefined}
      aria-disabled={item.disabled}
      aria-label={
        needsRuntimeAccessibleFallback ? (item.id ?? 'Context menu item') : undefined
      }
      data-context-menu-index={_index}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      {...rest}
    >
      <div className={recipeClasses.itemContent}>
        {item.icon && (
          <span className={recipeClasses.itemIcon} aria-hidden="true" inert>
            {item.icon}
          </span>
        )}
        <span className={recipeClasses.itemLabel}>{safeLabel}</span>
      </div>

      {item.shortcut && (
        <span className={recipeClasses.itemShortcut} aria-hidden="true">
          {item.shortcut}
        </span>
      )}
    </div>
  );
});

ContextMenuItem.displayName = 'ContextMenuItem';
