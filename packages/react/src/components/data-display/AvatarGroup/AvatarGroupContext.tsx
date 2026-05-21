'use client';

import { createContext, useContext } from 'react';
import { AvatarGroupContextValue } from './AvatarGroup.types';

/**
 * Shared size and stacking settings for AvatarGroup child avatars.
 */
export const AvatarGroupContext = createContext<AvatarGroupContextValue | null>(null);

/**
 * Returns the nearest AvatarGroup context and validates compound component usage.
 */
export const useAvatarGroupContext = () => {
  return useContext(AvatarGroupContext);
};
