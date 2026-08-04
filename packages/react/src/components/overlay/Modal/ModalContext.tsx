'use client';

import { modal } from '@/styled-system/recipes';
import { createContext, useContext, type HTMLProps } from 'react';
import type { OverlayContext } from '../shared/factories/types';

/**
 * Shared Modal overlay state, registered accessibility parts, generated classes, and close behavior.
 */
interface ModalContextValue extends OverlayContext<HTMLElement> {
  /**
   * Prop getter for the trigger element.
   * Not part of OverlayContext — Modal requires a trigger, unlike Popover which manages its own.
   */
  getReferenceProps: (userProps?: HTMLProps<HTMLElement>) => Record<string, unknown>;

  /** Callback to change the open state (required for Modal, optional in base OverlayContext). */
  onOpenChange: (open: boolean) => void;

  /** Computed classes from the modal recipe (narrowed from Record<string, string>). */
  classes: ReturnType<typeof modal>;
}

/**
 * React context carrying Modal overlay state to nested parts.
 */
export const ModalContext = createContext<ModalContextValue | null>(null);

/**
 * Returns the nearest Modal context and validates compound component usage.
 */
export const useModalContext = (): ModalContextValue => {
  const context = useContext(ModalContext);
  if (context == null) {
    throw new Error('Modal components must be wrapped in <Modal />');
  }
  return context;
};
