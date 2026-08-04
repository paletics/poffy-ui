'use client';

import { cx } from '@/styled-system/css';
import { navbar } from '@/styled-system/recipes';
import { forwardRef } from 'react';
import type { NavbarContentProps } from './Navbar.types';
import { useNavbarContext } from './NavbarContext';

/** Flexible Navbar region for items or actions, aligned with `justify`. */
export const NavbarContent = forwardRef<HTMLDivElement, NavbarContentProps>((props, ref) => {
  const { className, justify, ...rest } = props;
  const { classes: contextClasses, recipeProps } = useNavbarContext();
  const classes = justify ? navbar({ ...recipeProps, justify }) : contextClasses;

  return <div ref={ref} className={cx(classes.content, className)} {...rest} />;
});

NavbarContent.displayName = 'NavbarContent';
