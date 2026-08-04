'use client';

import { createOverlayBody } from '../shared/factories';
import type { ModalBodyProps } from './Modal.types';
import { useModalContext } from './ModalContext';

/** Main content region for a Modal. Use it for the dialog's scrollable or */
export const ModalBody = createOverlayBody(useModalContext, 'ModalBody');

/**
 * Props for ModalBody, the main content region inside a Modal.
 */
export type { ModalBodyProps };
