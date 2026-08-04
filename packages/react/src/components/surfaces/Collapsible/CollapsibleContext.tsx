'use client';

import { createContext, useContext } from 'react';
import type { collapsible } from '@/styled-system/recipes';

type CollapsibleClasses = ReturnType<typeof collapsible>;

interface CollapsibleContextValue {
  open: boolean;
  disabled?: boolean;
  contentId: string;
  contentPresent: boolean;
  setContentPresent: (id: string, present: boolean) => void;
  triggerId?: string;
  panelId?: string;
  invalidStructure: boolean;
  registerTrigger: (id: string) => () => void;
  registerContent: (id: string) => () => void;
  toggle: () => void;
  classes: CollapsibleClasses;
}

export const CollapsibleContext = createContext<CollapsibleContextValue | null>(null);

export const useCollapsible = () => {
  const context = useContext(CollapsibleContext);
  if (!context) {
    throw new Error('Collapsible components must be rendered inside <Collapsible>.');
  }
  return context;
};
