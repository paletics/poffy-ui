'use client';

import { cx } from '@/styled-system/css';
import { Slot } from '@radix-ui/react-slot';
import { ElementType, forwardRef } from 'react';
import type { DropdownLabelProps } from './Dropdown.types';
import { useDropdownContext } from './DropdownContext';

/**
 * A decorative label used to group and head sections within a DropdownMenu.
 * Does not participate in keyboard navigation.
 *
 * ### AI Context & Architecture
 * - Tier: Atoms, Stack: Radix Slot (asChild), Panda CSS (Recipe: dropdown via context)
 * ### Design Tokens
 * - color: text.secondary, font-size: silver-ratio scale
 * ### Variant Logic
 * - Single: Visual grouping aid. Always `role="none"` to prevent AT from
 *   announcing it as an interactive widget.
 * @example
 * ```tsx
 * <DropdownLabel>Recent Files</DropdownLabel>
 *
 * // As semantic heading
 * <DropdownLabel asChild><h4>Section Title</h4></DropdownLabel>
 * ```
 * ### Accessibility
 * - Uses `role="none"` — do not place interactive elements inside this component.
 * ### AI Usage
 * - Use to visually separate DropdownItem groups. For interactive items, use
 *   `DropdownItem` instead.
 */
export const DropdownLabel = forwardRef<HTMLElement, DropdownLabelProps>(
  ({ asChild, className, children, ...props }, ref) => {
    const { classes } = useDropdownContext();
    const Component = (asChild ? Slot : 'div') as ElementType;

    return (
      <Component
        ref={ref}
        // role="none" clarifies this is a visual grouping label, not an interactive element.
        // Prevents AT from announcing it as an unnamed interactive widget.
        role="none"
        className={cx(classes.label, className)}
        {...props}
      >
        {children}
      </Component>
    );
  },
);

DropdownLabel.displayName = 'Dropdown.Label';
