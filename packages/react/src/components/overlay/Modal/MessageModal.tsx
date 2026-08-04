'use client';

import { ReactNode } from 'react';
import { Button } from '../../inputs/Button';
import { Modal } from './Modal';
import type { ControlledModalProps, UncontrolledModalProps } from './Modal.types';
import { ModalClose } from './ModalClose';
import { ModalBody } from './ModalBody';
import { ModalDescription } from './ModalDescription';
import { ModalContent } from './ModalContent';
import { ModalFooter } from './ModalFooter';
import { ModalHeader } from './ModalHeader';
import { ModalTitle } from './ModalTitle';
import { useDialogOpenState } from '../shared/useDialogOpenState';
import { useWarnUnpairedControlledOpen } from '../shared/useWarnUnpairedControlledOpen';
import { getCommonMessages } from '@/components/shared/common.locales';
import { useOptionalLocale } from '@/providers/LocaleProvider';

/**
 * Properties for the MessageModal component.
 */
interface MessageModalOwnProps {
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

/** Controlled state props for MessageModal. */
export type ControlledMessageModalProps = Omit<ControlledModalProps, 'children'> &
  MessageModalOwnProps;

/** Uncontrolled state props for MessageModal. */
export type UncontrolledMessageModalProps = Omit<UncontrolledModalProps, 'children'> &
  MessageModalOwnProps;

/** Public props for MessageModal. */
export type MessageModalProps = ControlledMessageModalProps | UncontrolledMessageModalProps;

/**
 * Composes a simple message dialog with optional confirm and cancel actions.
 *
 * It uses localized default labels and an inside-scrolling large Modal. When
 * `okHandle` or `onCancel` is supplied, its button invokes that callback and
 * then requests close. It is not a promise-based confirmation API; callers
 * own asynchronous work, error handling, and the controlled open state.
 */
export const MessageModal = ({
  open,
  defaultOpen = false,
  onOpenChange,
  title,
  children,
  okLabel,
  cancelLabel,
  okHandle,
  onCancel,
  showClose = true,
  size = 'lg',
  scrollBehavior = 'inside',
  ...rest
}: MessageModalProps) => {
  const messages = getCommonMessages(useOptionalLocale()?.locale);
  const resolvedOkLabel = okLabel ?? messages.confirm;
  const resolvedCancelLabel = cancelLabel ?? messages.cancel;
  const resolvedOnOpenChange = typeof onOpenChange === 'function' ? onOpenChange : undefined;
  const controlsOpen = open !== undefined && resolvedOnOpenChange !== undefined;
  useWarnUnpairedControlledOpen('MessageModal', open, controlsOpen);
  const { open: resolvedOpen, onOpenChange: setOpen } = useDialogOpenState({
    open: controlsOpen ? open : undefined,
    defaultOpen: !controlsOpen && open !== undefined ? open : defaultOpen,
    onOpenChange: resolvedOnOpenChange,
  });

  const handleOk = () => {
    okHandle?.();
    setOpen(false);
  };

  const handleCancel = () => {
    onCancel?.();
    setOpen(false);
  };

  return (
    <Modal
      open={resolvedOpen}
      onOpenChange={setOpen}
      size={size}
      scrollBehavior={scrollBehavior}
      {...rest}
    >
      <ModalContent>
        <ModalHeader>
          {title && <ModalTitle>{title}</ModalTitle>}
          {showClose && <ModalClose />}
        </ModalHeader>

        <ModalBody>
          <ModalDescription asChild>
            <div>{children}</div>
          </ModalDescription>
        </ModalBody>

        <ModalFooter data-align="center">
          {okHandle && <Button onClick={handleOk}>{resolvedOkLabel}</Button>}
          {onCancel && (
            <Button intent="secondary" onClick={handleCancel}>
              {resolvedCancelLabel}
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

MessageModal.displayName = 'MessageModal';
