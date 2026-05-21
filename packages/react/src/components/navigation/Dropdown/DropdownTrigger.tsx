'use client';

import { ActionMotion } from '@/components/animations/ActionMotion';
import { cx } from '@/styled-system/css';
import { Slot } from '@radix-ui/react-slot';
import { forwardRef } from 'react';
import type { RefObject } from 'react';
import type { DropdownTriggerProps } from './Dropdown.types';
import { useDropdownContext } from './DropdownContext';

/**
 * The interactive element that opens or closes the DropdownMenu when activated.
 * Registers itself as the Floating UI reference element for smart positioning.
 *
 * ### AI Context & Architecture
 * - Tier: Atoms, Stack: ActionMotion (press), Radix Slot (asChild),
 *   Floating UI (`refs.setReference`, `getReferenceProps`).
 * ### Design Tokens
 * - spacing: silver-ratio tokens, colors: layout.surface/layout.divider
 * ### Variant Logic
 * - Single: Toggles the menu open/closed. Uses `aria-expanded` to communicate
 *   state to assistive technology.
 * @example
 * ```tsx
 * // Default: renders as <button>
 * <DropdownTrigger>Actions ▼</DropdownTrigger>
 *
 * // asChild: delegate to a custom element
 * <DropdownTrigger asChild>
 *   <a href="#">File ▼</a>
 * </DropdownTrigger>
 * ```
 * ### Notes
 * Uses a merged ref callback to satisfy both the consumer's `ref` and Floating UI's
 *   reference setter simultaneously. Do NOT manage the Floating UI reference externally.
 * ### Accessibility
 * - Sets `aria-expanded` on the trigger automatically. For keyboard users, Space/Enter
 *   opens the menu and Escape closes it.
 * ### AI Usage
 * - Use exactly once inside each `<Dropdown>` root. Never place inside `<DropdownMenu>`.
 */
export const DropdownTrigger = forwardRef<HTMLElement, DropdownTriggerProps>(
  ({ asChild, className, children, ...props }, propRef) => {
    const { refs, getReferenceProps, open, classes } = useDropdownContext();

    const handleRef = (node: HTMLElement | null) => {
      refs.setReference(node);
      if (typeof propRef === 'function') {
        propRef(node);
      } else if (propRef) {
        (propRef as RefObject<HTMLElement | null>).current = node;
      }
    };

    const Component = asChild ? Slot : 'button';

    return (
      <ActionMotion asChild animationType="press">
        <Component
          ref={handleRef}
          type={asChild ? undefined : 'button'}
          aria-expanded={open}
          className={cx(classes.trigger, className)}
          {...getReferenceProps(props)}
        >
          {children}
        </Component>
      </ActionMotion>
    );
  },
);

DropdownTrigger.displayName = 'Dropdown.Trigger';
