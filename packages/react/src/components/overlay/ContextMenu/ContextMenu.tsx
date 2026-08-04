'use client';

import { OverlayTransition } from '@/components/animations/OverlayTransition/OverlayTransition';
import { FloatingTreeBoundary } from '@/components/overlay/shared/FloatingTreeBoundary';
import { useOptionalBrand } from '@/providers/BrandProvider';
import { useOptionalColorMode } from '@/providers/ColorModeProvider';
import { useOptionalLocale } from '@/providers/LocaleProvider';
import { getCommonMessages } from '@/components/shared/common.locales';
import { cx } from '@/styled-system/css';
import { contextMenu } from '@/styled-system/recipes';
import { sanitizeControlledMotionProps } from '@/types/motion';
import {
  focusAdjacentTabStop,
  getDeepActiveElement,
  getDOMTreeRoot,
} from '@poffy-ui/behavior/hooks';
import { FloatingNode, useFloatingNodeId, useMergeRefs } from '@floating-ui/react';
import React, { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type {
  ContextMenuProps,
  ContextMenuItem as ContextMenuItemDefinition,
} from './ContextMenu.types';
import { ContextMenuItem } from './ContextMenuItem';
import { useContextMenu } from './useContextMenu';
import { FloatingPortalScope } from '../Portal/FloatingPortalScope';
import type { PortalOwnerDocument } from '../Portal/Portal.types';

const isTabSequenceOrigin = (element: HTMLElement) =>
  element.tabIndex >= 0 &&
  element.matches(
    'a[href], area[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [contenteditable]:not([contenteditable="false"]), [tabindex]',
  );

const resolveOwnerDocument = (source: PortalOwnerDocument | undefined) =>
  typeof source === 'function' ? source() : source;

const getPortalContainerOwnerDocument = (container: ContextMenuProps['portalContainer']) =>
  typeof container === 'function' ? undefined : container?.ownerDocument;

let didReportLegacySubmenu = false;

interface RuntimeContextMenuItem {
  type?: unknown;
  children?: unknown;
  [key: string]: unknown;
}

const isLegacySubmenu = (item: ContextMenuItemDefinition) =>
  (item as unknown as RuntimeContextMenuItem).type === 'submenu';


const ContextMenuRoot = forwardRef<HTMLDivElement, ContextMenuProps>((props, ref) => {
  const {
    // ContextMenu always owns a div menu surface. Consume legacy runtime values so they cannot
    // reach OverlayTransition; the public type deliberately no longer exposes either prop.
    asChild: _asChild,
    children: _children,
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
    onKeyDownCapture: consumerKeyDownCapture,
    role: _role,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    portalContainer,
    ownerDocument,
    ...rest
  } = props as ContextMenuProps & {
    asChild?: boolean;
    children?: React.ReactNode;
    role?: unknown;
  };
  const currentBrand = useOptionalBrand()?.brand;
  const resolvedColorMode = useOptionalColorMode()?.resolvedColorMode;
  const defaultAccessibleName = getCommonMessages(useOptionalLocale()?.locale).contextMenu;
  const safeRest = sanitizeControlledMotionProps(rest);
  const supportedItems = useMemo(() => items.filter((item) => !isLegacySubmenu(item)), [items]);

  const nodeId = useFloatingNodeId();
  const { menuProps } = useContextMenu({ open, onClose, position, target, nodeId });
  const classes = contextMenu();

  const { ref: floatingRef, onKeyDown: floatingKeyDown, ...floatingProps } = menuProps;
  const menuSurfaceRef = useRef<HTMLDivElement | null>(null);

  // Indices of non-separator, non-disabled items — the only ones that receive focus
  const navigableIndices = useMemo(
    () =>
      supportedItems.reduce<number[]>((acc, item, i) => {
        if (item.type !== 'separator' && !item.disabled) acc.push(i);
        return acc;
      }, []),
    [supportedItems],
  );
  const focusSignature = navigableIndices.join(',');
  const setMenuSurfaceRef = useCallback((node: HTMLDivElement | null) => {
    menuSurfaceRef.current = node;
  }, []);
  const mergedRef = useMergeRefs([floatingRef, ref, setMenuSurfaceRef]);

  const [focusedIndex, setFocusedIndex] = useState<number>(() => navigableIndices[0] ?? -1);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const suppressReturnFocusRef = useRef(false);
  const wasOpenRef = useRef(open);
  const getOwnerDocument = useCallback(
    () =>
      target?.ownerDocument ??
      resolveOwnerDocument(ownerDocument) ??
      getPortalContainerOwnerDocument(portalContainer) ??
      (typeof document === 'undefined' ? undefined : document),
    [ownerDocument, portalContainer, target],
  );
  const resolvedOwnerDocument = getOwnerDocument();
  const [lastPortalOwnerDocument, setLastPortalOwnerDocument] = useState(resolvedOwnerDocument);
  useEffect(() => {
    if (!open || lastPortalOwnerDocument === resolvedOwnerDocument) return;
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      setLastPortalOwnerDocument((current) =>
        current === resolvedOwnerDocument ? current : resolvedOwnerDocument,
      );
    });
    return () => {
      active = false;
    };
  }, [lastPortalOwnerDocument, open, resolvedOwnerDocument]);
  // Keep the portal rooted in the document chosen while open. Context-menu
  // consumers commonly clear `target` as they close; recalculating from that
  // cleared target would move an iframe menu back to the ambient document and
  // interrupt AnimatePresence before its exit frame can finish.
  const portalOwnerDocument = open ? resolvedOwnerDocument : lastPortalOwnerDocument;

  useEffect(() => {
    if (didReportLegacySubmenu || !items.some(isLegacySubmenu)) return;
    const nodeEnv = (globalThis as { process?: { env?: { NODE_ENV?: string } } }).process?.env
      ?.NODE_ENV;
    if (nodeEnv === 'production') return;

    didReportLegacySubmenu = true;
    console.warn(
      '[ContextMenu] Unsupported legacy `submenu` data was ignored; use a regular action item or a separately managed ContextMenu.',
    );
  }, [items]);

  useEffect(() => {
    if (!open) return;
    const ownerWindow = getOwnerDocument()?.defaultView;
    const timeoutId = ownerWindow?.setTimeout(() => {
      const surface = menuSurfaceRef.current;
      if (!surface?.isConnected) return;
      const firstItem = surface.querySelector<HTMLElement>(
        '[data-context-menu-index]:not([aria-disabled="true"])',
      );
      (firstItem ?? surface).focus();
    }, 0);
    return () => {
      if (timeoutId !== undefined) ownerWindow?.clearTimeout(timeoutId);
    };
  }, [focusSignature, getOwnerDocument, open]);

  useEffect(() => {
    if (open) {
      const ownerDocument = getOwnerDocument();
      const focusRoot = target ?? menuSurfaceRef.current ?? ownerDocument;
      const activeElement = focusRoot ? getDeepActiveElement(getDOMTreeRoot(focusRoot)) : null;
      const HTMLElementConstructor = ownerDocument?.defaultView?.HTMLElement;
      returnFocusRef.current =
        target?.isConnected && isTabSequenceOrigin(target)
          ? target
          : HTMLElementConstructor && activeElement instanceof HTMLElementConstructor
            ? activeElement
            : null;
    } else if (wasOpenRef.current && suppressReturnFocusRef.current) {
      suppressReturnFocusRef.current = false;
    } else if (wasOpenRef.current && returnFocusRef.current?.isConnected) {
      const ownerDocument = returnFocusRef.current.ownerDocument;
      const focusRoot = menuSurfaceRef.current ?? returnFocusRef.current ?? ownerDocument;
      const activeElement = getDeepActiveElement(getDOMTreeRoot(focusRoot));
      // Preserve a focus move made by an item action (for example, into the
      // panel it just opened). Only restore when focus is still in the menu or
      // has fallen back to the document body during teardown.
      if (
        activeElement === ownerDocument?.body ||
        activeElement === returnFocusRef.current ||
        (activeElement !== null && menuSurfaceRef.current?.contains(activeElement))
      ) {
        returnFocusRef.current.focus();
      }
    }
    wasOpenRef.current = open;
  }, [getOwnerDocument, open, target]);

  // Merge Escape/Arrow navigation with Floating UI and consumer key handlers.
  const handleKeyDownCapture = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      consumerKeyDownCapture?.(e);
    },
    [consumerKeyDownCapture],
  );
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      consumerKeyDown?.(e as React.KeyboardEvent<HTMLDivElement>);
      if (e.defaultPrevented) return;
      floatingKeyDown?.(e as React.KeyboardEvent<HTMLElement>);
      if (e.defaultPrevented) return;

      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (e.key === 'Tab') {
        const origin = returnFocusRef.current;
        if (origin?.isConnected) {
          const moved = focusAdjacentTabStop({
            origin,
            reverse: e.shiftKey,
            excludeRoot: menuSurfaceRef.current,
          });
          if (moved) e.preventDefault();
          else origin.focus();
        }
        suppressReturnFocusRef.current = true;
        onClose();
        return;
      }

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
      } else if (e.key === 'Enter' || e.key === ' ') {
        const itemElement = (e.target as HTMLElement).closest<HTMLElement>(
          '[data-context-menu-index]',
        );
        const index = Number(itemElement?.getAttribute('data-context-menu-index'));
        const item = Number.isInteger(index) ? supportedItems[index] : undefined;
        if (!item || item.type === 'separator' || item.disabled) return;

        e.stopPropagation();
        item.onClick?.(e);
        const shouldClose = !e.defaultPrevented;
        e.preventDefault();
        if (shouldClose) onClose();
      }
    },
    [
      consumerKeyDown,
      focusedIndex,
      supportedItems,
      navigableIndices,
      floatingKeyDown,
      onClose,
      setFocusedIndex,
    ],
  );

  // FloatingPortal is always rendered so OverlayTransition's AnimatePresence
  // can play the exit animation when open transitions from true → false.
  // Floating UI resets `isPositioned` when the menu closes. Preserve its last
  // visible style for this render so the Motion exit frame is not hidden before
  // AnimatePresence has finished removing the surface.
  // `useContextMenu` resets `isPositioned` immediately on close. This ref is
  // intentionally not cleared: after the first open, the menu only exists
  // while Motion retains it for exit, so every exit re-render keeps its last
  // visible frame instead of applying Floating UI's `visibility: hidden`.
  const isExiting = !open;
  return (
    <FloatingNode id={nodeId}>
      <FloatingPortalScope portalContainer={portalContainer} ownerDocument={portalOwnerDocument}>
        <OverlayTransition
          isVisible={open}
          animationType={animationType}
          ref={mergedRef}
          {...floatingProps}
          {...safeRest}
          aria-label={ariaLabel ?? (ariaLabelledBy ? undefined : defaultAccessibleName)}
          aria-labelledby={ariaLabelledBy}
          className={cx(classes.content, className)}
          tabIndex={-1}
          // Floating UI owns runtime menu positioning; consumer style remains an external override.
          style={{ ...menuProps.style, ...(isExiting ? { visibility: 'visible' } : {}), ...style }}
          onContextMenu={(e: React.MouseEvent) => e.preventDefault()}
          onKeyDownCapture={handleKeyDownCapture}
          onKeyDown={handleKeyDown}
          data-brand={propBrand ?? currentBrand ?? 'blue'}
          data-theme={resolvedColorMode ?? 'light'}
          data-state={open ? 'open' : 'closed'}
        >
          {supportedItems.map((item, index) => (
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
      </FloatingPortalScope>
    </FloatingNode>
  );
});

ContextMenuRoot.displayName = 'ContextMenuRoot';

/**
 * Renders a fully controlled action menu at coordinates or beside an element.
 *
 * Enabled non-separator items receive roving focus. Arrow keys wrap between
 * them, Enter/Space activates an item, Escape requests close, and Tab closes
 * while moving from the original focus origin to the adjacent tab stop. Focus
 * is restored on ordinary dismissal but not when an action has moved it.
 * Unsupported legacy submenu data is ignored with a development warning.
 */
export const ContextMenu = forwardRef<HTMLDivElement, ContextMenuProps>((props, ref) => (
  <FloatingTreeBoundary>
    <ContextMenuRoot {...props} ref={ref} />
  </FloatingTreeBoundary>
));

ContextMenu.displayName = 'ContextMenu';
