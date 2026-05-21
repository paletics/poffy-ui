'use client';

import { cx } from '@/styled-system/css';
import { forwardRef } from 'react';
import type { SidebarContentProps } from './Sidebar.types';
import { useSidebar } from './SidebarContext';

/**
 * The main scrollable content area of the Sidebar, containing navigation groups and items.
 */
export const SidebarContent = forwardRef<HTMLDivElement, SidebarContentProps>((props, ref) => {
  const { className, ...rest } = props;
  const { classes } = useSidebar();
  return <div ref={ref} className={cx(classes.content, className)} {...rest} />;
});

SidebarContent.displayName = 'SidebarContent';
