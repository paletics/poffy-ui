'use client';

import { useMergeRefs } from '@floating-ui/react';
import { Slot } from '@radix-ui/react-slot';
import {
  getFallbackAccessibleNamePropsForNativeButton,
  getFallbackChildrenForNativeButton,
  isButtonTriggerAsChildHost,
  shouldEmulateButtonHost,
} from '@/components/shared/asChild';
import { omitNativeButtonOnlyProps } from '@/components/shared/buttonDelegation';
import {
  createDisabledActivationHandlers,
  guardDisabledActivationHandlers,
  useButtonKeyboardActivation,
} from '@poffy-ui/behavior/activation';
import {
  cloneElement,
  forwardRef,
  isValidElement,
  type FocusEvent,
  type HTMLProps,
  type KeyboardEvent,
  type KeyboardEventHandler,
  type MouseEventHandler,
  useCallback,
  useLayoutEffect,
  useRef,
} from 'react';
import type { PopoverTriggerProps } from './Popover.types';
import { usePopoverContext } from './PopoverContext';
import { handleCancellableEscapeKeyDown } from '../shared/handleCancellableEscapeKeyDown';
import { useOverlayPartOwner } from '../shared/useOverlayPartOwnership';
import type { OverlayTriggerComponent } from '../shared/factories/types';


const PopoverTriggerImpl = forwardRef<HTMLElement, PopoverTriggerProps>((props, ref) => {
  const {
    children,
    asChild = false,
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
    ...rest
  } = props as PopoverTriggerProps & {
    'aria-controls'?: unknown;
    'aria-disabled'?: unknown;
    'aria-expanded'?: unknown;
    'aria-haspopup'?: unknown;
    role?: unknown;
    tabIndex?: unknown;
    type?: unknown;
  };
  const context = usePopoverContext();

  const ownership = useOverlayPartOwner(context, 'reference');
  const hostRef = useRef<HTMLElement | null>(null);
  const setOwnedReference = useCallback(
    (node: HTMLElement | null) => {
      if (ownership.isOwner) context.refs.setReference(node);
    },
    [context.refs, ownership.isOwner],
  );
  const mergedRef = useMergeRefs([hostRef, setOwnedReference, ref]);
  useLayoutEffect(() => {
    if (!ownership.isOwner) return;
    context.refs.setReference(hostRef.current);
    return () => context.refs.setReference(null);
  }, [context.refs, ownership.activeId, ownership.isOwner]);
  const asChildElement = asChild && isButtonTriggerAsChildHost(children) ? children : null;
  const canUseAsChild = asChildElement !== null;
  const isNativeAsChildButton = asChildElement?.type === 'button';
  const isCustomAsChildButton = Boolean(asChildElement && typeof asChildElement.type !== 'string');
  const isAsChildAnchor = Boolean(
    asChildElement?.type === 'a' &&
    asChildElement.props.href !== undefined &&
    asChildElement.props.href !== null,
  );
  const needsButtonSemantics = Boolean(
    canUseAsChild && [isAsChildAnchor, shouldEmulateButtonHost(asChildElement)].some(Boolean),
  );
  const Component = canUseAsChild ? Slot : 'button';
  const fallbackChildren =
    asChild && !canUseAsChild ? getFallbackChildrenForNativeButton(children) : children;
  const fallbackAccessibleNameProps =
    asChild && !canUseAsChild ? getFallbackAccessibleNamePropsForNativeButton(children) : {};
  const hasWrapperAccessibleName = [rest['aria-label'], rest['aria-labelledby']].some(
    (value) => typeof value === 'string' && value.trim() !== '',
  );
  const shouldGuardActivation = canUseAsChild && disabled;
  const keyboardActivation = useButtonKeyboardActivation<HTMLElement>({
    enabled: needsButtonSemantics && !disabled,
    onBlur: (event) => onBlur?.(event as unknown as FocusEvent<HTMLButtonElement>),
    onKeyDown: (event) => onKeyDown?.(event as unknown as KeyboardEvent<HTMLButtonElement>),
    onKeyUp: (event) => onKeyUp?.(event as unknown as KeyboardEvent<HTMLButtonElement>),
  });
  const guardedChildren = guardDisabledActivationHandlers(fallbackChildren, shouldGuardActivation);
  const handleAuxClick: MouseEventHandler<HTMLElement> = (event) => {
    onAuxClick?.(event as never);
    if (event.currentTarget.tagName === 'A' && !event.defaultPrevented) event.preventDefault();
  };
  const activationHandlers = createDisabledActivationHandlers(shouldGuardActivation, {
    onAuxClick: handleAuxClick,
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
  const { onClick: handleActivationClick, ...nonClickActivationHandlers } = activationHandlers;
  const { onKeyDown: activationKeyDown, ...nonKeyActivationHandlers } = nonClickActivationHandlers;
  const hostProps = canUseAsChild ? omitNativeButtonOnlyProps(rest) : rest;
  const referenceProps = context.getReferenceProps({
    ...(hostProps as HTMLProps<HTMLElement>),
    ...nonKeyActivationHandlers,
  });
  const {
    onClick: referenceClick,
    onKeyDown: floatingKeyDown,
    onAuxClick: referenceAuxClick,
    ...nonActivationReferenceProps
  } = referenceProps;
  const ariaHasPopup = ['dialog', 'grid', 'listbox', 'menu', 'tree'].includes(context.popupRole)
    ? (context.popupRole as 'dialog' | 'grid' | 'listbox' | 'menu' | 'tree')
    : undefined;
  const ownedStateProps = {
    'aria-expanded': context.open,
    'aria-haspopup': ariaHasPopup,
    'aria-controls': context.open ? context.contentId : undefined,
  } as const;
  const handleReferenceClick: MouseEventHandler<HTMLElement> = (event) => {
    handleActivationClick(event);
    if (event.defaultPrevented) return;
    if (typeof referenceClick === 'function') referenceClick(event);
    if (event.currentTarget.tagName === 'A' && !event.defaultPrevented) event.preventDefault();
  };
  const handleReferenceAuxClick: MouseEventHandler<HTMLElement> = (event) => {
    if (typeof referenceAuxClick === 'function') referenceAuxClick(event);
    if (event.currentTarget.tagName === 'A' && !event.defaultPrevented) event.preventDefault();
  };
  const renderedChildren =
    canUseAsChild && isValidElement<Record<string, unknown>>(guardedChildren)
      ? cloneElement(guardedChildren, {
          ...ownedStateProps,
          'aria-disabled': disabled ? true : undefined,
          'data-state': context.open ? 'open' : 'closed',
          ...(isNativeAsChildButton || isCustomAsChildButton
            ? { disabled: disabled ? true : undefined }
            : {}),
          tabIndex: 0,
          ...(isAsChildAnchor ? { href: undefined } : {}),
          ...(isNativeAsChildButton || isCustomAsChildButton ? { type: 'button' } : {}),
          ...(needsButtonSemantics ? { role: 'button' } : {}),
        })
      : guardedChildren;

  if (!ownership.isOwner) return null;

  return (
    <Component
      ref={mergedRef}
      type={canUseAsChild ? undefined : 'button'}
      data-state={context.open ? 'open' : 'closed'}
      {...nonActivationReferenceProps}
      {...(!hasWrapperAccessibleName ? fallbackAccessibleNameProps : {})}
      {...ownedStateProps}
      disabled={canUseAsChild ? undefined : disabled}
      aria-disabled={disabled ? true : undefined}
      onClick={handleReferenceClick}
      onAuxClick={handleReferenceAuxClick}
      onBlur={keyboardActivation.onBlur}
      onKeyDown={(event) =>
        handleCancellableEscapeKeyDown(event, {
          onKeyDown: activationKeyDown as KeyboardEventHandler<HTMLElement>,
          onFloatingKeyDown: floatingKeyDown as KeyboardEventHandler<HTMLElement>,
        })
      }
    >
      {renderedChildren}
    </Component>
  );
});

PopoverTriggerImpl.displayName = 'PopoverTrigger';

/**
 * Toggles and anchors a click-triggered Popover.
 *
 * It owns `aria-expanded`, `aria-haspopup`, and `aria-controls` while content
 * is mounted. Delegated anchors lose navigation and gain button behavior;
 * other supported passive hosts gain keyboard activation. Only the first
 * trigger/anchor in a root owns the reference, and disabled triggers block
 * activation while retaining their semantics.
 */

export const PopoverTrigger = PopoverTriggerImpl as unknown as OverlayTriggerComponent;
