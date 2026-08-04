'use client';

import { useEffect, useState } from 'react';
import type { ScrollProgress, UseScrollProgressOptions } from './useScrollProgress.types';

const initialProgress: ScrollProgress = { position: 0, maxPosition: 0, progress: 0 };

interface ObservedMetrics {
  axis: NonNullable<UseScrollProgressOptions['axis']>;
  container: Element;
  metrics: ScrollProgress;
}

const getMetrics = (
  element: Element,
  axis: NonNullable<UseScrollProgressOptions['axis']>,
): ScrollProgress => {
  const rawPosition = axis === 'x' ? element.scrollLeft : element.scrollTop;
  const position = axis === 'x' && rawPosition < 0 ? -rawPosition : rawPosition;
  const maxPosition = Math.max(
    0,
    axis === 'x'
      ? element.scrollWidth - element.clientWidth
      : element.scrollHeight - element.clientHeight,
  );
  const progress = maxPosition === 0 ? 0 : Math.min(1, Math.max(0, position / maxPosition));

  return { position, maxPosition, progress };
};

/**
 * Observes normalized scroll progress for the document or a scroll container.
 *
 * The hook batches scroll updates into one animation frame and recalculates when
 * the viewport or observed container changes size. It intentionally exposes
 * metrics only; presentation belongs in a React component or consuming tier.
 * When disabled, or when no document/container can be observed, it returns zero
 * metrics and attaches no listeners.
 */
export const useScrollProgress = ({
  container,
  targetDocument,
  axis = 'y',
  disabled = false,
}: UseScrollProgressOptions = {}): ScrollProgress => {
  const [observedMetrics, setObservedMetrics] = useState<ObservedMetrics | null>(null);
  const ownerDocument =
    container?.ownerDocument ??
    (targetDocument === undefined
      ? typeof document === 'undefined'
        ? undefined
        : document
      : (targetDocument ?? undefined));
  const ownerWindow = ownerDocument?.defaultView;
  const scrollContainer = container ?? ownerDocument?.scrollingElement;

  useEffect(() => {
    if (disabled || !scrollContainer || !ownerWindow) return;

    let frameId: number | undefined;
    const update = () =>
      setObservedMetrics({
        axis,
        container: scrollContainer,
        metrics: getMetrics(scrollContainer, axis),
      });
    const scheduleUpdate = () => {
      if (frameId !== undefined) return;
      frameId = ownerWindow.requestAnimationFrame(() => {
        frameId = undefined;
        update();
      });
    };

    const scrollTarget: EventTarget = container ? scrollContainer : ownerWindow;
    scrollTarget.addEventListener('scroll', scheduleUpdate, { passive: true });
    ownerWindow.addEventListener('resize', scheduleUpdate);
    const resizeObserver = ownerWindow.ResizeObserver
      ? new ownerWindow.ResizeObserver(scheduleUpdate)
      : undefined;
    resizeObserver?.observe(scrollContainer);
    const mutationObserver = ownerWindow.MutationObserver
      ? new ownerWindow.MutationObserver(scheduleUpdate)
      : undefined;
    mutationObserver?.observe(scrollContainer, {
      childList: true,
      characterData: true,
      subtree: true,
    });

    return () => {
      scrollTarget.removeEventListener('scroll', scheduleUpdate);
      ownerWindow.removeEventListener('resize', scheduleUpdate);
      resizeObserver?.disconnect();
      mutationObserver?.disconnect();
      if (frameId !== undefined) ownerWindow.cancelAnimationFrame(frameId);
    };
  }, [axis, container, disabled, ownerWindow, scrollContainer]);

  if (disabled || !scrollContainer || !ownerWindow) return initialProgress;
  if (observedMetrics?.axis === axis && observedMetrics.container === scrollContainer) {
    return observedMetrics.metrics;
  }
  return getMetrics(scrollContainer, axis);
};
