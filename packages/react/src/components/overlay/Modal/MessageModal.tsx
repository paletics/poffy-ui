'use client';

import { ReactNode } from 'react';
import { Button } from '../../inputs/Button';
import { Modal } from './Modal';
import { ModalProps } from './Modal.types';
import { ModalClose } from './ModalClose';
import { ModalDescription } from './ModalDescription';
import { ModalContent } from './ModalContent';
import { ModalFooter } from './ModalFooter';
import { ModalHeader } from './ModalHeader';
import { ModalTitle } from './ModalTitle';

/**
 * Properties for the MessageModal component.
 */
export interface MessageModalProps extends Omit<ModalProps, 'children'> {
  /**
   * Optional title for the modal.
   */
  title?: string;

  /**
   * Main content area of the modal.
   */
  children?: ReactNode;

  /**
   * Label for the primary (OK) button.
   * @defaultValue "OK"
   */
  okLabel?: string;

  /**
   * Label for the secondary (Cancel) button.
   * @defaultValue "Cancel"
   */
  cancelLabel?: string;

  /**
   * Callback fired when the primary button is clicked.
   */
  okHandle?: () => void;

  /**
   * Callback fired when the secondary (Cancel) button is clicked.
   */
  onCancel?: () => void;

  /**
   * Whether to display the close button in the header.
   * @defaultValue true
   */
  showClose?: boolean;
}

/**
 * A specialized Modal wrapper for displaying alerts, confirmation messages, or simple dialogs.
 * Simplifies the boilerplate of manually assembling Modal sub-components.
 *
 * ### AI Context & Architecture
 * - **Tier**: Organisms
 * - **Stack**: Poffy UI Modal suite, Poffy UI Button
 * - **Props**: MessageModalProps
 *
 * ### Accessibility
 * - Provide `title` for confirmation and alert dialogs.
 * - Keep the message concise; use Modal directly for complex forms.
 *
 * ### AI Usage
 * - Do: use MessageModal for simple confirmation and acknowledgement dialogs.
 * - Don't: use it when custom layout, multiple fields, or complex focus order is required.
 *
 * @example
 * ```tsx
 * import { MessageModal } from '@poffy-ui/react/overlay';
 *
 * <MessageModal
 *   open={isOpen}
 *   title="Delete Item?"
 *   okLabel="Delete"
 *   okHandle={handleDelete}
 *   cancelLabel="Cancel"
 * >
 *   Are you sure you want to delete this item?
 * </MessageModal>
 * ```
 */
export const MessageModal = ({
  open,
  onOpenChange,
  title,
  children,
  okLabel = 'OK',
  cancelLabel = 'Cancel',
  okHandle,
  onCancel,
  showClose = true,
  size = 'md',
  scrollBehavior = 'inside',
  ...rest
}: MessageModalProps) => {
  const handleOk = () => {
    okHandle?.();
    onOpenChange?.(false);
  };

  const handleCancel = () => {
    onCancel?.();
    onOpenChange?.(false);
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      size={size}
      scrollBehavior={scrollBehavior}
      {...rest}
    >
      <ModalContent>
        <ModalHeader>
          {title && <ModalTitle>{title}</ModalTitle>}
          {showClose && <ModalClose />}
        </ModalHeader>

        <ModalDescription asChild>
          <div>{children}</div>
        </ModalDescription>

        <ModalFooter data-align="center">
          {okHandle && <Button onClick={handleOk}>{okLabel}</Button>}
          {onCancel && (
            <Button intent="secondary" onClick={handleCancel}>
              {cancelLabel}
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

MessageModal.displayName = 'MessageModal';
