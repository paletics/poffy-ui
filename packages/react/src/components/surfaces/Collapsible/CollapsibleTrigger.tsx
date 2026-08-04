'use client';

import { Slot, Slottable } from '@radix-ui/react-slot';
import {
  createDisabledActivationHandlers,
  guardDisabledActivationHandlers,
  useButtonKeyboardActivation,
} from '@poffy-ui/behavior/activation';
import { cloneElement, forwardRef, useEffect, useId, type MouseEventHandler } from 'react';
import type { ElementType } from 'react';
import { ChevronDownIcon } from '@/components/media/Icon/icons';
import {
  getFallbackChildrenForNativeButton,
  isButtonCompatibleAsChildHost,
  isButtonTriggerAsChildHost,
  shouldEmulateButtonHost,
} from '@/components/shared/asChild';
import { omitNativeButtonOnlyProps } from '@/components/shared/buttonDelegation';
import { cx } from '@/styled-system/css';
import { useCollapsible } from './CollapsibleContext';
import type {
  CollapsibleTriggerComponent,
  CollapsibleTriggerProps,
} from './Collapsible.types';
import { COLLAPSIBLE_TRIGGER_MARKER } from './CollapsibleTopology';

/**
 * Interactive control that toggles a `Collapsible` content region.
 */
const CollapsibleTriggerImpl = forwardRef<HTMLElement, CollapsibleTriggerProps>(
  (rawProps, ref) => {
    const {
      asChild,
      children,
      className,
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
      'data-state': _dataState,
      disabled: _disabled,
      id: _id,
      role: _role,
      tabIndex: _tabIndex,
      type: _type,
      ...props
    } = rawProps as CollapsibleTriggerProps & {
      'aria-controls'?: unknown;
      'aria-disabled'?: unknown;
      'aria-expanded'?: unknown;
      'data-state'?: unknown;
      disabled?: unknown;
      id?: unknown;
      role?: unknown;
      tabIndex?: unknown;
      type?: unknown;
    };
    const {
      open,
      disabled,
      contentPresent,
      invalidStructure,
      panelId,
      registerTrigger,
      triggerId,
      toggle,
      classes,
    } = useCollapsible();
    const generatedId = useId();
    const ownId = triggerId ?? generatedId;
    useEffect(() => registerTrigger(ownId), [ownId, registerTrigger]);
    const effectiveDisabled = Boolean(disabled || invalidStructure);
    const effectiveOpen = open && !invalidStructure;
    const asChildElement =
      asChild && isButtonTriggerAsChildHost(children) ? children : null;
    const canUseAsChild = Boolean(asChild && asChildElement);
    const isButtonCompatibleHost = isButtonCompatibleAsChildHost(asChildElement);
    const isAsChildAnchor = Boolean(
      asChildElement?.type === 'a' && (asChildElement.props.href ?? null) !== null,
    );
    const shouldProvideButtonSemantics = Boolean(
      canUseAsChild &&
        (isAsChildAnchor || shouldEmulateButtonHost(asChildElement)) &&
        asChildElement?.props.role !== 'button',
    );
    const shouldProvideTabIndex = Boolean(
      canUseAsChild &&
        !isButtonCompatibleHost &&
        asChildElement?.props.tabIndex === undefined,
    );
    const Component = (canUseAsChild ? Slot : 'button') as ElementType;
    const hostProps = asChild ? omitNativeButtonOnlyProps(props) : props;
    const controls =
      !invalidStructure && [effectiveOpen, contentPresent].some(Boolean) ? panelId : undefined;

    const keyboardActivation = useButtonKeyboardActivation<HTMLElement>({
      enabled: canUseAsChild && !isButtonCompatibleHost && !effectiveDisabled,
      onBlur,
      onKeyDown,
      onKeyUp,
    });
    const slottableChildren =
      canUseAsChild && asChildElement
        ? cloneElement(asChildElement, {
            ...(shouldProvideButtonSemantics ? { role: 'button' } : {}),
            ...(shouldProvideTabIndex ? { tabIndex: 0 } : {}),
            ...(isAsChildAnchor ? { href: undefined } : {}),
            ...(isButtonCompatibleHost
              ? { type: 'button', disabled: effectiveDisabled }
              : {}),
          })
        : children;
    const guardedChildren = guardDisabledActivationHandlers(
      slottableChildren,
      Boolean(canUseAsChild && effectiveDisabled),
    );
    const handleClick: MouseEventHandler<HTMLElement> = (event) => {
      (onClick as MouseEventHandler<HTMLElement> | undefined)?.(event);
      if (event.defaultPrevented) return;
      if (canUseAsChild && event.currentTarget.tagName !== 'BUTTON') event.preventDefault();
      if (!invalidStructure) toggle();
    };
    const shouldGuardActivation = Boolean(canUseAsChild && effectiveDisabled);
    const activationHandlers = shouldGuardActivation
      ? createDisabledActivationHandlers(true, {
          onKeyDown,
          onKeyDownCapture,
          onKeyUp,
          onKeyUpCapture,
        })
      : {
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
        };

    return (
      <Component
        ref={ref}
        {...hostProps}
        type={canUseAsChild ? undefined : 'button'}
        className={cx(classes.trigger, className)}
        disabled={canUseAsChild ? undefined : effectiveDisabled}
        aria-disabled={effectiveDisabled ? true : undefined}
        aria-expanded={effectiveOpen}
        aria-controls={controls}
        id={ownId}
        data-state={effectiveOpen ? 'open' : 'closed'}
        {...activationHandlers}
        onBlur={keyboardActivation.onBlur}
      >
        {canUseAsChild ? (
          <Slottable>{guardedChildren}</Slottable>
        ) : asChild ? (
          getFallbackChildrenForNativeButton(children)
        ) : (
          children
        )}
        <span
          className={classes.indicator}
          data-open={effectiveOpen ? '' : undefined}
          aria-hidden="true"
        >
          <ChevronDownIcon size="sm" />
        </span>
      </Component>
    );
  },
);

CollapsibleTriggerImpl.displayName = 'CollapsibleTrigger';

/**
 * Toggles the nearest Collapsible with managed button semantics.
 *
 * It connects `aria-expanded` and `aria-controls` only when the compound
 * topology is valid. Delegated non-button hosts gain keyboard button behavior;
 * delegated links lose navigation. Disabled and invalid structures block all
 * activation. A decorative chevron is appended to the rendered control.
 */

export const CollapsibleTrigger =
  CollapsibleTriggerImpl as CollapsibleTriggerComponent;
(CollapsibleTrigger as CollapsibleTriggerComponent & {
  [COLLAPSIBLE_TRIGGER_MARKER]?: boolean;
})[
  COLLAPSIBLE_TRIGGER_MARKER
] = true;
