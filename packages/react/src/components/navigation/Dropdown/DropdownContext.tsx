'use client';

import type { dropdown } from '@/styled-system/recipes';
import type { useFloating, useInteractions } from '@floating-ui/react';
import { createContext, useContext } from 'react';
import type { CSSProperties, RefObject } from 'react';

/**
 * Value provided by the DropdownContext.
 */
/**
 * Shared Dropdown open state, positioning, ids, and generated slot classes.
 */
interface DropdownContextValue {
  /** Whether the dropdown is currently open. */
  open: boolean;
  /** Callback to change the open state. */
  onOpenChange: (open: boolean) => void;
  /** Floating UI refs for relative positioning. */
  refs: ReturnType<typeof useFloating>['refs'];
  /** Positioning styles (position, top, left, etc.) computed by Floating UI. Must be applied to the floating element. */
  floatingStyles: CSSProperties;
  /** Floating UI context for interaction hooks. */
  context: ReturnType<typeof useFloating>['context'];
  /** Hook to get props for the trigger element. */
  getReferenceProps: ReturnType<typeof useInteractions>['getReferenceProps'];
  /** Hook to get props for the floating menu element. */
  getFloatingProps: ReturnType<typeof useInteractions>['getFloatingProps'];
  /** Hook to get props for individual menu items. */
  getItemProps: ReturnType<typeof useInteractions>['getItemProps'];
  /** Currently focused item index. */
  activeIndex: number | null;
  /**
   * Registers or unregisters a disabled index for keyboard navigation.
   * Must be called from DropdownItem after its list index is resolved.
   */
  setDisabledIndex: (index: number, disabled: boolean) => void;
  /** Ref to the list of item elements for navigation. */
  listRef: RefObject<(HTMLElement | null)[]>;
  /** Ref to the list of item text content for typeahead. */
  listItemsRef: RefObject<string[]>;
  /** Styles generated from the dropdown recipe. */
  classes: ReturnType<typeof dropdown>;
}

/**
 * Context to share Dropdown state among sub-components.
 */
/**
 * React context carrying Dropdown interaction state for trigger, content, and items.
 */
export const DropdownContext = createContext<DropdownContextValue | null>(null);

/**
 * Custom hook to access the Dropdown context.
 *
 * @throws {Error} `Dropdown components must be used within <Dropdown />`
 * @returns `DropdownContextValue`
 */
/**
 * Returns the nearest Dropdown context and validates compound component usage.
 */
export const useDropdownContext = () => {
  const context = useContext(DropdownContext);
  if (!context) {
    throw new Error('Dropdown components must be used within <Dropdown />');
  }
  return context;
};
