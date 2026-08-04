'use client';

import { createOverlayFooter } from '../shared/factories';
import { useAlertDialogContext } from './AlertDialogContext';

/** Groups AlertDialog actions without changing their dismissal behavior. */


export const AlertDialogFooter = createOverlayFooter(useAlertDialogContext, 'AlertDialogFooter');
