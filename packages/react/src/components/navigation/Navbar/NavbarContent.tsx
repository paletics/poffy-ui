'use client';

import { cx } from '@/styled-system/css';
import { navbar } from '@/styled-system/recipes';
import { forwardRef, useContext } from 'react';
import type { NavbarContentProps } from './Navbar.types';
import { NavbarContext } from './NavbarContext';

/**
 * A flexible container for navigation items or actions within the Navbar.
 * Supports horizontal alignment via the `justify` prop.
 *
 * ### AI Context & Architecture
 * `justify` is mapped to the Navbar slot recipe. 'between' maps to `space-between`.
 */
export const NavbarContent = forwardRef<HTMLDivElement, NavbarContentProps>((props, ref) => {
  const { className, justify, ...rest } = props;
  const contextClasses = useContext(NavbarContext);
  const classes = justify ? navbar({ justify }) : contextClasses;

  if (!classes) {
    throw new Error('NavbarContent must be used within a <Navbar /> component');
  }

  return <div ref={ref} className={cx(classes.content, className)} {...rest} />;
});

NavbarContent.displayName = 'NavbarContent';
