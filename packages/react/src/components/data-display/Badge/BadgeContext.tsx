'use client';

import { createContext, useContext } from 'react';
import { BadgeContextValue } from './Badge.types';

/**
 * Shared badge classes and placement state for badge compound parts.
 */
export const BadgeContext = createContext<BadgeContextValue | null>(null);

/**
 * Returns the nearest Badge context and validates compound component usage.
 */
export const useBadgeContext = () => {
  const context = useContext(BadgeContext);
  if (!context) {
    throw new Error('Badge sub-components must be used within a <Badge.Root />');
  }
  return context;
};
