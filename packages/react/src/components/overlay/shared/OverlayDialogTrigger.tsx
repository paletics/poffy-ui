'use client';

import {
  getFallbackAccessibleNamePropsForNativeButton,
  getFallbackChildrenForNativeButton,
  isButtonTriggerAsChildHost,
  shouldEmulateButtonHost,
} from '@/components/shared/asChild';
import { omitNativeButtonOnlyProps } from '@/components/shared/buttonDelegation';
import type { PrimitiveProps } from '@poffy-ui/types';
import {
  createDisabledActivationHandlers,
  guardDisabledActivationHandlers,
  useButtonKeyboardActivation,
} from '@poffy-ui/behavior/activation';
import { useMergeRefs } from '@floating-ui/react';
import { Slot } from '@radix-ui/react-slot';
import {
  cloneElement,
  forwardRef,
  isValidElement,
  type FocusEvent,
  type HTMLProps,
  type KeyboardEvent,
  type MouseEventHandler,
  useCallback,
  useLayoutEffect,
  useRef,
} from 'react';
import { useOverlayPartOwner } from './useOverlayPartOwnership';

interface OverlayDialogTriggerContext {
  open: boolean;
  context: { floatingId?: string };
  refs: { setReference: (node: HTMLElement | null) => void };
  getReferenceProps: (userProps?: HTMLProps<HTMLElement>) => Record<string, unknown>;
  activeReferenceOwnerId?: string;
  activeContentOwnerId?: string;
  registerReferenceOwner: (id: string) => () => void;
  registerContentOwner: (id: string) => () => void;
}

interface OverlayDialogTriggerProps extends Omit<
  PrimitiveProps<'button'>,
  | 'aria-controls'
  | 'aria-disabled'
  | 'aria-expanded'
  | 'aria-haspopup'
  | 'role'
  | 'tabIndex'
  | 'type'
> {
  context: OverlayDialogTriggerContext;
}

/**
 * Internal dialog trigger adapter shared by Modal and Drawer.
 * It keeps Floating UI reference registration and disabled asChild activation guards aligned.
 */
export const OverlayDialogTrigger = forwardRef<HTMLElement, OverlayDialogTriggerProps>(
  (rawProps, ref) => {
    const {
      asChild = false,
      children,
      context,
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
    } = rawProps as OverlayDialogTriggerProps & {
      'aria-controls'?: unknown;
      'aria-disabled'?: unknown;
      'aria-expanded'?: unknown;
      'aria-haspopup'?: unknown;
      role?: unknown;
      tabIndex?: unknown;
      type?: unknown;
    };
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
    const canUseAsChild = Boolean(asChildElement);
    const isNativeAsChildButton = asChildElement?.type === 'button';
    const isCustomAsChildButton = Boolean(
      asChildElement && typeof asChildElement.type !== 'string',
    );
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
    const { onClick: handleActivationClick, ...nonClickActivationHandlers } = activationHandlers;
    const hostProps = canUseAsChild ? omitNativeButtonOnlyProps(props) : props;
    const referenceProps = context.getReferenceProps({
      ...hostProps,
      ...nonClickActivationHandlers,
    });
    const {
      onAuxClick: referenceAuxClick,
      onClick: referenceClick,
      ...nonClickReferenceProps
    } = referenceProps;
    const ownedStateProps = {
      'aria-expanded': context.open,
      'aria-haspopup': 'dialog',
      'aria-controls': context.open ? context.context.floatingId : undefined,
    } as const;
    const handleReferenceClick: MouseEventHandler<HTMLElement> = (event) => {
      handleActivationClick(event);
      if (event.defaultPrevented) return;
      if (typeof referenceClick === 'function') referenceClick(event);
      if (isAsChildAnchor && !event.defaultPrevented) event.preventDefault();
    };
    const handleReferenceAuxClick: MouseEventHandler<HTMLElement> = (event) => {
      if (typeof referenceAuxClick === 'function') referenceAuxClick(event);
      if (event.currentTarget.tagName === 'A' && !event.defaultPrevented) event.preventDefault();
    };
    const renderedChildren =
      canUseAsChild && isValidElement<Record<string, unknown>>(guardedChildren)
        ? cloneElement(guardedChildren, {
            ...ownedStateProps,
            'data-state': context.open ? 'open' : 'closed',
            'aria-disabled': disabled ? true : undefined,
            tabIndex: 0,
            ...(isAsChildAnchor ? { href: undefined } : {}),
            ...(isNativeAsChildButton || isCustomAsChildButton
              ? { disabled: disabled ? true : undefined, type: 'button' }
              : {}),
            ...(needsButtonSemantics ? { role: 'button', tabIndex: 0 } : {}),
          })
        : guardedChildren;

    if (!ownership.isOwner) return null;

    return (
      <Component
        ref={mergedRef}
        {...nonClickReferenceProps}
        {...(!hasWrapperAccessibleName ? fallbackAccessibleNameProps : {})}
        type={canUseAsChild ? undefined : 'button'}
        {...ownedStateProps}
        disabled={canUseAsChild ? undefined : disabled}
        aria-disabled={disabled ? true : undefined}
        data-state={context.open ? 'open' : 'closed'}
        onAuxClick={handleReferenceAuxClick}
        onClick={handleReferenceClick}
        onBlur={keyboardActivation.onBlur}
      >
        {renderedChildren}
      </Component>
    );
  },
);

OverlayDialogTrigger.displayName = 'OverlayDialogTrigger';
