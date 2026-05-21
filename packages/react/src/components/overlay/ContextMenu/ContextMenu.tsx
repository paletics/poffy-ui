'use client';

import { OverlayTransition } from '@/components/animations/OverlayTransition/OverlayTransition';
import { useOptionalBrand } from '@/providers/BrandProvider';
import { useOptionalColorMode } from '@/providers/ColorModeProvider';
import { cx } from '@/styled-system/css';
import { contextMenu } from '@/styled-system/recipes';
import { FloatingPortal, useMergeRefs } from '@floating-ui/react';
import React, { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ContextMenuCombinedProps } from './ContextMenu.types';
import { ContextMenuItem } from './ContextMenuItem';
import { useContextMenu } from './useContextMenu';

/**
 * A highly customizable context menu component that appears at a specific screen coordinate.
 * Built with Floating UI for precise positioning and OverlayTransition for smooth animations.
 *
 * @example
 * ```tsx
 * import { ContextMenu } from '@poffy-ui/react/overlay';
 *
 * <ContextMenu
 *   open={isOpen}
 *   onClose={handleClose}
 *   position={{ x: 100, y: 100 }}
 *   items={[
 *     { label: 'Edit', onClick: handleEdit },
 *     { type: 'separator' },
 *     { label: 'Delete', danger: true, onClick: handleDelete }
 *   ]}
 * />
 * ```
 *
 * ### AI Context & Architecture
 * - **Tier**: Organisms
 * - **Stack**: Floating UI (`FloatingPortal`), Radix Slot, OverlayTransition
 * - **Props**: ContextMenuCombinedProps
 *
 * ### Variant Logic
 * - Menu appearance relies strictly on the `contextMenu` recipe.
 *
 * ### Accessibility
 * - **Role**: menu
 * - **Keyboard Navigation**: Implements WAI-ARIA roving tabIndex per APG menu pattern (ArrowUp/ArrowDown). Focus follows the active item.
 *
 * ### AI Usage
 * - Do: use ContextMenu for coordinate-positioned action menus opened from right-click or equivalent gestures.
 * - Don't: use ContextMenu for long-form content, form selection, or nested submenu behavior.
 */
export const ContextMenu = forwardRef<HTMLDivElement, ContextMenuCombinedProps>((props, ref) => {
  const {
    asChild,
    brand: propBrand,
    items,
    position,
    target,
    open,
    onClose,
    className,
    animationType = 'popover',
    style,
    onKeyDown: consumerKeyDown,
    ...rest
  } = props;
  const currentBrand = useOptionalBrand()?.brand;
  const resolvedColorMode = useOptionalColorMode()?.resolvedColorMode;

  const { menuProps } = useContextMenu({ open, onClose, position, target });
  const classes = contextMenu();

  const { ref: floatingRef, onKeyDown: floatingKeyDown, ...floatingProps } = menuProps;
  const mergedRef = useMergeRefs([floatingRef, ref]);

  // Indices of non-separator, non-disabled items — the only ones that receive focus
  const navigableIndices = useMemo(
    () =>
      items.reduce<number[]>((acc, item, i) => {
        if (item.type !== 'separator' && !item.disabled) acc.push(i);
        return acc;
      }, []),
    [items],
  );

  const [focusedIndex, setFocusedIndex] = useState<number>(() => navigableIndices[0] ?? -1);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const focusFrameRef = useRef<number | null>(null);

  // Reset focus to first navigable item each time the menu opens.
  // Both setState and focus are deferred to rAF so the floating element
  // is positioned before focus is applied (avoids setState-in-effect lint error).
  useEffect(() => {
    if (focusFrameRef.current !== null) {
      cancelAnimationFrame(focusFrameRef.current);
      focusFrameRef.current = null;
    }

    if (open && navigableIndices.length > 0) {
      const firstIdx = navigableIndices[0];
      focusFrameRef.current = requestAnimationFrame(() => {
        setFocusedIndex(firstIdx);
        itemRefs.current[firstIdx]?.focus();
        focusFrameRef.current = null;
      });
    }

    return () => {
      if (focusFrameRef.current !== null) {
        cancelAnimationFrame(focusFrameRef.current);
        focusFrameRef.current = null;
      }
    };
  }, [open, navigableIndices]);

  // Merge ArrowDown/ArrowUp navigation with Floating UI and consumer key handlers.
  // Escape dismiss is handled by useDismiss through a document-level listener.
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      floatingKeyDown?.(e as React.KeyboardEvent<HTMLElement>);
      consumerKeyDown?.(e as React.KeyboardEvent<HTMLDivElement>);

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const next = navigableIndices.find((i) => i > focusedIndex) ?? navigableIndices[0];
        if (next !== undefined) {
          setFocusedIndex(next);
          itemRefs.current[next]?.focus();
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prev =
          [...navigableIndices].reverse().find((i) => i < focusedIndex) ??
          navigableIndices[navigableIndices.length - 1];
        if (prev !== undefined) {
          setFocusedIndex(prev);
          itemRefs.current[prev]?.focus();
        }
      }
    },
    [focusedIndex, navigableIndices, floatingKeyDown, consumerKeyDown, setFocusedIndex],
  );

  // FloatingPortal is always rendered so OverlayTransition's AnimatePresence
  // can play the exit animation when open transitions from true → false.
  return (
    <FloatingPortal>
      <OverlayTransition
        isVisible={open}
        animationType={animationType}
        asChild={asChild}
        ref={mergedRef}
        {...floatingProps}
        className={cx(classes.content, className)}
        // Floating UI owns runtime menu positioning; consumer style remains an external override.
        style={{ ...menuProps.style, ...style }}
        onContextMenu={(e: React.MouseEvent) => e.preventDefault()}
        onKeyDown={handleKeyDown}
        data-brand={propBrand ?? currentBrand ?? 'blue'}
        data-theme={resolvedColorMode ?? 'light'}
        {...rest}
      >
        {items.map((item, index) => (
          <ContextMenuItem
            key={item.id ?? `item-${index}`}
            ref={(node: HTMLDivElement | null) => {
              itemRefs.current[index] = node;
            }}
            item={item}
            index={index}
            onClose={onClose}
            recipeClasses={classes}
            tabIndex={index === focusedIndex ? 0 : -1}
            onFocus={() => setFocusedIndex(index)}
          />
        ))}
      </OverlayTransition>
    </FloatingPortal>
  );
});

ContextMenu.displayName = 'ContextMenu';
