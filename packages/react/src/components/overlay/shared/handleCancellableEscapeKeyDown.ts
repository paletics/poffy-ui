import type { KeyboardEvent, KeyboardEventHandler } from 'react';

interface CancellableEscapeKeyDownOptions<T extends HTMLElement> {
  onKeyDown?: KeyboardEventHandler<T>;
  onFloatingKeyDown?: KeyboardEventHandler<T>;
  onDismiss?: () => void;
}

/**
 * Runs consumer key handlers before dismissing an overlay with Escape.
 *
 * Escape is stopped only when it requests dismissal, so a nested overlay
 * closes without also dismissing its parent. Either consumer handler can
 * cancel the request with preventDefault().
 */
export const handleCancellableEscapeKeyDown = <T extends HTMLElement>(
  event: KeyboardEvent<T>,
  { onKeyDown, onFloatingKeyDown, onDismiss }: CancellableEscapeKeyDownOptions<T>,
) => {
  onKeyDown?.(event);
  if (event.key !== 'Escape') return;
  if (event.defaultPrevented) {
    event.stopPropagation();
    return;
  }

  onFloatingKeyDown?.(event);
  if (event.defaultPrevented) {
    event.stopPropagation();
    return;
  }

  if (onFloatingKeyDown) return;

  event.stopPropagation();
  onDismiss?.();
};
