'use client';

import { createOverlayHeader } from '../shared/factories';
import type { ModalHeaderProps } from './Modal.types';
import { useModalContext } from './ModalContext';

/**
 * Header section of the Modal, typically containing the title and close button.
 *
 * ### AI Context & Architecture
 * - **Tier**: Molecules
 * - **Stack**: Standardized via `createOverlayHeader`
 * - **Props**: ModalHeaderProps
 */
export const ModalHeader = createOverlayHeader(useModalContext, 'ModalHeader');

/**
 * Props for ModalHeader, the top structural region of a Modal.
 */
export type { ModalHeaderProps };
