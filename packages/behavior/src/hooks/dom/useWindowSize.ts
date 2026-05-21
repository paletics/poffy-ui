'use client';

import { useLayoutEffect, useState } from 'react';
import type { WindowSize } from './useWindowSize.types';

/**
 * Shared viewport measurement hook for responsive behavior.
 *
 * ### Notes
 * Returns `{ width: 0, height: 0 }` before the first client layout effect, then
 * tracks `window.innerWidth` and `window.innerHeight` on resize. Components
 * should prefer CSS/container queries for styling and use this hook for
 * behavior decisions that genuinely require JavaScript viewport dimensions.
 */
export const useWindowSize = (): WindowSize => {
  const [size, setSize] = useState<WindowSize>({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const updateSize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener('resize', updateSize);
    updateSize();

    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return size;
};
