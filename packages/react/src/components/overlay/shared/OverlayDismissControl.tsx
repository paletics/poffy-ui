'use client';

import {
  createDisabledActivationHandlers,
  guardDisabledActivationHandlers,
  useButtonKeyboardActivation,
} from '@poffy-ui/behavior/activation';
import type { PrimitiveProps } from '@poffy-ui/types';
import {
  getFallbackChildrenForNativeButton,
  isButtonAsChildHost,
  shouldEmulateButtonHost,
} from '@/components/shared/asChild';
import { omitNativeButtonOnlyProps } from '@/components/shared/buttonDelegation';
import { useMergeRefs } from '@floating-ui/react';
import { Slot } from '@radix-ui/react-slot';
import {
  cloneElement,
  forwardRef,
  isValidElement,
  type ElementType,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from 'react';

interface OverlayDismissControlProps extends PrimitiveProps<'button'> {
  defaultContent?: ReactNode;
  onDismiss: () => void;
}

/** Shared polymorphic activation and dismissal contract for overlay controls. */
export const OverlayDismissControl = forwardRef<HTMLElement, OverlayDismissControlProps>(
  (
    {
      asChild = false,
      children,
      defaultContent,
      disabled = false,
      onDismiss,
      onAuxClick,
      onAuxClickCapture,
      onClick,
      onClickCapture,
      onKeyDown,
      onKeyDownCapture,
      onKeyUp,
      onKeyUpCapture,
      onBlur,
      onPointerDown,
      onPointerDownCapture,
      onPointerUp,
      onPointerUpCapture,
      ...props
    },
    ref,
  ) => {
    const mergedRef = useMergeRefs([ref]);
    const asChildElement = asChild && isButtonAsChildHost(children) ? children : null;
    const canUseAsChild = Boolean(asChildElement);
    const isNativeAsChildButton = asChildElement?.type === 'button';
    const isCustomAsChildButton = Boolean(
      asChildElement && typeof asChildElement.type !== 'string',
    );
    const needsButtonSemantics = Boolean(canUseAsChild && shouldEmulateButtonHost(asChildElement));
    const shouldGuardDelegatedActivation = canUseAsChild && disabled;
    const Component: ElementType = canUseAsChild ? Slot : 'button';
    const hostProps = canUseAsChild ? omitNativeButtonOnlyProps(props) : props;

    const handleClick = (event: MouseEvent<HTMLElement>) => {
      if (disabled) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      onClick?.(event as MouseEvent<HTMLButtonElement>);
      if (!event.defaultPrevented) onDismiss();
    };
    const keyboardActivation = useButtonKeyboardActivation<HTMLElement>({
      enabled: needsButtonSemantics && !disabled,
      onBlur: (event) => onBlur?.(event as unknown as FocusEvent<HTMLButtonElement>),
      onKeyDown: (event) => onKeyDown?.(event as unknown as KeyboardEvent<HTMLButtonElement>),
      onKeyUp: (event) => onKeyUp?.(event as unknown as KeyboardEvent<HTMLButtonElement>),
    });

    const activationHandlers = createDisabledActivationHandlers(shouldGuardDelegatedActivation, {
      onAuxClick,
      onAuxClickCapture,
      onClick: handleClick,
      onClickCapture,
      onKeyDown: keyboardActivation.onKeyDown,
      onKeyDownCapture,
      onKeyUp: keyboardActivation.onKeyUp,
      onKeyUpCapture,
      onPointerDown,
      onPointerDownCapture,
      onPointerUp,
      onPointerUpCapture,
    });
    const guardedChildren = guardDisabledActivationHandlers(
      children,
      shouldGuardDelegatedActivation,
    );
    const delegatedChildren =
      canUseAsChild && isValidElement<Record<string, unknown>>(guardedChildren)
        ? cloneElement(guardedChildren, {
            ...(disabled ? { 'aria-disabled': true } : {}),
            ...(disabled && (isNativeAsChildButton || isCustomAsChildButton)
              ? { disabled: true }
              : {}),
            ...(isNativeAsChildButton || isCustomAsChildButton ? { type: 'button' } : {}),
            ...(needsButtonSemantics ? { role: 'button', tabIndex: 0 } : {}),
          })
        : guardedChildren;
    const fallbackChildren = asChild ? getFallbackChildrenForNativeButton(children) : children;

    return (
      <Component
        ref={mergedRef}
        {...hostProps}
        type={canUseAsChild ? undefined : 'button'}
        disabled={canUseAsChild ? undefined : disabled}
        aria-disabled={disabled ? true : undefined}
        {...activationHandlers}
        onBlur={keyboardActivation.onBlur}
      >
        {canUseAsChild ? delegatedChildren : (fallbackChildren ?? defaultContent)}
      </Component>
    );
  },
);

OverlayDismissControl.displayName = 'OverlayDismissControl';
