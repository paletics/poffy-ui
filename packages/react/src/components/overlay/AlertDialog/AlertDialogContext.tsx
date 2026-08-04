'use client';

import { alertDialog } from '@/styled-system/recipes';
import { createContext, useContext, type HTMLProps, type RefObject } from 'react';
import type { OverlayContext } from '../shared/factories/types';

interface AlertDialogContextValue extends OverlayContext<HTMLElement> {
  getReferenceProps: (userProps?: HTMLProps<HTMLElement>) => Record<string, unknown>;
  onOpenChange: (open: boolean) => void;
  classes: ReturnType<typeof alertDialog>;
  initialFocusRef: RefObject<HTMLElement | null>;
}

export const AlertDialogContext = createContext<AlertDialogContextValue | null>(null);

export const useAlertDialogContext = (): AlertDialogContextValue => {
  const context = useContext(AlertDialogContext);
  if (context == null) {
    throw new Error('AlertDialog components must be wrapped in <AlertDialog />');
  }
  return context;
};
