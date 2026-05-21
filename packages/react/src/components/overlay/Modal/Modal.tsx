'use client';

import { useOverlay } from '@/hooks/overlay/useFloating';
import { modal } from '@/styled-system/recipes';
import { useId, useMemo, useState } from 'react';
import type { OverlayRefs } from '../shared/factories/types';
import type { ModalProps } from './Modal.types';
import { ModalContext } from './ModalContext';

/**
 * A dialog window that sits on top of the primary window.
 * Supports both controlled and uncontrolled states.
 *
 * ### AI Context & Architecture
 * - **Tier**: Organisms
 * - **Stack**: React Context, Floating UI, Panda CSS `modal` recipe
 * - **Props**: ModalProps
 *
 * ### Component Details
 * Root provider for all Modal sub-components. Renders no DOM node itself —
 * only a React Context provider. DOM ref access is intentionally not supported
 * at this level; use ModalContent's ref instead.
 * Manages accessibility IDs (`titleId`, `descriptionId`) and Floating UI state.
 *
 * ### Variant Logic
 * - `size`: Choose the smallest size that fits the focused task.
 * - `scrollBehavior`: Use `inside` for long forms and `outside` for short dialogs.
 *
 * ### Accessibility
 * - Include `ModalTitle` inside `ModalContent` so the generated `aria-labelledby` target exists.
 * - Include `ModalClose` or another visible action that calls `onOpenChange(false)`.
 *
 * ### AI Usage
 * - Do: use Modal for blocking decisions, confirmations, and focused tasks.
 * - Don't: render `ModalContent` outside `Modal` or use Modal for hover/focus hints.
 *
 * @example
 * ```tsx
 * import {
 *   Modal,
 *   ModalBody,
 *   ModalClose,
 *   ModalContent,
 *   ModalFooter,
 *   ModalHeader,
 *   ModalTitle,
 * } from '@poffy-ui/react/overlay';
 *
 * <Modal size="md">
 *   <ModalContent>
 *     <ModalHeader>
 *       <ModalTitle>Confirm Action</ModalTitle>
 *       <ModalClose />
 *     </ModalHeader>
 *     <ModalBody>Are you sure you want to proceed?</ModalBody>
 *     <ModalFooter>
 *       <Button onClick={handleConfirm}>Confirm</Button>
 *     </ModalFooter>
 *   </ModalContent>
 * </Modal>
 * ```
 *
 * @example Controlled state
 * ```tsx
 * import { Modal, ModalContent, ModalTitle } from '@poffy-ui/react/overlay';
 *
 * <Modal open={open} onOpenChange={setOpen}>
 *   <ModalContent>
 *     <ModalTitle>Edit profile</ModalTitle>
 *   </ModalContent>
 * </Modal>
 * ```
 */
export const Modal = ({
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  defaultOpen = false,
  children,
  appearance,
  size,
  scrollBehavior,
  brand,
  theme,
}: ModalProps) => {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);

  const open = controlledOpen ?? internalOpen;
  const onOpenChange = controlledOnOpenChange ?? setInternalOpen;

  const { refs, context, getReferenceProps, getFloatingProps } = useOverlay<HTMLElement>({
    open,
    onOpenChange,
  });

  const titleId = useId();
  const descriptionId = useId();
  const rawClasses = useMemo(
    () => modal({ appearance, size, scrollBehavior }),
    [appearance, size, scrollBehavior],
  );

  const contextValue = useMemo(
    () => ({
      open,
      onOpenChange,
      refs: refs as OverlayRefs<HTMLElement>,
      context,
      getReferenceProps,
      getFloatingProps,
      titleId,
      descriptionId,
      classes: rawClasses,
      brand,
      theme,
      animationType: 'modal' as const,
    }),
    [
      open,
      onOpenChange,
      refs,
      context,
      getReferenceProps,
      getFloatingProps,
      titleId,
      descriptionId,
      rawClasses,
      brand,
      theme,
    ],
  );

  return <ModalContext.Provider value={contextValue}>{children}</ModalContext.Provider>;
};

Modal.displayName = 'Modal';
