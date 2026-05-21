'use client';

import { useLayoutEffect, useState } from 'react';
import type { MousePosition } from './useMousePosition.types';

/**
 * Shared pointer tracking hook based on `mousemove`.
 *
 * ### Notes
 * Returns viewport/client coordinates and starts at `{ x: 0, y: 0 }` until the
 * first mouse move. Touch, pen, drag, and pointer-capture semantics are outside
 * this hook; interactive components should use pointer events when those input
 * modes matter.
 */
export const useMousePosition = (): MousePosition => {
  const [position, setPosition] = useState<MousePosition>({
    x: 0,
    y: 0,
  });

  useLayoutEffect(() => {
    const updatePosition = (event: MouseEvent) => {
      setPosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener('mousemove', updatePosition);

    return () => window.removeEventListener('mousemove', updatePosition);
  }, []);

  return position;
};
