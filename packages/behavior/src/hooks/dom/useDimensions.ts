'use client';

import { useLayoutEffect, useState, type RefObject } from 'react';
import type { Dimensions } from './useDimensions.types';

/**
 * Shared DOM measurement hook that re-measures when the ref target changes.
 *
 * ### Notes
 * Returns `{ width: 0, height: 0 }` until a target element is mounted. The hook
 * uses `ResizeObserver` and measures `offsetWidth`/`offsetHeight`, so React
 * components should call it only in client-rendered surfaces and avoid using it
 * for server-rendered layout decisions.
 */
export const useDimensions = <T extends HTMLElement>(ref: RefObject<T | null>) => {
  const [node, setNode] = useState<T | null>(null);
  const [dimensions, setDimensions] = useState<Dimensions>({ width: 0, height: 0 });

  // eslint-disable-next-line react-hooks/exhaustive-deps -- ref identity is stable; this hook must detect ref.current changes after every render.
  useLayoutEffect(() => {
    const currentNode = ref.current;
    setNode((previousNode) => (previousNode === currentNode ? previousNode : currentNode));
  });

  useLayoutEffect(() => {
    if (!node) return;

    const updateDimensions = () => {
      setDimensions({
        width: node.offsetWidth,
        height: node.offsetHeight,
      });
    };
    const resizeObserver = new ResizeObserver(updateDimensions);

    resizeObserver.observe(node);
    updateDimensions();

    return () => {
      resizeObserver.disconnect();
    };
  }, [node]);

  return dimensions;
};
