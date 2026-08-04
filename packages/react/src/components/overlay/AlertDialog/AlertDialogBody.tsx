'use client';

import { createOverlayBody } from '../shared/factories';
import { useAlertDialogContext } from './AlertDialogContext';

/** Provides the main explanatory content region of an AlertDialog. */


export const AlertDialogBody = createOverlayBody(useAlertDialogContext, 'AlertDialogBody');
