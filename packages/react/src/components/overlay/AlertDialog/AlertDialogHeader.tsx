'use client';

import { createOverlayHeader } from '../shared/factories';
import { useAlertDialogContext } from './AlertDialogContext';

/** Groups an AlertDialog title and description without defining dialog state. */


export const AlertDialogHeader = createOverlayHeader(useAlertDialogContext, 'AlertDialogHeader');
