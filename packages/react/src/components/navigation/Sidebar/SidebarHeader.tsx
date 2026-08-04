'use client';

import { cx } from '@/styled-system/css';
import { forwardRef } from 'react';
import type { SidebarHeaderProps } from './Sidebar.types';
import { useSidebar } from './SidebarContext';

/**
 * The top section of the Sidebar, typically used for logos or branding.
 */
export const SidebarHeader = forwardRef<HTMLElement, SidebarHeaderProps>((props, ref) => {
  const {
    className,
    asChild: _unsupportedAsChild,
    ...rest
  } = props as SidebarHeaderProps & {
    asChild?: boolean;
  };
  const { classes } = useSidebar();
  return <header ref={ref} className={cx(classes.header, className)} {...rest} />;
});

SidebarHeader.displayName = 'SidebarHeader';
