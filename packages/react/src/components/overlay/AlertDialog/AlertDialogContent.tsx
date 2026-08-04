'use client';

import { useMergeRefs } from '@floating-ui/react';
import { forwardRef, useCallback } from 'react';
import { createOverlayContent } from '../shared/factories';
import { useAlertDialogContext } from './AlertDialogContext';
import type { AlertDialogContentProps } from './AlertDialog.types';

const AlertDialogContentBase = createOverlayContent(
  useAlertDialogContext,
  'AlertDialogContent',
  {
    fallbackLabelKey: 'alertDialog',
  },
);

/**
 * Renders the labelled, focus-managed alert-dialog surface.
 *
 * A registered enabled `AlertDialog.Cancel` receives initial focus when
 * present. Otherwise the dialog surface itself is the focus fallback, avoiding
 * focus on a disabled delegated control. The shared factory handles portal,
 * dismissal, ARIA title/description, and safe `asChild` fallback.
 */


export const AlertDialogContent = forwardRef<HTMLElement, AlertDialogContentProps>((props, ref) => {
  const { initialFocusRef } = useAlertDialogContext();
  const setDialogSurfaceRef = useCallback(
    (node: HTMLElement | null) => {
      // A usable Cancel control registers first. Otherwise focus the dialog itself so
      // disabled asChild controls cannot leave focus on a portal guard.
      if (node && initialFocusRef.current === null) initialFocusRef.current = node;
    },
    [initialFocusRef],
  );
  const mergedRef = useMergeRefs([setDialogSurfaceRef, ref]);

  return <AlertDialogContentBase {...props} ref={mergedRef} />;
});

AlertDialogContent.displayName = 'AlertDialogContent';
