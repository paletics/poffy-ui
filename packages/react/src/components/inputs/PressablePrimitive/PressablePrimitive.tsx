'use client';

import { Slot } from '@radix-ui/react-slot';
import { forwardRef } from 'react';
import type { KeyboardEvent, MouseEvent } from 'react';
import type { PressablePrimitiveProps } from './PressablePrimitive.types';

const isNativeKeyboardClickable = (element: EventTarget | null) => {
  if (!(element instanceof HTMLElement)) return false;

  if (element.tagName === 'BUTTON') return true;
  if (element.tagName === 'A' && element.hasAttribute('href')) return true;

  return false;
};

/**
 * Shared pressable primitive for interaction controls.
 * Adds normalized disabled/keyboard behavior when using `asChild`.
 *
 * ### AI Context & Architecture
 * - **Tier**: Atoms
 * - **Stack**: native `<button>` or Radix Slot via `asChild`
 * - **Props**: `PrimitiveProps<'button', PressablePrimitiveBaseProps>`
 *
 * ### Design Tokens
 * - No visual tokens are applied; consumers own all styling.
 *
 * ### Accessibility
 * - **Role**: button semantics from the rendered element.
 * - **Keyboard**: Enter / Space activate non-native slotted controls through `onPress`.
 * - **Required**: Use a native button or link child when possible.
 *
 * ### AI Usage
 * - **DO**: Use as the behavior base for custom pressable controls.
 * - **DON'T**: Use for toggle state by itself; compose explicit ARIA state in the consumer.
 *
 * @example Press handler
 * ```tsx
 * import { PressablePrimitive } from '@poffy-ui/react/inputs';
 *
 * <PressablePrimitive onPress={handlePress}>Open</PressablePrimitive>
 * ```
 */
export const PressablePrimitive = forwardRef<HTMLButtonElement, PressablePrimitiveProps>(
  (props, ref) => {
    const {
      asChild,
      disabled = false,
      type = 'button',
      onClick,
      onKeyDown,
      onPress,
      onPressKeyDown,
      ...rest
    } = props;
    const Component = asChild ? Slot : 'button';

    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
      if (disabled) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      onPress?.(e);
      onClick?.(e);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
      if (disabled) {
        e.preventDefault();
        return;
      }
      if (
        asChild &&
        (e.key === 'Enter' || e.key === ' ') &&
        !e.repeat &&
        !isNativeKeyboardClickable(e.currentTarget)
      ) {
        e.preventDefault();
        onPress?.(e as unknown as MouseEvent<HTMLButtonElement>);
      }
      onPressKeyDown?.(e);
      onKeyDown?.(e);
    };

    return (
      <Component
        ref={ref}
        type={asChild ? undefined : type}
        disabled={asChild ? undefined : disabled}
        aria-disabled={disabled ? true : undefined}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        {...rest}
      />
    );
  },
);

PressablePrimitive.displayName = 'PressablePrimitive';
