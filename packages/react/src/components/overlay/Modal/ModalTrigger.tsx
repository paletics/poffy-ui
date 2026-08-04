'use client';

import { forwardRef } from 'react';
import { OverlayDialogTrigger } from '../shared/OverlayDialogTrigger';
import type { OverlayTriggerComponent } from '../shared/factories/types';
import type { ModalTriggerProps } from './Modal.types';
import { useModalContext } from './ModalContext';

/**
 * Control that toggles a Modal and registers its focus-return reference.
 *
 * ### Accessibility
 * With `asChild`, passive hosts receive button semantics; href anchors open the
 * dialog without navigating. Disabled controls remain focusable but suppress
 * pointer and Enter/Space activation.
 *
 * @example
 * ```tsx
 * <Modal>
 *   <ModalTrigger>Open settings</ModalTrigger>
 *   <ModalContent><ModalTitle>Settings</ModalTitle></ModalContent>
 * </Modal>
 * ```
 */
const ModalTriggerImpl = forwardRef<HTMLElement, ModalTriggerProps>((props, ref) => {
  const context = useModalContext();

  return <OverlayDialogTrigger ref={ref} context={context} {...props} />;
});

ModalTriggerImpl.displayName = 'ModalTrigger';

/** Opens its owning Modal and supplies the trigger semantics used for focus restoration. */

export const ModalTrigger = ModalTriggerImpl as unknown as OverlayTriggerComponent;
