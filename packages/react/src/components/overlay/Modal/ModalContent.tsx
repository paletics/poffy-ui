'use client';

import { createOverlayContent } from '../shared/factories';
import { useModalContext } from './ModalContext';

/**
 * The content container for the Modal.
 * Handles portals, overlays, focus management, and accessibility attributes.
 *
 * ### AI Context & Architecture
 * - **Tier**: Molecules
 * - **Stack**: Standardized via `createOverlayContent`
 * - **Props**: ModalContentProps
 *
 * ### Component Details
 * Manages Backdrop, Portal, and Focus management automatically.
 */
export const ModalContent = createOverlayContent(useModalContext, 'ModalContent');

ModalContent.displayName = 'ModalContent';
