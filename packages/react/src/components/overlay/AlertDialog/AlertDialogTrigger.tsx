'use client';

import { forwardRef } from 'react';
import { OverlayDialogTrigger } from '../shared/OverlayDialogTrigger';
import type { OverlayTriggerComponent } from '../shared/factories/types';
import { useAlertDialogContext } from './AlertDialogContext';
import type { AlertDialogTriggerProps } from './AlertDialog.types';

/**
 * Control that opens an AlertDialog and registers its focus-return reference.
 * Passive `asChild` hosts receive button semantics, and href anchors open the
 * dialog without navigating.
 */
const AlertDialogTriggerImpl = forwardRef<HTMLElement, AlertDialogTriggerProps>((props, ref) => {
  const context = useAlertDialogContext();
  return <OverlayDialogTrigger ref={ref} context={context} {...props} />;
});

AlertDialogTriggerImpl.displayName = 'AlertDialogTrigger';

/** Opens its owning AlertDialog and supplies the trigger semantics for the confirmation flow. */

export const AlertDialogTrigger = AlertDialogTriggerImpl as unknown as OverlayTriggerComponent;
