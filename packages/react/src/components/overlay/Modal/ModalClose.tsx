'use client';

import { createOverlayClose } from '../shared/factories';
import type { ModalCloseProps } from './Modal.types';
import { useModalContext } from './ModalContext';

/** Close button for the Modal. */
export const ModalClose = createOverlayClose(useModalContext, 'ModalClose', 24);

/**
 * Props for ModalClose, the button that dismisses a Modal.
 */
export type { ModalCloseProps };
