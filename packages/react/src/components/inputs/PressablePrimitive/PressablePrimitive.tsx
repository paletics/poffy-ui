'use client';

import { ButtonPrimitive } from '@/components/inputs/ButtonPrimitive';
import { shouldProvideButtonPrimitiveSemantics } from '@/components/inputs/ButtonPrimitive/ButtonPrimitive.utils';
import { createElement, forwardRef } from 'react';
import type {
  ElementType,
  KeyboardEvent,
  KeyboardEventHandler,
  MouseEvent,
  MouseEventHandler,
} from 'react';
import type {
  PressablePrimitiveComponent,
  PressablePrimitiveProps,
} from './PressablePrimitive.types';

/**
 * A behavior-focused adapter over ButtonPrimitive that adds press callbacks.
 */
const PressablePrimitiveImpl = forwardRef<HTMLElement, PressablePrimitiveProps>(
  ({ asChild, children, onClick, onKeyDown, onPress, onPressKeyDown, ...props }, ref) => {
    const emulatesButtonHost = Boolean(asChild && shouldProvideButtonPrimitiveSemantics(children));

    const handleClick = (event: MouseEvent<HTMLElement>) => {
      (onClick as MouseEventHandler<HTMLElement> | undefined)?.(event);
      if (event.defaultPrevented) return;

      (onPress as MouseEventHandler<HTMLElement> | undefined)?.(event);
      if (emulatesButtonHost) event.preventDefault();
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
      (onPressKeyDown as KeyboardEventHandler<HTMLElement> | undefined)?.(event);
      (onKeyDown as KeyboardEventHandler<HTMLElement> | undefined)?.(event);
    };

    return createElement(
      ButtonPrimitive as unknown as ElementType,
      {
        ref,
        asChild,
        onClick: handleClick,
        onKeyDown: handleKeyDown,
        ...props,
      },
      children,
    );
  },
);

PressablePrimitiveImpl.displayName = 'PressablePrimitive';

/**
 * Adds press callbacks to unstyled button behavior.
 *
 * `onClick` runs before `onPress` and can prevent it with `event.preventDefault()`.
 * `onPressKeyDown` runs before `onKeyDown`; passive `asChild` hosts retain the button keyboard
 * behavior supplied by `ButtonPrimitive`.
 */

export const PressablePrimitive = PressablePrimitiveImpl as PressablePrimitiveComponent;
