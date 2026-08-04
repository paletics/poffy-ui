'use client';

import { cx } from '@/styled-system/css';
import { Slot } from '@radix-ui/react-slot';
import { cloneElement, ElementType, forwardRef } from 'react';
import type { DropdownSeparatorProps } from './Dropdown.types';
import { useDropdownContext } from './DropdownContext';
import { isDropdownSeparatorAsChildHost } from './Dropdown.asChild';

/** Renders a non-focusable separator between logical Dropdown menu-item groups. */
export const DropdownSeparator = forwardRef<HTMLElement, DropdownSeparatorProps>(
  (rawProps, ref) => {
    const {
      asChild,
      className,
      children,
      role: _role,
      tabIndex: _tabIndex,
      contentEditable: _contentEditable,
      ...props
    } = rawProps as DropdownSeparatorProps & {
      contentEditable?: unknown;
      role?: unknown;
      tabIndex?: unknown;
    };
    const { classes } = useDropdownContext();
    const asChildHost = asChild && isDropdownSeparatorAsChildHost(children) ? children : null;
    const Component = (asChildHost ? Slot : 'div') as ElementType;
    const renderedChildren = asChildHost
      ? cloneElement(asChildHost, { children: undefined, role: 'separator' })
      : null;

    return (
      <Component ref={ref} className={cx(classes.separator, className)} {...props} role="separator">
        {renderedChildren}
      </Component>
    );
  },
);

DropdownSeparator.displayName = 'Dropdown.Separator';
