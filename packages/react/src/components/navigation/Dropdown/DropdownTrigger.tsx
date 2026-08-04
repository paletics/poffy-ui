'use client';

import { ActionMotion } from '@/components/animations/ActionMotion';
import {
  getFallbackAccessibleNamePropsForNativeButton,
  getFallbackChildrenForNativeButton,
  isButtonTriggerAsChildHost,
  shouldEmulateButtonHost,
} from '@/components/shared/asChild';
import { cx } from '@/styled-system/css';
import {
  createDisabledActivationHandlers,
  guardDisabledActivationHandlers,
  useButtonKeyboardActivation,
} from '@poffy-ui/behavior/activation';
import { useMergeRefs } from '@poffy-ui/behavior/hooks';
import { Slot } from '@radix-ui/react-slot';
import {
  cloneElement,
  forwardRef,
  isValidElement,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEventHandler,
} from 'react';
import type { DropdownTriggerProps } from './Dropdown.types';
import { useDropdownContext } from './DropdownContext';

/**
 * Toggles its DropdownMenu and owns its reference and expanded-state ARIA attributes. Use exactly one
 * trigger per Dropdown; keyboard activation and Escape handling are managed with the menu.
 */
export const DropdownTrigger = forwardRef<HTMLElement, DropdownTriggerProps>(
  (rawProps, propRef) => {
    const {
      asChild,
      className,
      children,
      disabled = false,
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
      'aria-controls': _ariaControls,
      'aria-disabled': _ariaDisabled,
      'aria-expanded': _ariaExpanded,
      'aria-haspopup': _ariaHasPopup,
      role: _role,
      tabIndex: _tabIndex,
      type: _type,
      ...props
    } = rawProps as DropdownTriggerProps & {
      'aria-controls'?: unknown;
      'aria-disabled'?: unknown;
      'aria-expanded'?: unknown;
      'aria-haspopup'?: unknown;
      role?: unknown;
      tabIndex?: unknown;
      type?: unknown;
    };
    const { refs, getReferenceProps, open, classes } = useDropdownContext();

    const mergedRef = useMergeRefs(refs.setReference, propRef);
    const asChildElement = asChild && isButtonTriggerAsChildHost(children) ? children : null;
    const canUseAsChild = Boolean(asChildElement);
    const isNativeAsChildButton = asChildElement?.type === 'button';
    const isCustomAsChildButton = Boolean(
      asChildElement && typeof asChildElement.type !== 'string',
    );
    const isAsChildAnchor = Boolean(
      asChildElement?.type === 'a' && (asChildElement.props.href ?? null) !== null,
    );
    const needsButtonSemantics = Boolean(
      canUseAsChild && (isAsChildAnchor ? true : shouldEmulateButtonHost(asChildElement)),
    );
    const Component = canUseAsChild ? Slot : 'button';
    const fallbackChildren =
      asChild && !canUseAsChild ? getFallbackChildrenForNativeButton(children) : children;
    const fallbackAccessibleNameProps =
      asChild && !canUseAsChild ? getFallbackAccessibleNamePropsForNativeButton(children) : {};
    const hasWrapperAccessibleName = [props['aria-label'], props['aria-labelledby']].some(
      (value) => typeof value === 'string' && value.trim() !== '',
    );
    const shouldGuardActivation = canUseAsChild && disabled;
    const keyboardActivation = useButtonKeyboardActivation<HTMLElement>({
      enabled: needsButtonSemantics && !disabled,
      onBlur: (event) => onBlur?.(event as unknown as FocusEvent<HTMLButtonElement>),
      onKeyDown: (event) => onKeyDown?.(event as unknown as KeyboardEvent<HTMLButtonElement>),
      onKeyUp: (event) => onKeyUp?.(event as unknown as KeyboardEvent<HTMLButtonElement>),
    });
    const guardedChildren = guardDisabledActivationHandlers(
      fallbackChildren,
      shouldGuardActivation,
    );
    const activationHandlers = createDisabledActivationHandlers(shouldGuardActivation, {
      onAuxClick,
      onAuxClickCapture,
      onClick,
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
    const referenceProps = getReferenceProps({
      ...props,
      ...activationHandlers,
    });
    const handleReferenceClick: MouseEventHandler<HTMLElement> = (event) => {
      if (event.defaultPrevented) return;
      const referenceClick: unknown = (referenceProps as { onClick?: unknown }).onClick;
      if (typeof referenceClick === 'function') referenceClick(event);
      if (event.currentTarget.tagName === 'A' && !event.defaultPrevented) event.preventDefault();
    };
    const renderedChildren =
      canUseAsChild && isValidElement<Record<string, unknown>>(guardedChildren)
        ? cloneElement(guardedChildren, {
            'aria-expanded': open,
            'aria-haspopup': referenceProps['aria-haspopup'],
            'aria-controls': referenceProps['aria-controls'],
            'aria-disabled': disabled ? true : undefined,
            ...(isNativeAsChildButton || isCustomAsChildButton
              ? { disabled: disabled ? true : undefined }
              : {}),
            tabIndex: 0,
            ...(isAsChildAnchor ? { href: undefined } : {}),
            ...(isNativeAsChildButton || isCustomAsChildButton ? { type: 'button' } : {}),
            ...(needsButtonSemantics ? { role: 'button' } : {}),
          })
        : guardedChildren;

    return (
      <ActionMotion asChild animationType="press" disabled={disabled}>
        <Component
          ref={mergedRef}
          type={canUseAsChild ? undefined : 'button'}
          {...referenceProps}
          {...(!hasWrapperAccessibleName ? fallbackAccessibleNameProps : {})}
          disabled={canUseAsChild ? undefined : disabled}
          aria-disabled={disabled ? true : undefined}
          aria-expanded={open}
          className={cx(classes.trigger, className)}
          onClick={handleReferenceClick}
          onBlur={keyboardActivation.onBlur}
        >
          {renderedChildren}
        </Component>
      </ActionMotion>
    );
  },
);

DropdownTrigger.displayName = 'Dropdown.Trigger';
