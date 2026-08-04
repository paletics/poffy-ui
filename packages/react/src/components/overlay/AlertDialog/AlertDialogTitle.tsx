'use client';

import { createOverlayTitle } from '../shared/factories';
import { useAlertDialogContext } from './AlertDialogContext';

/** Supplies the accessible title for the owning AlertDialog content. */


export const AlertDialogTitle = createOverlayTitle(useAlertDialogContext, 'AlertDialogTitle', 'h2');
