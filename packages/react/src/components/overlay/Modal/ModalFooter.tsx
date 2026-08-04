'use client';

import { createOverlayFooter } from '../shared/factories';
import type { ModalFooterProps } from './Modal.types';
import { useModalContext } from './ModalContext';

/** Footer section of the Modal, typically containing action buttons. */
export const ModalFooter = createOverlayFooter(useModalContext, 'ModalFooter');

/**
 * Props for ModalFooter, the action area at the bottom of a Modal.
 */
export type { ModalFooterProps };
