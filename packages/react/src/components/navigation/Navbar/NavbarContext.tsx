'use client';

import { navbar } from '@/styled-system/recipes';
import { createContext, useContext } from 'react';

/**
 * Context to share generated recipe classes for Navbar slots.
 */
export const NavbarContext = createContext<ReturnType<typeof navbar> | null>(null);

/**
 * Custom hook to access Navbar context.
 *
 * @throws {Error} `useNavbar must be used within a <Navbar /> component`
 * @returns Navbar recipe classes
 */
export const useNavbar = () => {
  const context = useContext(NavbarContext);
  if (!context) {
    throw new Error('useNavbar must be used within a <Navbar /> component');
  }
  return context;
};
