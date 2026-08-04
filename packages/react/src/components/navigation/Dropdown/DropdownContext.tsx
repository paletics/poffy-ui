'use client';

import type { dropdown } from '@/styled-system/recipes';
import type { UseDropdownReturn } from '@poffy-ui/behavior/dropdown';
import { createContext, useContext } from 'react';

/**
 * Shared Dropdown open state, positioning, ids, and generated slot classes.
 */
interface DropdownContextValue extends UseDropdownReturn {
  /** Styles generated from the dropdown recipe. */
  classes: ReturnType<typeof dropdown>;
  /** Normalized collision padding mirrored by the menu's CSS fallback. */
  resolvedCollisionPadding: number;
}

/**
 * React context carrying Dropdown interaction state for trigger, content, and items.
 */
export const DropdownContext = createContext<DropdownContextValue | null>(null);

/**
 * Returns the nearest Dropdown context and validates compound component usage.
 *
 * @throws {Error} `Dropdown components must be used within <Dropdown />`
 * @returns The current `DropdownContextValue`.
 */
export const useDropdownContext = () => {
  const context = useContext(DropdownContext);
  if (!context) {
    throw new Error('Dropdown components must be used within <Dropdown />');
  }
  return context;
};
