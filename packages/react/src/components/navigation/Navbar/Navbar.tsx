'use client';

import { cx } from '@/styled-system/css';
import { navbar } from '@/styled-system/recipes';
import { forwardRef, useMemo } from 'react';
import type { NavbarRootProps } from './Navbar.types';
import { NavbarContext } from './NavbarContext';

/**
 * Renders primary top-level navigation with shared slots for brand, links, and actions. Include a
 * NavbarBrand that conveys the site name; `sticky` keeps the navigation visible while scrolling.
 */
export const Navbar = forwardRef<HTMLElement, NavbarRootProps>((props, ref) => {
  const { children, className, appearance, sticky, narrowLayout = 'scroll', ...rest } = props;
  const { justify: _justify, ...navProps } = rest as typeof rest & { justify?: unknown };
  const classes = useMemo(
    () => navbar({ appearance, sticky, narrowLayout }),
    [appearance, narrowLayout, sticky],
  );
  const contextValue = useMemo(
    () => ({ classes, recipeProps: { appearance, narrowLayout, sticky } }),
    [appearance, classes, narrowLayout, sticky],
  );

  return (
    <NavbarContext.Provider value={contextValue}>
      <nav ref={ref} className={cx(classes.root, className)} {...navProps}>
        {children}
      </nav>
    </NavbarContext.Provider>
  );
});

Navbar.displayName = 'Navbar.Root';
