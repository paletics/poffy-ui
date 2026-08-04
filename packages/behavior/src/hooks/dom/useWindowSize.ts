'use client';

import { useLayoutEffect, useState } from 'react';
import type { WindowSize } from './useWindowSize.types';
import { resolveTargetWindow } from '../resolveTargetWindow';

const emptyWindowSize: WindowSize = { width: 0, height: 0 };

interface WindowSizeState {
  ownerWindow: Window | null;
  size: WindowSize;
}

/**
 * Shared viewport measurement hook for responsive behavior.
 *
 * Returns `{ width: 0, height: 0 }` before the first client layout effect, then
 * tracks `window.innerWidth` and `window.innerHeight` on resize. Components
 * should prefer CSS/container queries for styling and use this hook for
 * behavior decisions that genuinely require JavaScript viewport dimensions.
 * Pass `element.ownerDocument.defaultView ?? null` when the viewport belongs
 * to an iframe; `undefined` retains the global window default.
 */
export const useWindowSize = (targetWindow?: Window | null): WindowSize => {
  const ownerWindow = resolveTargetWindow(targetWindow);
  const [state, setState] = useState<WindowSizeState>({
    ownerWindow: null,
    size: emptyWindowSize,
  });

  useLayoutEffect(() => {
    if (!ownerWindow) return;
    const updateSize = () => {
      setState({
        ownerWindow,
        size: { width: ownerWindow.innerWidth, height: ownerWindow.innerHeight },
      });
    };

    ownerWindow.addEventListener('resize', updateSize);
    updateSize();

    return () => ownerWindow.removeEventListener('resize', updateSize);
  }, [ownerWindow]);

  return state.ownerWindow === ownerWindow ? state.size : emptyWindowSize;
};
