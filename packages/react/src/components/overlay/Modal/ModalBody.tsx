'use client';

import { createOverlayBody } from '../shared/factories';
import type { ModalBodyProps } from './Modal.types';
import { useModalContext } from './ModalContext';

/**
 * Main content region for a Modal. Use it for the dialog's scrollable or
 * readable content after `ModalTitle` and optional `ModalDescription`.
 *
 * ### AI Context & Architecture
 * - **Tier**: Molecules
 * - **Stack**: Standardized via `createOverlayBody`
 * - **Props**: ModalBodyProps
 *
 * ### Accessibility
 * - **Pattern**: WAI-ARIA Dialog body content.
 * - **Required**: Render inside `ModalContent`; keep the accessible name on
 *   `ModalTitle`, not inside the body.
 *
 * ### AI Usage
 * - **DO**: Place form fields, explanatory copy, or detail content here.
 * - **DON'T**: Use `ModalBody` without `ModalContent`, or put the only close
 *   action inside long scrollable content.
 *
 * @example Modal body composition
 * ```tsx
 * import { Modal, ModalBody, ModalContent, ModalTitle } from '@poffy-ui/react/overlay';
 *
 * <Modal open={open} onOpenChange={setOpen}>
 *   <ModalContent>
 *     <ModalTitle>Archive project</ModalTitle>
 *     <ModalBody>This action can be undone from project history.</ModalBody>
 *   </ModalContent>
 * </Modal>
 * ```
 */
export const ModalBody = createOverlayBody(useModalContext, 'ModalBody');

/**
 * Props for ModalBody, the main content region inside a Modal.
 */
export type { ModalBodyProps };
