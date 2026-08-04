'use client';

import { getNextToggleButtonPressed } from '@poffy-ui/behavior/toggle-button';
import { useControllableState } from '@poffy-ui/behavior/hooks';
import { cx } from '@/styled-system/css';
import { toggleButton } from '@/styled-system/recipes';
import {
  getFallbackChildrenForNativeButton,
  isButtonCompatibleAsChildHost,
  isExclusiveButtonAsChildHost,
  isNonVoidAsChildHost,
} from '@/components/shared/asChild';
import {
  createDisabledActivationHandlers,
  guardDisabledActivationHandlers,
  useButtonKeyboardActivation,
} from '@poffy-ui/behavior/activation';
import { omitNativeButtonOnlyProps } from '@/components/shared/buttonDelegation';
import { Slot, Slottable } from '@radix-ui/react-slot';
import { cloneElement, forwardRef, isValidElement } from 'react';
import type { ElementType, FocusEvent, KeyboardEvent, MouseEvent, ReactNode } from 'react';
import type { ToggleButtonComponent, ToggleButtonProps } from './ToggleButton.types';
import { useWarnInvalidControllableState } from '@/components/inputs/shared/useWarnInvalidControllableState';


const ToggleButtonImpl = forwardRef<HTMLElement, ToggleButtonProps>((rawProps, ref) => {
  const {
    children,
    size = 'md',
    intent = 'primary',
    appearance = 'ghost',
    shape = 'rounded',
    pressed: controlledPressed,
    defaultPressed = false,
    onPressedChange,
    startIcon,
    endIcon,
    className,
    disabled = false,
    'aria-pressed': _ariaPressed,
    'aria-disabled': _ariaDisabled,
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
    asChild,
    type: _type,
    ...props
  } = rawProps as ToggleButtonProps & { type?: unknown };
  const resolvedOnPressedChange =
    typeof onPressedChange === 'function' ? onPressedChange : undefined;
  useWarnInvalidControllableState({
    componentName: 'ToggleButton',
    value: controlledPressed,
    defaultValue: rawProps.defaultPressed,
    handler: onPressedChange,
  });
  const normalizedControlledPressed =
    controlledPressed === undefined
      ? undefined
      : typeof controlledPressed === 'boolean'
        ? controlledPressed
        : false;
  const normalizedDefaultPressed = typeof defaultPressed === 'boolean' ? defaultPressed : false;
  const {
    value: pressed,
    isControlled,
    setValue: setUncontrolledPressed,
  } = useControllableState({
    value: normalizedControlledPressed,
    defaultValue: normalizedDefaultPressed,
  });

  const recipeClass = toggleButton({ size, intent, variant: appearance, shape, pressed });
  const asChildElement = asChild && isExclusiveButtonAsChildHost(children) ? children : null;
  const canUseAsChild = Boolean(asChild && asChildElement);
  const Component = (canUseAsChild ? Slot : 'button') as ElementType;
  const isNativeAsChildButton = canUseAsChild && asChildElement?.type === 'button';
  const isButtonCompatibleHost = isButtonCompatibleAsChildHost(asChildElement);
  const shouldProvideButtonSemantics = Boolean(canUseAsChild && !isNativeAsChildButton);
  const shouldProvideTabIndex = Boolean(
    shouldProvideButtonSemantics && asChildElement?.props.tabIndex === undefined,
  );
  const shouldGuardAsChildActivation = Boolean(canUseAsChild && disabled);
  const fallbackChildren = isValidElement<{ children?: ReactNode }>(children)
    ? children.props.children
    : children;
  const safeFallbackChildren =
    asChild && isNonVoidAsChildHost(children) && !canUseAsChild
      ? getFallbackChildrenForNativeButton(children)
      : fallbackChildren;
  const { variant: _variant, ...buttonProps } = props as typeof props & { variant?: unknown };
  const hostProps = asChild ? omitNativeButtonOnlyProps(buttonProps) : buttonProps;

  const togglePressed = () => {
    const newPressed = getNextToggleButtonPressed(pressed);

    if (!isControlled) {
      setUncontrolledPressed(newPressed);
    }

    resolvedOnPressedChange?.(newPressed);
  };

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    onClick?.(event as MouseEvent<HTMLButtonElement>);
    if (event.defaultPrevented) return;

    if (canUseAsChild && event.currentTarget.tagName !== 'BUTTON') {
      event.preventDefault();
    }

    togglePressed();
  };

  const keyboardActivation = useButtonKeyboardActivation<HTMLElement>({
    enabled: canUseAsChild && !isNativeAsChildButton && !disabled,
    onBlur: (event) => onBlur?.(event as unknown as FocusEvent<HTMLButtonElement>),
    onKeyDown: (event) => onKeyDown?.(event as unknown as KeyboardEvent<HTMLButtonElement>),
    onKeyUp: (event) => onKeyUp?.(event as unknown as KeyboardEvent<HTMLButtonElement>),
  });

  const activationHandlers = createDisabledActivationHandlers(shouldGuardAsChildActivation, {
    onAuxClick: onAuxClick as React.MouseEventHandler<HTMLElement> | undefined,
    onAuxClickCapture: onAuxClickCapture as React.MouseEventHandler<HTMLElement> | undefined,
    onClick: handleClick,
    onClickCapture: onClickCapture as React.MouseEventHandler<HTMLElement> | undefined,
    onKeyDown: keyboardActivation.onKeyDown,
    onKeyDownCapture: onKeyDownCapture as React.KeyboardEventHandler<HTMLElement> | undefined,
    onKeyUp: keyboardActivation.onKeyUp,
    onKeyUpCapture: onKeyUpCapture as React.KeyboardEventHandler<HTMLElement> | undefined,
    onPointerDown: onPointerDown as React.PointerEventHandler<HTMLElement> | undefined,
    onPointerDownCapture: onPointerDownCapture as
      | React.PointerEventHandler<HTMLElement>
      | undefined,
    onPointerUp: onPointerUp as React.PointerEventHandler<HTMLElement> | undefined,
    onPointerUpCapture: onPointerUpCapture as React.PointerEventHandler<HTMLElement> | undefined,
  });
  const guardedChildren = guardDisabledActivationHandlers(children, shouldGuardAsChildActivation);
  const slottableChildren =
    canUseAsChild && isValidElement<Record<string, unknown>>(guardedChildren)
      ? cloneElement(guardedChildren, {
          'aria-pressed': pressed,
          'aria-disabled': disabled ? true : undefined,
          disabled: isButtonCompatibleHost ? disabled : undefined,
          ...(isButtonCompatibleHost ? { type: 'button' } : {}),
          ...(shouldProvideButtonSemantics
            ? {
                role: 'button',
                tabIndex: shouldProvideTabIndex ? 0 : undefined,
              }
            : {}),
        })
      : guardedChildren;

  return (
    <Component
      ref={ref}
      className={cx(recipeClass, className)}
      disabled={canUseAsChild ? undefined : disabled}
      {...hostProps}
      type={canUseAsChild ? undefined : 'button'}
      aria-pressed={pressed}
      aria-disabled={disabled ? true : undefined}
      data-disabled={disabled ? '' : undefined}
      onBlur={keyboardActivation.onBlur}
      role={shouldProvideButtonSemantics ? 'button' : undefined}
      tabIndex={shouldProvideTabIndex ? 0 : undefined}
      {...activationHandlers}
    >
      {startIcon && (
        <span data-slot="icon" aria-hidden="true">
          {startIcon}
        </span>
      )}
      {canUseAsChild ? (
        <Slottable>{slottableChildren}</Slottable>
      ) : asChild ? (
        safeFallbackChildren
      ) : (
        children
      )}
      {endIcon && (
        <span data-slot="icon" aria-hidden="true">
          {endIcon}
        </span>
      )}
    </Component>
  );
});

ToggleButtonImpl.displayName = 'ToggleButton';

/**
 * Toggles an independent boolean preference and exposes its state through `aria-pressed`.
 *
 * Supply `pressed` with `onPressedChange` for controlled state, or omit it to use
 * `defaultPressed`. The component changes uncontrolled state and calls `onPressedChange` only
 * after an unprevented activation. `asChild` accepts action-only hosts; passive hosts receive
 * button keyboard semantics and link-like hosts fall back to a native button.
 */

export const ToggleButton = ToggleButtonImpl as ToggleButtonComponent;
