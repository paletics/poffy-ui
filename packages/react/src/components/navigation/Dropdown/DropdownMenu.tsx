'use client';

import { OverlayTransition } from '@/components/animations/OverlayTransition/OverlayTransition';
import { cx } from '@/styled-system/css';
import { FloatingFocusManager, FloatingPortal } from '@floating-ui/react';
import { forwardRef } from 'react';
import type { RefObject } from 'react';
import type { DropdownMenuProps } from './Dropdown.types';
import { useDropdownContext } from './DropdownContext';

/**
 * Floating panel that contains DropdownItem, DropdownLabel, and DropdownSeparator elements.
 * Mounts inside a portal for z-index safety and smart viewport-aware positioning.
 *
 * ### AI Context & Architecture
 * - Tier: Molecules, Stack: Floating UI (FloatingPortal, FloatingFocusManager),
 *   Radix Slot (asChild), OverlayTransition, Panda CSS (Recipe: dropdown via context).
 *   Keeps the portal mounted so OverlayTransition can play exit animations.
 * ### Design Tokens
 * - padding/gap: silver-ratio tokens, border-radius: md, shadow: overlay
 * ### Variant Logic
 * - Renders at its natural flex size; width is not constrained by the recipe.
 *   The consumer controls width via className.
 * @example
 * ```tsx
 * <DropdownMenu>
 *   <DropdownItem>Option 1</DropdownItem>
 *   <DropdownItem>Option 2</DropdownItem>
 * </DropdownMenu>
 *
 * // Custom container via asChild
 * <DropdownMenu asChild>
 *   <ul className={styles.myMenu}>
 *     <DropdownItem>...</DropdownItem>
 *   </ul>
 * </DropdownMenu>
 * ```
 * ### Accessibility
 * - Managed by Floating UI's `FloatingFocusManager` with `modal={false}` to allow
 *   background page interaction. Focus is returned to the trigger on close.
 * ### AI Usage
 * - Always place immediately inside `<Dropdown>`. Do NOT render outside a
 *   `<Dropdown>` context or position manually — Floating UI handles placement.
 */
export const DropdownMenu = forwardRef<HTMLElement, DropdownMenuProps>(
  ({ asChild, className, children, ...props }, propRef) => {
    const { open, refs, floatingStyles, context, getFloatingProps, classes } = useDropdownContext();

    const handleRef = (node: HTMLElement | null) => {
      refs.setFloating(node);
      if (typeof propRef === 'function') {
        propRef(node);
      } else if (propRef) {
        (propRef as RefObject<HTMLElement | null>).current = node;
      }
    };

    const contentNode = (
      <div ref={handleRef} style={floatingStyles} data-state={open ? 'open' : 'closed'}>
        <OverlayTransition
          isVisible={open}
          keepMounted
          animationType="popover"
          asChild={asChild}
          className={cx(classes.menu, className)}
          data-state={open ? 'open' : 'closed'}
          {...getFloatingProps(props)}
        >
          {children}
        </OverlayTransition>
      </div>
    );

    return (
      <FloatingPortal>
        <FloatingFocusManager context={context} modal={false} disabled={!open}>
          {contentNode}
        </FloatingFocusManager>
      </FloatingPortal>
    );
  },
);

DropdownMenu.displayName = 'Dropdown.Menu';
