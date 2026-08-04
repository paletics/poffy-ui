'use client';

import { cx } from '@/styled-system/css';
import { Slot } from '@radix-ui/react-slot';
import { cloneElement, ElementType, forwardRef } from 'react';
import type { DropdownLabelProps } from './Dropdown.types';
import { useDropdownContext } from './DropdownContext';
import { getSafeDropdownLabelContent, isDropdownLabelAsChildHost } from './Dropdown.asChild';

/** Decorative section label for a DropdownMenu. It is excluded from menu navigation and cannot host interactive content. */
export const DropdownLabel = forwardRef<HTMLElement, DropdownLabelProps>((rawProps, ref) => {
  const {
    asChild,
    className,
    children,
    role: _role,
    tabIndex: _tabIndex,
    contentEditable: _contentEditable,
    ...props
  } = rawProps as DropdownLabelProps & {
    contentEditable?: unknown;
    role?: unknown;
    tabIndex?: unknown;
  };
  const { classes } = useDropdownContext();
  const asChildHost = asChild && isDropdownLabelAsChildHost(children) ? children : null;
  const Component = (asChildHost ? Slot : 'div') as ElementType;
  const safeContent = getSafeDropdownLabelContent(asChildHost?.props.children ?? children);
  const renderedChildren = asChildHost
    ? cloneElement(asChildHost, undefined, safeContent)
    : safeContent;

  return (
    <Component
      ref={ref}
      {...props}
      className={cx(classes.label, className)}
      role={asChildHost ? undefined : 'none'}
    >
      {renderedChildren}
    </Component>
  );
});

DropdownLabel.displayName = 'Dropdown.Label';
