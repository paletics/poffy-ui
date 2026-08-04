'use client';

import { cx } from '@/styled-system/css';
import { forwardRef, useId } from 'react';
import type { SidebarGroupProps } from './Sidebar.types';
import { useSidebar } from './SidebarContext';

/** Groups Sidebar items and labels the group for assistive technology when a label is provided. */
export const SidebarGroup = forwardRef<HTMLDivElement, SidebarGroupProps>((props, ref) => {
  const {
    children,
    className,
    label,
    asChild: _unsupportedAsChild,
    ...rest
  } = props as SidebarGroupProps & {
    asChild?: boolean;
  };
  const { classes, collapsed } = useSidebar();
  const labelId = useId();
  const hasLabel = label !== null && label !== undefined && label !== false;

  // When collapsed, the label element has display:none (removed from the a11y tree).
  // Pointing aria-labelledby at a hidden element produces an invalid reference,
  // so we only apply it when the label is actually visible.
  const labelledBy = hasLabel && !collapsed ? labelId : undefined;

  return (
    <div
      ref={ref}
      {...rest}
      role="group"
      aria-labelledby={labelledBy}
      className={cx(classes.group, className)}
    >
      {hasLabel && (
        <div id={labelId} className={classes.label}>
          {label}
        </div>
      )}
      {children}
    </div>
  );
});

SidebarGroup.displayName = 'SidebarGroup';
