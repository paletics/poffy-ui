'use client';

import { createContext, useContext } from 'react';
import { TabsContextValue } from './Tabs.types';

/**
 * Context for the Tabs component suite.
 */
export const TabsContext = createContext<TabsContextValue | null>(null);

/**
 * Custom hook to access the Tabs context.
 *
 * @throws {Error} `useTabs must be used within a <Tabs /> component`
 * @returns `TabsContextValue`
 */
export const useTabs = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('useTabs must be used within a <Tabs /> component');
  }
  return context;
};
