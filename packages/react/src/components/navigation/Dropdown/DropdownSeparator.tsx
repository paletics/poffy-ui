'use client';

import { cx } from '@/styled-system/css';
import { Slot } from '@radix-ui/react-slot';
import { ElementType, forwardRef } from 'react';
import type { DropdownSeparatorProps } from './Dropdown.types';
import { useDropdownContext } from './DropdownContext';

/**
 * A decorative horizontal rule that visually divides groups of items within a DropdownMenu.
 *
 * ### AI Context & Architecture
 * - Tier: Atoms, Stack: Radix Slot (asChild), Panda CSS (Recipe: dropdown via context)
 * ### Design Tokens
 * - color: layout.divider, height: 1px
 * ### Accessibility
 * - Renders with `role="separator"`. Screen readers will announce it as a visual divider.
 * @example
 * ```tsx
 * <DropdownMenu>
 *   <DropdownItem>Edit</DropdownItem>
 *   <DropdownSeparator />
 *   <DropdownItem>Delete</DropdownItem>
 * </DropdownMenu>
 * ```
 * ### AI Usage
 * - Use between logical DropdownItem groups to provide visual hierarchy.
 */
export const DropdownSeparator = forwardRef<HTMLElement, DropdownSeparatorProps>(
  ({ asChild, className, ...props }, ref) => {
    const { classes } = useDropdownContext();
    const Component = (asChild ? Slot : 'div') as ElementType;

    return (
      <Component
        ref={ref}
        role="separator"
        className={cx(classes.separator, className)}
        {...props}
      />
    );
  },
);

DropdownSeparator.displayName = 'Dropdown.Separator';
