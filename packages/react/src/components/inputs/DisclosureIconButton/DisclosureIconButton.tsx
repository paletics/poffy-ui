'use client';

import { ChevronDownIcon } from '@/components/media/Icon/icons';
import {
  isButtonCompatibleAsChildHost,
  isExclusiveButtonAsChildHost,
} from '@/components/shared/asChild';
import { omitNativeButtonOnlyProps } from '@/components/shared/buttonDelegation';
import { useButtonKeyboardActivation } from '@poffy-ui/behavior/activation';
import { cloneElement, forwardRef, isValidElement } from 'react';
import type {
  ForwardedRef,
  KeyboardEventHandler,
  MouseEventHandler,
  ReactElement,
  ReactNode,
} from 'react';
import { IconButton } from '@/components/inputs/IconButton';
import type {
  IconButtonAsChildProps,
  IconButtonDefaultProps,
} from '@/components/inputs/IconButton';
import type {
  DisclosureIconButtonComponent,
  DisclosureIconButtonProps,
} from './DisclosureIconButton.types';

interface DisclosureIconButtonChildProps extends Record<string, unknown> {
  role?: unknown;
  tabIndex?: unknown;
}

const DisclosureIconButtonImpl = forwardRef<HTMLElement, DisclosureIconButtonProps>(
  (props, ref) => {
    const {
      open,
      onOpenChange,
      onClick,
      icon = <ChevronDownIcon />,
      rotateOnOpen = true,
      disabled = false,
      loading = false,
      children,
      asChild,
      'aria-label': ariaLabel,
      'aria-controls': ariaControls,
      'aria-expanded': _ariaExpanded,
      'aria-disabled': _ariaDisabled,
      'data-state': _dataState,
      onKeyDown,
      onKeyUp,
      onBlur,
      ...rest
    } = props as DisclosureIconButtonProps & { 'aria-disabled'?: unknown };

    const asChildElement =
      asChild && isExclusiveButtonAsChildHost(children)
        ? (children as ReactElement<DisclosureIconButtonChildProps>)
        : null;
    const canUseAsChild = Boolean(asChild && asChildElement);
    const isNativeAsChildButton = canUseAsChild && asChildElement?.type === 'button';
    const isButtonCompatibleHost = isButtonCompatibleAsChildHost(asChildElement);
    const shouldProvideButtonSemantics = Boolean(
      canUseAsChild && !isNativeAsChildButton && asChildElement?.props.role !== 'button',
    );
    const shouldProvideTabIndex = Boolean(
      canUseAsChild && !isNativeAsChildButton && asChildElement?.props.tabIndex === undefined,
    );
    const isDisabled = [disabled, loading].some(Boolean);
    const hostProps = asChild ? omitNativeButtonOnlyProps(rest) : rest;
    const fallbackChildren = isValidElement<{ children?: ReactNode }>(children)
      ? children.props.children
      : children;
    const consumerOnClick = onClick as MouseEventHandler<HTMLElement> | undefined;
    const consumerOnKeyDown = onKeyDown as KeyboardEventHandler<HTMLElement> | undefined;
    const consumerOnKeyUp = onKeyUp as KeyboardEventHandler<HTMLElement> | undefined;

    const handleClick: MouseEventHandler<HTMLElement> = (e) => {
      if (isDisabled) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      consumerOnClick?.(e);
      if (e.defaultPrevented) return;

      if (canUseAsChild && e.currentTarget.tagName !== 'BUTTON') {
        e.preventDefault();
      }

      onOpenChange?.(!open);
    };

    const keyboardActivation = useButtonKeyboardActivation<HTMLElement>({
      enabled: canUseAsChild && !isDisabled,
      onBlur,
    });
    const handleKeyDown: KeyboardEventHandler<HTMLElement> = (event) => {
      consumerOnKeyDown?.(event);
      if (event.currentTarget.tagName !== 'BUTTON') keyboardActivation.onKeyDown(event);
    };

    const handleKeyUp: KeyboardEventHandler<HTMLElement> = (event) => {
      consumerOnKeyUp?.(event);
      if (event.currentTarget.tagName !== 'BUTTON') keyboardActivation.onKeyUp(event);
    };

    const iconNode = rotateOnOpen ? <span data-disclosure-icon>{icon}</span> : icon;

    const safeIcon = isValidElement(iconNode) ? iconNode : <ChevronDownIcon />;
    const slottableChildren =
      canUseAsChild && asChildElement
        ? cloneElement(asChildElement, {
            'aria-expanded': open,
            'aria-disabled': isDisabled ? true : undefined,
            'aria-label': ariaLabel,
            'aria-controls': ariaControls,
            'data-state': open ? 'open' : 'closed',
            ...(isButtonCompatibleHost ? { disabled: isDisabled, type: 'button' } : {}),
          })
        : children;

    const iconButtonProps = {
      icon: safeIcon,
      disabled,
      loading,
      ...hostProps,
      'aria-label': ariaLabel,
      'aria-controls': ariaControls,
      'aria-expanded': open,
      'data-state': open ? 'open' : 'closed',
      ...(shouldProvideButtonSemantics ? { role: 'button' as const } : {}),
      ...(shouldProvideTabIndex ? { tabIndex: 0 } : {}),
      onBlur: keyboardActivation.onBlur,
      onClick: handleClick,
      onKeyDown: handleKeyDown,
      onKeyUp: handleKeyUp,
    };

    return canUseAsChild ? (
      <IconButton
        ref={ref}
        {...({
          ...iconButtonProps,
          asChild: true,
          children: slottableChildren as ReactElement,
        } as unknown as IconButtonAsChildProps)}
      />
    ) : (
      <IconButton
        ref={ref as ForwardedRef<HTMLButtonElement>}
        {...({
          ...iconButtonProps,
          asChild: false,
          children: asChild ? fallbackChildren : slottableChildren,
        } as IconButtonDefaultProps)}
      />
    );
  },
);

DisclosureIconButtonImpl.displayName = 'DisclosureIconButton';

/**
 * Controlled icon trigger for an associated disclosure.
 *
 * It mirrors `open` to `aria-expanded` and `data-state`; update `open` in response to
 * `onOpenChange` for the visual state to change. A consumer `onClick` may cancel that request
 * with `preventDefault()`. Loading and disabled states suppress the request and activation.
 */

export const DisclosureIconButton =
  DisclosureIconButtonImpl as unknown as DisclosureIconButtonComponent;
