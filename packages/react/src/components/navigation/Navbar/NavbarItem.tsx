'use client';

import { cx } from '@/styled-system/css';
import { forwardRef } from 'react';
import type { NavbarItemProps } from './Navbar.types';
import { useNavbar } from './NavbarContext';

/**
 * A wrapper for individual navigation links or elements within NavbarContent.
 */
export const NavbarItem = forwardRef<HTMLDivElement, NavbarItemProps>((props, ref) => {
  const { className, ...rest } = props;
  const classes = useNavbar();
  return <div ref={ref} className={cx(classes.item, className)} {...rest} />;
});

NavbarItem.displayName = 'NavbarItem';
