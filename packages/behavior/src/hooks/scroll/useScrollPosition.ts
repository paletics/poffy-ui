'use client';

import { useLayoutEffect, useState } from 'react';
import type { ScrollPosition } from './useScrollPosition.types';
import { resolveTargetWindow } from '../resolveTargetWindow';

const emptyScrollPosition: ScrollPosition = { x: 0, y: 0 };

interface ScrollPositionState {
  ownerWindow: Window | null;
  position: ScrollPosition;
}

/**
 * Shared window scroll position hook.
 *
 * Returns `{ x: 0, y: 0 }` before the first client layout effect, then tracks
 * `window.scrollX` and `window.scrollY` on scroll. Use for behavior tied to the
 * document viewport; element scroll containers should expose their own refs and
 * measurements instead.
 * Pass `element.ownerDocument.defaultView ?? null` for an iframe viewport;
 * `undefined` retains the global window default.
 */
export const useScrollPosition = (targetWindow?: Window | null): ScrollPosition => {
  const ownerWindow = resolveTargetWindow(targetWindow);
  const [state, setState] = useState<ScrollPositionState>({
    ownerWindow: null,
    position: emptyScrollPosition,
  });

  useLayoutEffect(() => {
    if (!ownerWindow) return;
    const updatePosition = () => {
      setState({
        ownerWindow,
        position: { x: ownerWindow.scrollX, y: ownerWindow.scrollY },
      });
    };

    ownerWindow.addEventListener('scroll', updatePosition);
    updatePosition();

    return () => ownerWindow.removeEventListener('scroll', updatePosition);
  }, [ownerWindow]);

  return state.ownerWindow === ownerWindow ? state.position : emptyScrollPosition;
};
