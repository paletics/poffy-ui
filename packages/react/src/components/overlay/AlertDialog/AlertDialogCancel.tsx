'use client';

import { useMergeRefs } from '@floating-ui/react';
import { forwardRef, isValidElement } from 'react';
import { OverlayDismissControl } from '../shared/OverlayDismissControl';
import { useAlertDialogContext } from './AlertDialogContext';
import type { AlertDialogCancelComponent, AlertDialogCancelProps } from './AlertDialog.types';

const AlertDialogCancelImpl = forwardRef<HTMLElement, AlertDialogCancelProps>(
  ({ asChild, children, className, disabled = false, onClick, onClickCapture, ...props }, ref) => {
    const { initialFocusRef, onOpenChange } = useAlertDialogContext();
    const hasDisabledButtonChild = Boolean(
      asChild &&
      isValidElement<{ disabled?: boolean }>(children) &&
      (children.type === 'button' || typeof children.type !== 'string') &&
      children.props.disabled,
    );
    const isDisabled = [disabled, hasDisabledButtonChild].some(Boolean);
    // A disabled element cannot receive focus. Leave the ref empty so Floating UI focuses the
    // dialog surface instead of attempting to focus a disabled cancel control.
    const mergedRef = useMergeRefs([isDisabled ? null : initialFocusRef, ref]);

    return (
      <OverlayDismissControl
        ref={mergedRef}
        {...props}
        asChild={asChild}
        disabled={isDisabled}
        className={className}
        onClick={onClick}
        onClickCapture={onClickCapture}
        onDismiss={() => onOpenChange(false)}
      >
        {children}
      </OverlayDismissControl>
    );
  },
);

AlertDialogCancelImpl.displayName = 'AlertDialogCancel';

/**
 * Renders the non-destructive dismissal control and requests close on activation.
 *
 * An enabled cancel control becomes the dialog’s preferred initial focus.
 * Disabled native or delegated buttons do not register as that target, so focus
 * safely falls back to the dialog surface.
 */

export const AlertDialogCancel = AlertDialogCancelImpl as unknown as AlertDialogCancelComponent;
