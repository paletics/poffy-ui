import {
  cloneElement,
  isValidElement,
  type KeyboardEventHandler,
  type MouseEventHandler,
  type ReactNode,
} from 'react';
import {
  createDisabledActivationHandlers,
  type ActivationHandlers,
} from './createDisabledActivationHandlers';

/**
 * Required activation handlers used to replace a valid delegated child while it is guarded.
 *
 * Click and key-down channels are required because they are the channels Radix may otherwise
 * compose before an outer disabled `asChild` button can suppress them.
 */
export interface ActivationGuardHandlers extends ActivationHandlers {
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
  if (!shouldGuard || !isValidElement<ActivationHandlers>(children)) {
    return children;
  }

  return cloneElement(children, handlers);
};

/**
 * Replaces a valid polymorphic child's activation handlers with the disabled-event guard.
 *
 * The original child is returned unchanged unless guarding is enabled. The replacement blocks
 * mouse, pointer, Enter, and Space activation before Radix Slot can compose the child's handlers.
 */
export const guardDisabledActivationHandlers = (
  children: ReactNode,
  shouldGuard: boolean,
): ReactNode => {
  if (!shouldGuard || !isValidElement<ActivationHandlers>(children)) return children;
  return guardActivationHandlers(
    children,
    true,
    createDisabledActivationHandlers(true, children.props),
  );
};
