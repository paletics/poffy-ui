'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';
import { resolveTargetWindow } from '../resolveTargetWindow';

const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/**
 * Shared window event listener hook with stale-closure protection and cleanup.
 *
 * The latest listener is stored in a ref, so callers do not need to memoize the
 * callback only to avoid stale closures. Set `shouldAttach` to `false` when a
 * component is disabled, hidden, or waiting for a prerequisite; the hook removes
 * the listener automatically during cleanup.
 *
 * Pass `element.ownerDocument.defaultView ?? null` to `targetWindow` for an
 * element that may mount in another document. `undefined` retains the global
 * window default, while `null` intentionally keeps the listener detached.
 */
export const useEventListener = <K extends keyof WindowEventMap>(
  type: K,
  listener: (ev: WindowEventMap[K]) => void,
  options?: boolean | AddEventListenerOptions,
  shouldAttach = true,
  targetWindow?: Window | null,
) => {
  const savedListener = useRef(listener);
  const ownerWindow = resolveTargetWindow(targetWindow);

  useIsomorphicLayoutEffect(() => {
    savedListener.current = listener;
  }, [listener]);

  useEffect(() => {
    if (!shouldAttach || !ownerWindow) return;

    const eventListener = (event: WindowEventMap[K]) => savedListener.current(event);
    ownerWindow.addEventListener(type, eventListener, options);

    return () => {
      ownerWindow.removeEventListener(type, eventListener, options);
    };
  }, [type, options, shouldAttach, ownerWindow]);
};
