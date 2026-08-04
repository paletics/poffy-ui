'use client';

import { drawer } from '@/styled-system/recipes';
import { createContext, useContext, type HTMLProps } from 'react';
import type { OverlayContext } from '../shared/factories/types';

/**
 * Shared Drawer overlay state, registered accessibility parts, generated classes, and close behavior.
 */
interface DrawerContextValue extends OverlayContext<HTMLElement> {
  /**
   * Prop getter for the trigger element.
   * Not part of OverlayContext — Drawer requires a trigger, unlike Popover which manages its own.
   */
  getReferenceProps: (userProps?: HTMLProps<HTMLElement>) => Record<string, unknown>;

  /** Callback to change the open state (required for Drawer, optional in base OverlayContext). */
  onOpenChange: (open: boolean) => void;

  /** Computed classes from the drawer recipe (narrowed from Record<string, string>). */
  classes: ReturnType<typeof drawer>;
}

/**
 * React context carrying Drawer overlay state to nested parts.
 */
export const DrawerContext = createContext<DrawerContextValue | null>(null);

/**
 * Returns the nearest Drawer context and validates compound component usage.
 */
export const useDrawerContext = (): DrawerContextValue => {
  const context = useContext(DrawerContext);
  if (context == null) {
    throw new Error('Drawer components must be wrapped in <Drawer />');
  }
  return context;
};
