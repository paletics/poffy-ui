'use client';

import { ActionMotion } from '@/components/animations';
import { Spinner } from '@/components/feedback';
import {
  getFallbackChildrenForNativeButton,
  isButtonAsChildHost,
  shouldEmulateButtonHost,
} from '@/components/shared/asChild';
import { omitNativeButtonOnlyProps } from '@/components/shared/buttonDelegation';
import { useOptionalAnimation } from '@/providers/AnimationProvider';
import { cx } from '@/styled-system/css';
import { button } from '@/styled-system/recipes';
import {
  createDisabledActivationHandlers,
  guardDisabledActivationHandlers,
  useButtonKeyboardActivation,
} from '@poffy-ui/behavior/activation';
import { Slot, Slottable } from '@radix-ui/react-slot';
import { cloneElement, forwardRef, isValidElement, type ElementType } from 'react';
import type { FocusEvent, KeyboardEvent, ReactNode } from 'react';
import { useButtonGroup } from '../ButtonGroup/ButtonGroupContext';
import type { ButtonComponent, ButtonProps } from './Button.types';

interface ButtonChildProps {
  type?: unknown;
}

const ButtonImpl = forwardRef<HTMLElement, ButtonProps>((rawProps, ref) => {
  const {
    intent = 'primary',
    appearance = 'solid',
    size = 'md',
    shape = 'rounded',
    glow = false,
    loading = false,
    loadingIcon,
    isGrow = false,
    startIcon,
    endIcon,
    animationType,
    children,
    className,
    disabled,
    type = 'button',
    asChild,
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
    'aria-disabled': ariaDisabled,
    'aria-busy': ariaBusy,
    'data-disabled': dataDisabled,
    'data-loading': dataLoading,
    ...rest
  } = rawProps as ButtonProps & { type?: 'button' | 'reset' | 'submit' };
  const isDisabled = [disabled, loading].some(Boolean);
  const { isAnimating } = useOptionalAnimation();

  const recipeClass = button({
    intent,
    appearance,
    size,
    shape,
    // Glow is owned by Poffy's animation policy. Do not leave a CSS keyframe
    // on disabled controls or when the provider resolves motion to static.
    glow: glow && isAnimating && !isDisabled,
    isGrow,
  });

  const groupContext = useButtonGroup();
  const isConnected = groupContext?.connected;

  const finalAnimation = isDisabled
    ? undefined
    : (animationType ??
      (isConnected
        ? 'subtle'
        : appearance === 'neo' || appearance === 'solid'
          ? 'physical'
          : 'bouncy'));

  const shadowSize = isConnected ? 0 : appearance === 'neo' ? 8 : appearance === 'solid' ? 4 : 0;
  const shadowColor =
    appearance === 'neo'
      ? 'var(--neo-shadow-color, #000000)'
      : 'var(--btn-shadow-color, rgba(0,0,0,0.2))';

  const asChildElement = asChild && isButtonAsChildHost(children) ? children : null;
  const canUseAsChild = Boolean(asChildElement);
  const isNativeAsChildButton = asChildElement?.type === 'button';
  const asChildButtonType = (asChildElement?.props as ButtonChildProps | undefined)?.type;
  const needsButtonSemantics = Boolean(canUseAsChild && shouldEmulateButtonHost(asChildElement));
  const shouldProvideTabIndex = Boolean(
    needsButtonSemantics && asChildElement?.props.tabIndex === undefined,
  );
  const Component = (canUseAsChild ? Slot : 'button') as ElementType;
  const fallbackChildren =
    asChild && !canUseAsChild ? getFallbackChildrenForNativeButton(children) : children;
  const shouldGuardAsChildActivation = Boolean(canUseAsChild && isDisabled);
  const keyboardActivation = useButtonKeyboardActivation<HTMLElement>({
    enabled: needsButtonSemantics && !isDisabled,
    onBlur: (event) => onBlur?.(event as unknown as FocusEvent<HTMLButtonElement>),
    onKeyDown: (event) => onKeyDown?.(event as unknown as KeyboardEvent<HTMLButtonElement>),
    onKeyUp: (event) => onKeyUp?.(event as unknown as KeyboardEvent<HTMLButtonElement>),
  });
  const guardedChildren = guardDisabledActivationHandlers(
    fallbackChildren,
    shouldGuardAsChildActivation,
  );
  const activationHandlers = createDisabledActivationHandlers(shouldGuardAsChildActivation, {
    onAuxClick,
    onAuxClickCapture,
    onClickCapture,
    onClick,
    onKeyDownCapture,
    onKeyDown: keyboardActivation.onKeyDown,
    onKeyUp: keyboardActivation.onKeyUp,
    onKeyUpCapture,
    onPointerDown,
    onPointerDownCapture,
    onPointerUp,
    onPointerUpCapture,
  });
  const slottableChildren: ReactNode =
    canUseAsChild && isValidElement<Record<string, unknown>>(guardedChildren)
      ? cloneElement(guardedChildren, {
          ...(isDisabled
            ? {
                'aria-disabled': true,
                'data-disabled': !loading ? '' : undefined,
                'data-loading': loading ? '' : undefined,
              }
            : {}),
          ...(loading ? { 'aria-busy': true } : {}),
          ...(isNativeAsChildButton
            ? {
                disabled: isDisabled,
                type: asChildButtonType ?? 'button',
              }
            : {}),
          ...(needsButtonSemantics
            ? { role: 'button', tabIndex: shouldProvideTabIndex ? 0 : undefined }
            : {}),
        })
      : guardedChildren;
  const hostProps = asChild ? omitNativeButtonOnlyProps(rest) : rest;

  return (
    <ActionMotion
      asChild
      disabled={isDisabled}
      animationType={finalAnimation}
      customData={{ shadowSize, shadowColor }}
    >
      <Component
        ref={ref}
        type={canUseAsChild ? undefined : type}
        className={cx(recipeClass, className)}
        // Native disabled on Slot would become an invalid HTML attribute on non-button children.
        disabled={canUseAsChild ? undefined : isDisabled}
        aria-disabled={isDisabled ? true : ariaDisabled}
        aria-busy={loading ? true : ariaBusy}
        data-disabled={isDisabled && !loading ? '' : dataDisabled}
        data-loading={loading ? '' : dataLoading}
        {...hostProps}
        onBlur={keyboardActivation.onBlur}
        {...activationHandlers}
      >
        {loading && (
          <span data-part="icon" aria-hidden="true">
            {loadingIcon ?? <Spinner decorative size={20} thickness={2} />}
          </span>
        )}
        {!loading && startIcon && <span data-part="icon">{startIcon}</span>}
        {canUseAsChild ? <Slottable>{slottableChildren}</Slottable> : guardedChildren}
        {!loading && endIcon && <span data-part="icon">{endIcon}</span>}
      </Component>
    </ActionMotion>
  );
});

ButtonImpl.displayName = 'Button';

/**
 * Triggers an action, including while delegated to a compatible `asChild` host.
 *
 * A passive delegated host receives button role, focusability, and Enter/Space activation;
 * native button-only form attributes are not forwarded to another host. Invalid hosts fall back
 * to a native button. `disabled` and `loading` prevent pointer and keyboard activation, while
 * `loading` also replaces the inline icons with a decorative progress indicator.
 */

export const Button = ButtonImpl as ButtonComponent;
