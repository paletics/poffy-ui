'use client';

import { createOverlayTitle } from '../shared/factories';
import type { ModalTitleProps } from './Modal.types';
import { useModalContext } from './ModalContext';

/** Title element for the Modal, automatically linked via aria-labelledby. */
export const ModalTitle = createOverlayTitle(useModalContext, 'ModalTitle', 'h2');

/**
 * Props for ModalTitle, the accessible heading of a Modal.
 */
export type { ModalTitleProps };
