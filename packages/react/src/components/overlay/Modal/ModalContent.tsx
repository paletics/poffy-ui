'use client';

import { createOverlayContent } from '../shared/factories';
import { useModalContext } from './ModalContext';

/**
 * Renders the portalled modal dialog surface for its owning `Modal`.
 *
 * The shared overlay factory manages focus trapping, dismissal, title and
 * description ARIA relationships, and safe `asChild` fallback. Supply a
 * `ModalTitle` unless another accessible name is provided.
 */
export const ModalContent = createOverlayContent(useModalContext, 'ModalContent', {
  fallbackLabelKey: 'dialog',
});

ModalContent.displayName = 'ModalContent';
