'use client';

import { createContext, useContext } from 'react';
import { TagProps } from './Tag.types';

/**
 * Shared tag variant state consumed by tag label, icon, and close parts.
 */
interface TagContextValue {
  size?: TagProps['size'];
  appearance?: TagProps['appearance'];
  intent?: TagProps['intent'];
  shape?: TagProps['shape'];
}

/**
 * React context carrying Tag variant state for compound parts.
 */
export const TagContext = createContext<TagContextValue | null>(null);

/**
 * Returns the nearest Tag context and validates compound component usage.
 */
export const useTagContext = () => {
  const context = useContext(TagContext);
  if (!context) {
    throw new Error('Tag sub-components must be used within a <Tag />');
  }
  return context;
};
