'use client';

import { useLayoutEffect, useState } from 'react';
import type { ScrollPosition } from './useScrollPosition.types';

/**
 * Shared window scroll position hook.
 *
 * ### Notes
 * Returns `{ x: 0, y: 0 }` before the first client layout effect, then tracks
 * `window.scrollX` and `window.scrollY` on scroll. Use for behavior tied to the
 * document viewport; element scroll containers should expose their own refs and
 * measurements instead.
 */
export const useScrollPosition = (): ScrollPosition => {
  const [position, setPosition] = useState<ScrollPosition>({
    x: 0,
    y: 0,
  });

  useLayoutEffect(() => {
    const updatePosition = () => {
      setPosition({ x: window.scrollX, y: window.scrollY });
    };

    window.addEventListener('scroll', updatePosition);
    updatePosition();

    return () => window.removeEventListener('scroll', updatePosition);
  }, []);

  return position;
};
