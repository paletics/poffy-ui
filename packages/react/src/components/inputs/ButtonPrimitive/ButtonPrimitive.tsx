'use client';

import {
  getFallbackChildrenForNativeButton,
  isNonVoidAsChildHost,
} from '@/components/shared/asChild';
import { omitNativeButtonOnlyProps } from '@/components/shared/buttonDelegation';
import {
  guardActivationHandlers,
  useButtonKeyboardActivation,
} from '@poffy-ui/behavior/activation';
import { Slot, Slottable } from '@radix-ui/react-slot';
import { cloneElement, forwardRef, isValidElement } from 'react';
import type {
  FocusEvent,
  ElementType,
  KeyboardEvent,
  MouseEvent,
  PointerEvent,
  ReactElement,
  ReactNode,
} from 'react';
import type { ButtonPrimitiveComponent, ButtonPrimitiveProps } from './ButtonPrimitive.types';
import {
  isButtonPrimitiveAsChildHost,
  shouldProvideButtonPrimitiveSemantics,
} from './ButtonPrimitive.utils';

interface ButtonPrimitiveChildProps {
  [key: string]: unknown;
  tabIndex?: unknown;
  type?: unknown;
}

const ButtonPrimitiveImpl = forwardRef<HTMLElement, ButtonPrimitiveProps>((props, ref) => {
  const {
    asChild,
    children,
    disabled = false,
    type = 'button',
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
    'aria-disabled': _ariaDisabled,
    ...rest
  } = props as ButtonPrimitiveProps & { type?: 'button' | 'reset' | 'submit' };
  const asChildElement =
    asChild && isButtonPrimitiveAsChildHost(children)
      ? (children as ReactElement<ButtonPrimitiveChildProps>)
      : null;
  const canUseAsChild = Boolean(asChild && asChildElement);
  const Component = (canUseAsChild ? Slot : 'button') as ElementType;
  const isNativeAsChildButton = asChildElement?.type === 'button';
  const shouldForwardNativeButtonProps = isNativeAsChildButton;
  const shouldProvideButtonSemantics = Boolean(
    asChild && shouldProvideButtonPrimitiveSemantics(children),
  );
  const shouldProvideTabIndex = Boolean(
    shouldProvideButtonSemantics && asChildElement?.props.tabIndex === undefined,
  );
  const fallbackChildren = isValidElement<{ children?: ReactNode }>(children)
    ? children.props.children
    : children;
  const safeFallbackChildren =
    asChild && isNonVoidAsChildHost(children) && !canUseAsChild
      ? getFallbackChildrenForNativeButton(children)
      : fallbackChildren;

  const blockAsChildActivation = (event: MouseEvent<HTMLElement>) => {
    if (disabled && canUseAsChild) {
      event.preventDefault();
      event.stopPropagation();
      return true;
    }

    return false;
  };

  const blockAsChildKeyboardActivation = (event: KeyboardEvent<HTMLElement>) => {
    if (
      disabled &&
      canUseAsChild &&
      (event.key === 'Enter' || event.key === ' ' || event.code === 'Space')
    ) {
      event.preventDefault();
      event.stopPropagation();
      return true;
    }

    return false;
  };

  const blockAsChildPointerInteraction = (event: PointerEvent<HTMLElement>) => {
    if (!disabled || !canUseAsChild) return false;
    event.preventDefault();
    event.stopPropagation();
    return true;
  };

  const handleClickCapture = (event: MouseEvent<HTMLElement>) => {
    if (blockAsChildActivation(event)) return;
    onClickCapture?.(event as MouseEvent<HTMLButtonElement>);
  };

  const handleAuxClickCapture = (event: MouseEvent<HTMLElement>) => {
    if (blockAsChildActivation(event)) return;
    onAuxClickCapture?.(event as MouseEvent<HTMLButtonElement>);
  };

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    if (blockAsChildActivation(event)) return;
    onClick?.(event as MouseEvent<HTMLButtonElement>);
  };

  const handleAuxClick = (event: MouseEvent<HTMLElement>) => {
    if (blockAsChildActivation(event)) return;
    onAuxClick?.(event as MouseEvent<HTMLButtonElement>);
  };

  const handleKeyDownCapture = (event: KeyboardEvent<HTMLElement>) => {
    if (blockAsChildKeyboardActivation(event)) return;
    onKeyDownCapture?.(event as KeyboardEvent<HTMLButtonElement>);
  };

  const handleKeyUpCapture = (event: KeyboardEvent<HTMLElement>) => {
    if (blockAsChildKeyboardActivation(event)) return;
    onKeyUpCapture?.(event as KeyboardEvent<HTMLButtonElement>);
  };

  const keyboardActivation = useButtonKeyboardActivation<HTMLElement>({
    enabled: shouldProvideButtonSemantics && !disabled,
    onBlur: (event) => onBlur?.(event as unknown as FocusEvent<HTMLButtonElement>),
    onKeyDown: (event) => {
      if (blockAsChildKeyboardActivation(event)) return;
      onKeyDown?.(event as unknown as KeyboardEvent<HTMLButtonElement>);
    },
    onKeyUp: (event) => {
      if (blockAsChildKeyboardActivation(event)) return;
      onKeyUp?.(event as unknown as KeyboardEvent<HTMLButtonElement>);
    },
  });

  const handlePointerDownCapture = (event: PointerEvent<HTMLElement>) => {
    if (blockAsChildPointerInteraction(event)) return;
    onPointerDownCapture?.(event as PointerEvent<HTMLButtonElement>);
  };

  const handlePointerDown = (event: PointerEvent<HTMLElement>) => {
    if (blockAsChildPointerInteraction(event)) return;
    onPointerDown?.(event as PointerEvent<HTMLButtonElement>);
  };

  const handlePointerUpCapture = (event: PointerEvent<HTMLElement>) => {
    if (blockAsChildPointerInteraction(event)) return;
    onPointerUpCapture?.(event as PointerEvent<HTMLButtonElement>);
  };

  const handlePointerUp = (event: PointerEvent<HTMLElement>) => {
    if (blockAsChildPointerInteraction(event)) return;
    onPointerUp?.(event as PointerEvent<HTMLButtonElement>);
  };

  const guardedChildren = guardActivationHandlers(children, Boolean(canUseAsChild && disabled), {
    onAuxClickCapture: handleAuxClickCapture,
    onAuxClick: handleAuxClick,
    onClickCapture: handleClickCapture,
    onClick: handleClick,
    onKeyDownCapture: handleKeyDownCapture,
    onKeyDown: keyboardActivation.onKeyDown,
    onKeyUpCapture: handleKeyUpCapture,
    onKeyUp: keyboardActivation.onKeyUp,
    onPointerDownCapture: handlePointerDownCapture,
    onPointerDown: handlePointerDown,
    onPointerUpCapture: handlePointerUpCapture,
    onPointerUp: handlePointerUp,
  });
  const slottableChildren =
    canUseAsChild &&
    isValidElement<ButtonPrimitiveChildProps & { children?: ReactNode }>(guardedChildren)
      ? cloneElement(
          guardedChildren,
          {
            'aria-disabled': disabled ? true : undefined,
            ...(shouldForwardNativeButtonProps
              ? { disabled, type: asChildElement.props.type ?? 'button' }
              : {}),
            ...(shouldProvideButtonSemantics
              ? { role: 'button', tabIndex: shouldProvideTabIndex ? 0 : undefined }
              : {}),
          },
          guardedChildren.props.children,
        )
      : guardedChildren;
  const hostProps = asChild ? omitNativeButtonOnlyProps(rest) : rest;

  return (
    <Component
      ref={ref}
      type={canUseAsChild ? undefined : type}
      disabled={canUseAsChild ? undefined : disabled}
      {...hostProps}
      aria-disabled={disabled ? true : undefined}
      onBlur={keyboardActivation.onBlur}
      onAuxClickCapture={handleAuxClickCapture}
      onAuxClick={handleAuxClick}
      onClickCapture={handleClickCapture}
      onClick={handleClick}
      onKeyDownCapture={handleKeyDownCapture}
      onKeyDown={keyboardActivation.onKeyDown}
      onKeyUpCapture={handleKeyUpCapture}
      onKeyUp={keyboardActivation.onKeyUp}
      onPointerDownCapture={handlePointerDownCapture}
      onPointerDown={handlePointerDown}
      onPointerUpCapture={handlePointerUpCapture}
      onPointerUp={handlePointerUp}
    >
      {canUseAsChild ? (
        <Slottable>{slottableChildren}</Slottable>
      ) : asChild ? (
        safeFallbackChildren
      ) : (
        children
      )}
    </Component>
  );
});

ButtonPrimitiveImpl.displayName = 'ButtonPrimitive';

/**
 * Supplies unstyled button behavior for components that own their visual treatment.
 *
 * A compatible passive `asChild` host receives button role, focusability, and Enter/Space
 * activation. Incompatible children fall back to a native button; disabled delegated hosts
 * receive `aria-disabled` and have pointer and activation events stopped before child handlers.
 */

export const ButtonPrimitive = ButtonPrimitiveImpl as ButtonPrimitiveComponent;
