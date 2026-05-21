'use client';

import { guardActivationHandlers } from '@poffy-ui/behavior/activation';
import { Slot, Slottable } from '@radix-ui/react-slot';
import { forwardRef } from 'react';
import type { KeyboardEvent, MouseEvent } from 'react';
import type { ButtonPrimitiveProps } from './ButtonPrimitive.types';

/**
 * Unstyled button primitive for cases where behavior/semantics should be shared
 * while layout and visual design remain fully custom.
 *
 * ### AI Context & Architecture
 * - **Tier**: Atoms
 * - **Stack**: native `<button>` or Radix Slot via `asChild`
 * - **Props**: `PrimitiveProps<'button', ButtonPrimitiveBaseProps>`
 *
 * ### Design Tokens
 * - No visual tokens are applied; consumers own all styling.
 *
 * ### Accessibility
 * - **Role**: button semantics from the rendered element.
 * - **Keyboard**: Enter / Space activate native buttons; disabled `asChild` activation is blocked.
 * - **Required**: Preserve accessible names when rendering custom children.
 *
 * @example Custom-styled primitive
 * ```tsx
 * import { ButtonPrimitive } from '@poffy-ui/react/inputs';
 *
 * <ButtonPrimitive className={styles.action}>Save</ButtonPrimitive>
 * ```
 */
export const ButtonPrimitive = forwardRef<HTMLButtonElement, ButtonPrimitiveProps>((props, ref) => {
  const {
    asChild,
    children,
    disabled = false,
    type = 'button',
    onClick,
    onClickCapture,
    onKeyDown,
    onKeyDownCapture,
    ...rest
  } = props;
  const Component = asChild ? Slot : 'button';

  const blockAsChildActivation = (event: MouseEvent<HTMLElement>) => {
    if (disabled && asChild) {
      event.preventDefault();
      event.stopPropagation();
      return true;
    }

    return false;
  };

  const blockAsChildKeyboardActivation = (event: KeyboardEvent<HTMLElement>) => {
    if (disabled && asChild && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      event.stopPropagation();
      return true;
    }

    return false;
  };

  const handleClickCapture = (event: MouseEvent<HTMLElement>) => {
    if (blockAsChildActivation(event)) return;
    onClickCapture?.(event as MouseEvent<HTMLButtonElement>);
  };

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    if (blockAsChildActivation(event)) return;
    onClick?.(event as MouseEvent<HTMLButtonElement>);
  };

  const handleKeyDownCapture = (event: KeyboardEvent<HTMLElement>) => {
    if (blockAsChildKeyboardActivation(event)) return;
    onKeyDownCapture?.(event as KeyboardEvent<HTMLButtonElement>);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (blockAsChildKeyboardActivation(event)) return;
    onKeyDown?.(event as KeyboardEvent<HTMLButtonElement>);
  };

  const guardedChildren = guardActivationHandlers(children, Boolean(asChild && disabled), {
    onClickCapture: handleClickCapture,
    onClick: handleClick,
    onKeyDownCapture: handleKeyDownCapture,
    onKeyDown: handleKeyDown,
  });

  return (
    <Component
      ref={ref}
      type={asChild ? undefined : type}
      disabled={asChild ? undefined : disabled}
      aria-disabled={disabled ? true : undefined}
      onClickCapture={handleClickCapture}
      onClick={handleClick}
      onKeyDownCapture={handleKeyDownCapture}
      onKeyDown={handleKeyDown}
      {...rest}
    >
      <Slottable>{guardedChildren}</Slottable>
    </Component>
  );
});

ButtonPrimitive.displayName = 'ButtonPrimitive';
