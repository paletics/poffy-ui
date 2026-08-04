'use client';

import { navbar } from '@/styled-system/recipes';
import { createContext, useContext } from 'react';
import type { NavbarNarrowLayout, NavbarVariantSubset, NavbarVariants } from './Navbar.types';

interface NavbarContextValue {
  classes: ReturnType<typeof navbar>;
  recipeProps: {
    appearance: NavbarVariantSubset['appearance'];
    narrowLayout: NavbarNarrowLayout;
    sticky: NavbarVariants['sticky'];
  };
}

/**
 * Context to share generated recipe classes for Navbar slots.
 */
export const NavbarContext = createContext<NavbarContextValue | null>(null);

/**
 * Custom hook to access Navbar context.
 *
 * @throws {Error} `useNavbar must be used within a <Navbar /> component`
 * @returns Navbar recipe classes
 */
export const useNavbarContext = () => {
  const context = useContext(NavbarContext);
  if (!context) {
    throw new Error('useNavbar must be used within a <Navbar /> component');
  }
  return context;
};

/** Returns generated Navbar slot classes from the nearest root. */
export const useNavbar = () => useNavbarContext().classes;
