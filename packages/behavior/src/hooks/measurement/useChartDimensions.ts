'use client';

import { useEffect, useLayoutEffect, useState, type RefObject } from 'react';
import type { ChartDimensions, ChartMargin } from './useChartDimensions.types';

/**
 * Default chart margin used when no margin override is provided.
 *
 * ### AI Usage
 * - Use as the baseline for chart layouts that need room for axes and labels.
 */
export const DEFAULT_CHART_MARGIN: ChartMargin = {
  top: 20,
  right: 30,
  bottom: 40,
  left: 50,
};

/**
 * Shared ResizeObserver-based chart measurement hook.
 *
 * ### Notes
 * Returns zero dimensions before the container is mounted. `innerWidth` and
 * `innerHeight` are clamped to `0` after subtracting margins. Chart components
 * should use the returned inner size for scales and keep SVG accessibility,
 * labels, and legends in the React layer.
 */
export const useChartDimensions = (
  containerRef: RefObject<HTMLDivElement | null>,
  margin: ChartMargin = DEFAULT_CHART_MARGIN,
): ChartDimensions => {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [dimensions, setDimensions] = useState<ChartDimensions>({
    width: 0,
    height: 0,
    innerWidth: 0,
    innerHeight: 0,
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps -- ref identity is stable; this hook must detect containerRef.current changes after every render.
  useLayoutEffect(() => {
    const currentContainer = containerRef.current;
    setContainer((previousContainer) =>
      previousContainer === currentContainer ? previousContainer : currentContainer,
    );
  });

  useEffect(() => {
    if (!container) return;

    const updateDimensions = () => {
      const { width, height } = container.getBoundingClientRect();
      setDimensions({
        width,
        height,
        innerWidth: Math.max(0, width - margin.left - margin.right),
        innerHeight: Math.max(0, height - margin.top - margin.bottom),
      });
    };

    const resizeObserver = new ResizeObserver(updateDimensions);

    resizeObserver.observe(container);
    updateDimensions();

    return () => {
      resizeObserver.disconnect();
    };
  }, [container, margin.top, margin.right, margin.bottom, margin.left]);

  return dimensions;
};
