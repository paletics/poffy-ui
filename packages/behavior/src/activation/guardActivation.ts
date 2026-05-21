import {
  cloneElement,
  isValidElement,
  type KeyboardEventHandler,
  type MouseEventHandler,
  type ReactNode,
} from 'react';

interface ActivationGuardProps {
  onClick?: MouseEventHandler<HTMLElement>;
  onClickCapture?: MouseEventHandler<HTMLElement>;
  onKeyDown?: KeyboardEventHandler<HTMLElement>;
  onKeyDownCapture?: KeyboardEventHandler<HTMLElement>;
}

export interface ActivationGuardHandlers {
  onClick: MouseEventHandler<HTMLElement>;
  onClickCapture: MouseEventHandler<HTMLElement>;
  onKeyDown: KeyboardEventHandler<HTMLElement>;
  onKeyDownCapture: KeyboardEventHandler<HTMLElement>;
}

/**
 * Replaces activation handlers on a polymorphic child while a trigger is disabled.
 *
 * Radix Slot intentionally composes child handlers before slot handlers. For disabled
 * `asChild` buttons, that means a child anchor's capture handler can run before the
 * button-level guard. This helper guards the child before it enters `Slottable`, so
 * capture and bubble activation handlers are suppressed consistently.
 */
export const guardActivationHandlers = (
  children: ReactNode,
  shouldGuard: boolean,
  handlers: ActivationGuardHandlers,
): ReactNode => {
  if (!shouldGuard || !isValidElement<ActivationGuardProps>(children)) {
    return children;
  }

  return cloneElement(children, handlers);
};
