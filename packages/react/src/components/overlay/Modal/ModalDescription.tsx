'use client';

import { createOverlayDescription } from '../shared/factories';
import type { ModalDescriptionProps } from './Modal.types';
import { useModalContext } from './ModalContext';

/**
 * Descriptive text for the Modal, automatically linked via aria-describedby.
 *
 * ### AI Context & Architecture
 * - **Tier**: Molecules
 * - **Stack**: Standardized via `createOverlayDescription`
 * - **Props**: ModalDescriptionProps
 */
export const ModalDescription = createOverlayDescription(useModalContext, 'ModalDescription');

/**
 * Props for ModalDescription, the accessible descriptive text of a Modal.
 */
export type { ModalDescriptionProps };
