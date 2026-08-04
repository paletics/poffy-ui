'use client';

import { createContext, useContext } from 'react';
import type { HoverCardContextValue } from './HoverCard.types';

export const HoverCardContext = createContext<HoverCardContextValue | null>(null);

export const useHoverCardContext = (): HoverCardContextValue => {
  const context = useContext(HoverCardContext);
  if (context == null) {
    throw new Error('HoverCard components must be wrapped in <HoverCard />');
  }
  return context;
};
