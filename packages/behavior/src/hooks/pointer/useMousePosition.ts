'use client';

import { useLayoutEffect, useState } from 'react';
import type { MousePosition } from './useMousePosition.types';
import { resolveTargetWindow } from '../resolveTargetWindow';

const emptyMousePosition: MousePosition = { x: 0, y: 0 };

interface MousePositionState {
  ownerWindow: Window | null;
  position: MousePosition;
}

/**
 * Shared pointer tracking hook based on `mousemove`.
 *
 * Returns viewport/client coordinates and starts at `{ x: 0, y: 0 }` until the
 * first mouse move. Touch, pen, drag, and pointer-capture semantics are outside
 * this hook; interactive components should use pointer events when those input
 * modes matter.
 * Pass `element.ownerDocument.defaultView ?? null` to track an iframe viewport;
 * `undefined` retains the global window default.
 */
export const useMousePosition = (targetWindow?: Window | null): MousePosition => {
  const ownerWindow = resolveTargetWindow(targetWindow);
  const [state, setState] = useState<MousePositionState>({
    ownerWindow: null,
    position: emptyMousePosition,
  });

  useLayoutEffect(() => {
    if (!ownerWindow) return;
    const updatePosition = (event: MouseEvent) => {
      setState({
        ownerWindow,
        position: { x: event.clientX, y: event.clientY },
      });
    };

    ownerWindow.addEventListener('mousemove', updatePosition);

    return () => ownerWindow.removeEventListener('mousemove', updatePosition);
  }, [ownerWindow]);

  return state.ownerWindow === ownerWindow ? state.position : emptyMousePosition;
};
