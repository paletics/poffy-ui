'use client';

import { createContext, useContext } from 'react';
import { AvatarContextValue } from './Avatar.types';

/**
 * Shared state for Avatar compound parts such as image and fallback.
 */
export const AvatarContext = createContext<AvatarContextValue | null>(null);

/**
 * Returns the nearest Avatar context and validates compound component usage.
 */
export const useAvatarContext = () => {
  const context = useContext(AvatarContext);
  if (!context) {
    throw new Error('Avatar compound components must be used within Avatar.Root');
  }
  return context;
};
