'use client';

import { useEffect, useRef } from 'react';

/**
 * Shared window event listener hook with stale-closure protection and cleanup.
 *
 * ### Notes
 * The latest listener is stored in a ref, so callers do not need to memoize the
 * callback only to avoid stale closures. Set `shouldAttach` to `false` when a
 * component is disabled, hidden, or waiting for a prerequisite; the hook removes
 * the listener automatically during cleanup.
 */
export const useEventListener = <K extends keyof WindowEventMap>(
  type: K,
  listener: (ev: WindowEventMap[K]) => void,
  options?: boolean | AddEventListenerOptions,
  shouldAttach = true,
) => {
  const savedListener = useRef(listener);

  useEffect(() => {
    savedListener.current = listener;
  }, [listener]);

  useEffect(() => {
    if (!shouldAttach) return;

    const eventListener = (event: WindowEventMap[K]) => savedListener.current(event);
    window.addEventListener(type, eventListener, options);

    return () => {
      window.removeEventListener(type, eventListener, options);
    };
  }, [type, options, shouldAttach]);
};
