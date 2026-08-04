'use client';

import { createOverlayDescription } from '../shared/factories';
import type { ModalDescriptionProps } from './Modal.types';
import { useModalContext } from './ModalContext';

/** Descriptive text for the Modal, automatically linked via aria-describedby. */
export const ModalDescription = createOverlayDescription(useModalContext, 'ModalDescription');

/**
 * Props for ModalDescription, the accessible descriptive text of a Modal.
 */
export type { ModalDescriptionProps };
