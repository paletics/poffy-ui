'use client';

import { useCallback, useEffect, useRef } from 'react';
import type { FocusEventHandler, KeyboardEvent, KeyboardEventHandler } from 'react';

/**
 * Options for adding APG button keyboard behavior to a non-native interactive host.
 * `enabled` controls synthesized activation; the consumer handlers always run first.
 */
export interface UseButtonKeyboardActivationOptions<T extends HTMLElement> {
  /** Enables synthesized Enter/Space activation for a non-`button` host. */
  enabled: boolean;
  /** Called after a pending Space activation has been cleared on blur. */
  onBlur?: FocusEventHandler<T>;
  /** Called before this hook evaluates Enter or Space activation. */
  onKeyDown?: KeyboardEventHandler<T>;
  /** Called before this hook evaluates a pending Space activation. */
  onKeyUp?: KeyboardEventHandler<T>;
}

/** Handlers to spread onto the same host passed through the keyboard activation lifecycle. */
export interface ButtonKeyboardActivationHandlers<T extends HTMLElement> {
  onBlur: FocusEventHandler<T>;
  onKeyDown: KeyboardEventHandler<T>;
  onKeyUp: KeyboardEventHandler<T>;
}

const isSpaceKey = (event: Pick<KeyboardEvent<HTMLElement>, 'code' | 'key'>) => {
  if (event.key === ' ') return true;
  return event.code === 'Space';
};

/**
 * Adds APG button keyboard activation to a non-native interactive host.
 *
 * Supplied keyboard handlers run first and can cancel the synthesized click with
 * `preventDefault()`. Enter clicks on keydown; Space is prevented on keydown and clicks only on
 * the matching keyup. Native buttons and disabled hosts receive the supplied handlers without
 * synthesized activation, and a pending Space press is cleared on blur, disable, and unmount.
 */
export const useButtonKeyboardActivation = <T extends HTMLElement>({
  enabled,
  onBlur,
  onKeyDown,
  onKeyUp,
}: UseButtonKeyboardActivationOptions<T>): ButtonKeyboardActivationHandlers<T> => {
  const armedSpaceTargetRef = useRef<EventTarget | null>(null);

  const clearSpaceArm = useCallback(() => {
    armedSpaceTargetRef.current = null;
  }, []);

  useEffect(() => {
    if (!enabled) clearSpaceArm();
    return clearSpaceArm;
  }, [clearSpaceArm, enabled]);

  const handleKeyDown = useCallback<KeyboardEventHandler<T>>(
    (event) => {
      onKeyDown?.(event);
      if (!enabled || event.currentTarget.tagName === 'BUTTON') return;

      if (event.key === 'Enter') {
        if (event.repeat || event.defaultPrevented) return;
        event.preventDefault();
        event.currentTarget.click();
        return;
      }

      if (!isSpaceKey(event)) return;
      if (event.repeat) {
        if (armedSpaceTargetRef.current === event.currentTarget && !event.defaultPrevented) {
          event.preventDefault();
        }
        return;
      }
      if (event.defaultPrevented) {
        clearSpaceArm();
        return;
      }

      armedSpaceTargetRef.current = event.currentTarget;
      event.preventDefault();
    },
    [clearSpaceArm, enabled, onKeyDown],
  );

  const handleKeyUp = useCallback<KeyboardEventHandler<T>>(
    (event) => {
      onKeyUp?.(event);
      if (!isSpaceKey(event)) return;

      const armedTarget = armedSpaceTargetRef.current;
      clearSpaceArm();
      if (
        event.repeat ||
        !enabled ||
        event.currentTarget.tagName === 'BUTTON' ||
        armedTarget !== event.currentTarget ||
        event.defaultPrevented
      ) {
        return;
      }

      event.preventDefault();
      event.currentTarget.click();
    },
    [clearSpaceArm, enabled, onKeyUp],
  );

  const handleBlur = useCallback<FocusEventHandler<T>>(
    (event) => {
      clearSpaceArm();
      onBlur?.(event);
    },
    [clearSpaceArm, onBlur],
  );

  return { onBlur: handleBlur, onKeyDown: handleKeyDown, onKeyUp: handleKeyUp };
};
