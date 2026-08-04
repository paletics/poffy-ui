'use client';

import { OverlayTransition } from '@/components/animations/OverlayTransition/OverlayTransition';
import { getFallbackChildrenForNativeContainer, isAsChildHost } from '@/components/shared/asChild';
import { cx } from '@/styled-system/css';
import { focusAdjacentTabStop, useMergeRefs } from '@poffy-ui/behavior/hooks';
import { FloatingFocusManager } from '@floating-ui/react';
import { cloneElement, forwardRef, useLayoutEffect, useRef } from 'react';
import type { CSSProperties, KeyboardEventHandler, ReactElement } from 'react';
import type { DropdownMenuProps } from './Dropdown.types';
import { DropdownCollectionProvider } from './DropdownCollection';
import { useDropdownContext } from './DropdownContext';
import { FloatingPortalScope } from '@/components/overlay/Portal/FloatingPortalScope';

/**
 * Renders the positioned menu panel for a Dropdown. It owns menu focus management and returns focus
 * to the trigger on close; render it inside the matching Dropdown rather than positioning it manually.
 */
export const DropdownMenu = forwardRef<HTMLElement, DropdownMenuProps>((rawProps, propRef) => {
  const {
    asChild,
    className,
    children,
    portalContainer,
    style: userStyle,
    onKeyDown: consumerKeyDown,
    id: _id,
    role: _role,
    tabIndex: _tabIndex,
    'aria-labelledby': _ariaLabelledBy,
    ...props
  } = rawProps as DropdownMenuProps & {
    'aria-labelledby'?: unknown;
    id?: unknown;
    role?: unknown;
    tabIndex?: unknown;
  };
  const {
    open,
    onOpenChange,
    refs,
    floatingStyles,
    context,
    getFloatingProps,
    classes,
    reconcileItems,
    resolvedCollisionPadding,
  } = useDropdownContext();

  const mergedRef = useMergeRefs(refs.setFloating, propRef);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const {
    onKeyDown: floatingKeyDown,
    id: menuId,
    role: _floatingRole,
    tabIndex: menuTabIndex,
    'aria-labelledby': menuLabelledBy,
    ...floatingProps
  } = getFloatingProps(props);
  const ownedMenuProps = {
    id: typeof menuId === 'string' ? menuId : undefined,
    role: 'menu',
    tabIndex: typeof menuTabIndex === 'number' ? menuTabIndex : undefined,
    'aria-labelledby': typeof menuLabelledBy === 'string' ? menuLabelledBy : undefined,
  } as const;
  useLayoutEffect(() => {
    if (open) returnFocusRef.current = refs.domReference.current as HTMLElement | null;
  }, [open, refs.domReference]);
  const allowedHosts = new Set(['article', 'div', 'section', 'ul']);
  const asChildElement = asChild && isAsChildHost(children, allowedHosts) ? children : null;
  const menuChildren =
    asChild && !asChildElement ? getFallbackChildrenForNativeContainer(children) : children;
  const collection = (
    <DropdownCollectionProvider reconcileItems={reconcileItems}>
      {asChildElement ? asChildElement.props.children : menuChildren}
    </DropdownCollectionProvider>
  );
  const menuSurface = asChildElement ? (
    cloneElement(
      asChildElement as ReactElement<Record<string, unknown>>,
      ownedMenuProps,
      collection,
    )
  ) : (
    <div>{collection}</div>
  );
  const shellStyle = {
    ...userStyle,
    '--floating-fallback-padding': `${resolvedCollisionPadding}px`,
    ...floatingStyles,
  } as CSSProperties;

  const contentNode = (
    <OverlayTransition
      isVisible={open}
      keepMounted
      animationType="popover"
      asChild={Boolean(asChildElement)}
      ref={mergedRef}
      className={cx(classes.menu, className)}
      style={shellStyle}
      data-state={open ? 'open' : 'closed'}
      {...floatingProps}
      {...ownedMenuProps}
      onKeyDown={(event) => {
        const hostEvent = event as React.KeyboardEvent<HTMLElement>;
        (consumerKeyDown as KeyboardEventHandler<HTMLElement> | undefined)?.(hostEvent);
        if (event.defaultPrevented) return;
        (floatingKeyDown as KeyboardEventHandler<HTMLElement> | undefined)?.(hostEvent);
        if (event.defaultPrevented || event.key !== 'Tab') return;

        const trigger = refs.domReference.current as HTMLElement | null;
        const menu = refs.floating.current as HTMLElement | null;
        if (trigger?.isConnected) {
          const moved = focusAdjacentTabStop({
            origin: trigger,
            reverse: event.shiftKey,
            excludeRoot: menu,
          });
          if (moved) event.preventDefault();
        }
        returnFocusRef.current = null;
        onOpenChange(false);
      }}
    >
      {menuSurface}
    </OverlayTransition>
  );

  return (
    <FloatingPortalScope portalContainer={portalContainer} referenceRef={refs.reference}>
      <FloatingFocusManager
        context={context}
        disabled={!open}
        modal={false}
        returnFocus={returnFocusRef}
      >
        {contentNode}
      </FloatingFocusManager>
    </FloatingPortalScope>
  );
});

DropdownMenu.displayName = 'Dropdown.Menu';
