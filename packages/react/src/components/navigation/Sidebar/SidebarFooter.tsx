'use client';

import { cx } from '@/styled-system/css';
import { forwardRef } from 'react';
import type { SidebarFooterProps } from './Sidebar.types';
import { useSidebar } from './SidebarContext';

/**
 * The bottom section of the Sidebar, typically used for user profiles or secondary actions.
 */
export const SidebarFooter = forwardRef<HTMLElement, SidebarFooterProps>((props, ref) => {
  const {
    className,
    asChild: _unsupportedAsChild,
    ...rest
  } = props as SidebarFooterProps & {
    asChild?: boolean;
  };
  const { classes } = useSidebar();
  return <footer ref={ref} className={cx(classes.footer, className)} {...rest} />;
});

SidebarFooter.displayName = 'SidebarFooter';
