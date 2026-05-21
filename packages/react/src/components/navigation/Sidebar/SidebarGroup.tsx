'use client';

import { cx } from '@/styled-system/css';
import { forwardRef, useId } from 'react';
import type { SidebarGroupProps } from './Sidebar.types';
import { useSidebar } from './SidebarContext';

/**
 * A container for grouping navigation items within the Sidebar, with an optional label.
 *
 * ### AI Context & Architecture
 * When a label is provided, a unique ID is generated via useId and bound to the group
 * container via aria-labelledby, so screen readers announce the group heading before
 * reading the items inside it.
 */
export const SidebarGroup = forwardRef<HTMLDivElement, SidebarGroupProps>((props, ref) => {
  const { children, className, label, ...rest } = props;
  const { classes, collapsed } = useSidebar();
  const labelId = useId();

  // When collapsed, the label element has display:none (removed from the a11y tree).
  // Pointing aria-labelledby at a hidden element produces an invalid reference,
  // so we only apply it when the label is actually visible.
  const labelledBy = label && !collapsed ? labelId : undefined;

  return (
    <div
      ref={ref}
      role="group"
      aria-labelledby={labelledBy}
      className={cx(classes.group, className)}
      {...rest}
    >
      {label && (
        <div id={labelId} className={classes.label}>
          {label}
        </div>
      )}
      {children}
    </div>
  );
});

SidebarGroup.displayName = 'SidebarGroup';
