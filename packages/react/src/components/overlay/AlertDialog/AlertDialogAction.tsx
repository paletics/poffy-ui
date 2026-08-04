'use client';

import { forwardRef } from 'react';
import { OverlayDismissControl } from '../shared/OverlayDismissControl';
import { useAlertDialogContext } from './AlertDialogContext';
import type { AlertDialogActionComponent, AlertDialogActionProps } from './AlertDialog.types';

const AlertDialogActionImpl = forwardRef<HTMLElement, AlertDialogActionProps>((props, ref) => {
  const { onOpenChange } = useAlertDialogContext();

  return <OverlayDismissControl ref={ref} {...props} onDismiss={() => onOpenChange(false)} />;
});

AlertDialogActionImpl.displayName = 'AlertDialogAction';

/**
 * Renders a primary confirmation control and requests dialog close on activation.
 *
 * It does not perform or await the destructive operation itself; invoke that
 * work from its click handler and retain the dialog by preventing activation
 * only when appropriate for the application flow.
 */

export const AlertDialogAction = AlertDialogActionImpl as unknown as AlertDialogActionComponent;
