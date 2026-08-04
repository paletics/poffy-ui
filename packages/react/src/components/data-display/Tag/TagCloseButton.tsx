'use client';

import { getFallbackChildrenForNativeButton } from '@/components/shared/asChild';
import {
  guardActivationHandlers,
  useButtonKeyboardActivation,
} from '@poffy-ui/behavior/activation';
import { Slot, Slottable } from '@radix-ui/react-slot';
import { CrossIcon } from '@/components/media/Icon/icons';
import { cx } from '@/styled-system/css';
import { cloneElement, type ElementType, forwardRef, isValidElement } from 'react';
import type { DOMAttributes, KeyboardEvent, MouseEvent, PointerEvent } from 'react';
import { useTagContext } from './TagContext';
import type { TagCloseButtonComponent, TagCloseButtonProps } from './Tag.types';
import { isTagCloseButtonAsChildHost } from './Tag.utils';
import { getCommonMessages } from '@/components/shared/common.locales';
import { useOptionalLocale } from '@/providers/LocaleProvider';

/**
 * An accessible dismiss button for a Tag.
 *
 * With `asChild`, supported native non-button hosts receive button semantics
 * and keyboard activation. Custom or invalid children fall back to a native button.
 */
type TagCloseButtonRuntimeProps = Omit<TagCloseButtonProps, keyof DOMAttributes<Element>> &
  DOMAttributes<HTMLElement>;

const TagCloseButtonImpl = forwardRef<HTMLElement, TagCloseButtonProps>((props, ref) => {
  const runtimeProps = props as TagCloseButtonRuntimeProps & { type?: unknown };
  const {
    asChild,
    className,
    isDisabled,
    disabled: nativeDisabled,
    type: _type,
    children,
    'aria-label': ariaLabel,
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
    ...rest
  } = runtimeProps;
  const { classes } = useTagContext();
  const messages = getCommonMessages(useOptionalLocale()?.locale);
  const asChildElement = asChild && isTagCloseButtonAsChildHost(children) ? children : null;
  const canUseAsChild = Boolean(asChildElement);
  const isNativeButton = asChildElement?.type === 'button';
  const needsButtonSemantics = Boolean(canUseAsChild && !isNativeButton);
  const disabled = Boolean(isDisabled || nativeDisabled);
  const Component = (canUseAsChild ? Slot : 'button') as ElementType;
  const resolvedAriaLabel = ariaLabel?.trim() || messages.close;

  const blockActivation = (event: MouseEvent<HTMLElement>) => {
    if (!disabled) return false;
    event.preventDefault();
    event.stopPropagation();
    return true;
  };

  const blockKeyboardActivation = (event: KeyboardEvent<HTMLElement>) => {
    if (!disabled || (event.key !== 'Enter' && event.key !== ' ' && event.code !== 'Space'))
      return false;
    event.preventDefault();
    event.stopPropagation();
    return true;
  };

  const blockPointerInteraction = (event: PointerEvent<HTMLElement>) => {
    if (!disabled) return false;
    event.preventDefault();
    event.stopPropagation();
    return true;
  };

  const handleClickCapture = (event: MouseEvent<HTMLElement>) => {
    if (blockActivation(event)) return;
    onClickCapture?.(event);
  };
  const handleClick = (event: MouseEvent<HTMLElement>) => {
    if (blockActivation(event)) return;
    onClick?.(event);
    if (needsButtonSemantics) event.preventDefault();
  };
  const handleAuxClickCapture = (event: MouseEvent<HTMLElement>) => {
    if (blockActivation(event)) return;
    onAuxClickCapture?.(event);
  };
  const handleAuxClick = (event: MouseEvent<HTMLElement>) => {
    if (blockActivation(event)) return;
    onAuxClick?.(event);
  };
  const handleKeyDownCapture = (event: KeyboardEvent<HTMLElement>) => {
    if (blockKeyboardActivation(event)) return;
    onKeyDownCapture?.(event);
  };
  const keyboardActivation = useButtonKeyboardActivation<HTMLElement>({
    enabled: needsButtonSemantics && !disabled,
    onBlur,
    onKeyDown,
    onKeyUp,
  });
  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (blockKeyboardActivation(event)) return;
    keyboardActivation.onKeyDown(event);
  };
  const handleKeyUpCapture = (event: KeyboardEvent<HTMLElement>) => {
    if (blockKeyboardActivation(event)) return;
    onKeyUpCapture?.(event);
  };
  const handleKeyUp = (event: KeyboardEvent<HTMLElement>) => {
    if (blockKeyboardActivation(event)) return;
    keyboardActivation.onKeyUp(event);
  };
  const handlePointerDownCapture = (event: PointerEvent<HTMLElement>) => {
    if (blockPointerInteraction(event)) return;
    onPointerDownCapture?.(event);
  };
  const handlePointerDown = (event: PointerEvent<HTMLElement>) => {
    if (blockPointerInteraction(event)) return;
    onPointerDown?.(event);
  };
  const handlePointerUpCapture = (event: PointerEvent<HTMLElement>) => {
    if (blockPointerInteraction(event)) return;
    onPointerUpCapture?.(event);
  };
  const handlePointerUp = (event: PointerEvent<HTMLElement>) => {
    if (blockPointerInteraction(event)) return;
    onPointerUp?.(event);
  };

  const guardedChildren = guardActivationHandlers(asChildElement, disabled, {
    onAuxClickCapture: handleAuxClickCapture,
    onAuxClick: handleAuxClick,
    onClickCapture: handleClickCapture,
    onClick: handleClick,
    onKeyDownCapture: handleKeyDownCapture,
    onKeyDown: handleKeyDown,
    onKeyUpCapture: handleKeyUpCapture,
    onKeyUp: handleKeyUp,
    onPointerDownCapture: handlePointerDownCapture,
    onPointerDown: handlePointerDown,
    onPointerUpCapture: handlePointerUpCapture,
    onPointerUp: handlePointerUp,
  });
  const slottableChild =
    canUseAsChild && isValidElement<Record<string, unknown>>(guardedChildren)
      ? cloneElement(guardedChildren, {
          'aria-disabled': disabled ? true : undefined,
          'aria-label': resolvedAriaLabel,
          disabled: isNativeButton ? disabled : undefined,
          ...(isNativeButton || typeof asChildElement?.type !== 'string' ? { type: 'button' } : {}),
          ...(needsButtonSemantics && asChildElement?.type === 'a' ? { href: undefined } : {}),
          ...(needsButtonSemantics ? { role: 'button', tabIndex: 0 } : {}),
        })
      : guardedChildren;
  const fallbackChildren =
    asChild && !canUseAsChild ? getFallbackChildrenForNativeButton(children) : children;

  return (
    <Component
      ref={ref}
      className={cx(classes.closeButton, className)}
      disabled={canUseAsChild ? undefined : disabled}
      {...rest}
      type={canUseAsChild ? undefined : 'button'}
      aria-disabled={disabled ? true : undefined}
      aria-label={resolvedAriaLabel}
      data-disabled={disabled ? '' : undefined}
      onAuxClickCapture={handleAuxClickCapture}
      onAuxClick={handleAuxClick}
      onClickCapture={handleClickCapture}
      onClick={handleClick}
      onKeyDownCapture={handleKeyDownCapture}
      onKeyDown={handleKeyDown}
      onKeyUpCapture={handleKeyUpCapture}
      onKeyUp={handleKeyUp}
      onBlur={keyboardActivation.onBlur}
      onPointerDownCapture={handlePointerDownCapture}
      onPointerDown={handlePointerDown}
      onPointerUpCapture={handlePointerUpCapture}
      onPointerUp={handlePointerUp}
    >
      {canUseAsChild ? (
        <Slottable>{slottableChild}</Slottable>
      ) : asChild ? (
        fallbackChildren
      ) : (
        (children ?? <CrossIcon />)
      )}
    </Component>
  );
});

TagCloseButtonImpl.displayName = 'Tag.CloseButton';

/**
 * Activates caller-owned removal or dismissal of the Tag.
 *
 * It is a labelled native button by default and supplies a close icon when
 * children are omitted. `isDisabled` blocks pointer and keyboard activation.
 * With `asChild`, a supported non-button host gains button semantics and
 * keyboard activation; invalid children fall back to a native button.
 */

export const TagCloseButton = TagCloseButtonImpl as TagCloseButtonComponent;
