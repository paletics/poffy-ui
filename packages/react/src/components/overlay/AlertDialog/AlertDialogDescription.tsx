'use client';

import { createOverlayDescription } from '../shared/factories';
import { useAlertDialogContext } from './AlertDialogContext';

/** Supplies descriptive text referenced by the owning AlertDialog content. */


export const AlertDialogDescription = createOverlayDescription(
  useAlertDialogContext,
  'AlertDialogDescription',
);
