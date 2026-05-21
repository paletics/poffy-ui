'use client';

import { useCallback, useEffect, useId, useRef } from 'react';
import { calcScrollAreaThumb } from './scroll-area';
import type { UseScrollAreaReturn } from './useScrollArea.types';

const updateThumb = (
  viewport: HTMLDivElement | null,
  scrollbar: HTMLDivElement | null,
  thumb: HTMLDivElement | null,
  orientation: 'vertical' | 'horizontal',
) => {
  if (!viewport || !scrollbar || !thumb) return;

  const isVertical = orientation === 'vertical';
  const clientSize = isVertical ? viewport.clientHeight : viewport.clientWidth;
  const scrollSize = isVertical ? viewport.scrollHeight : viewport.scrollWidth;
  const scrollPos = isVertical ? viewport.scrollTop : viewport.scrollLeft;
  const trackSize = isVertical ? scrollbar.clientHeight : scrollbar.clientWidth;
  const resolvedTrackSize = trackSize === 0 ? clientSize : trackSize;
  const metrics = calcScrollAreaThumb(resolvedTrackSize, scrollSize, scrollPos);

  if (isVertical) {
    thumb.style.height = `${metrics.thumbSize}px`;
    thumb.style.transform = `translateY(${metrics.thumbOffset}px)`;
  } else {
    thumb.style.width = `${metrics.thumbSize}px`;
    thumb.style.transform = `translateX(${metrics.thumbOffset}px)`;
  }

  if (metrics.isOverflowing) {
    scrollbar.setAttribute('data-visible', '');
  } else {
    scrollbar.removeAttribute('data-visible');
  }
};

/**
 * Shared scroll-area refs and thumb drag behavior.
 */
export const useScrollArea = (): UseScrollAreaReturn => {
  const generatedId = useId();
  const viewportId = `scroll-area-${generatedId.replace(/:/g, '')}`;
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const vScrollbarRef = useRef<HTMLDivElement | null>(null);
  const hScrollbarRef = useRef<HTMLDivElement | null>(null);
  const vThumbRef = useRef<HTMLDivElement | null>(null);
  const hThumbRef = useRef<HTMLDivElement | null>(null);
  const activeDragCleanupRef = useRef<(() => void) | null>(null);

  const syncThumbs = useCallback(() => {
    updateThumb(viewportRef.current, vScrollbarRef.current, vThumbRef.current, 'vertical');
    updateThumb(viewportRef.current, hScrollbarRef.current, hThumbRef.current, 'horizontal');
  }, []);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    syncThumbs();
    viewport.addEventListener('scroll', syncThumbs, { passive: true });
    window.addEventListener('resize', syncThumbs);

    return () => {
      viewport.removeEventListener('scroll', syncThumbs);
      window.removeEventListener('resize', syncThumbs);
    };
  }, [syncThumbs]);

  const getThumbPointerDown = useCallback(
    (orientation: 'vertical' | 'horizontal') => (event: React.PointerEvent<HTMLDivElement>) => {
      const viewport = viewportRef.current;
      const scrollbar = orientation === 'vertical' ? vScrollbarRef.current : hScrollbarRef.current;
      if (!viewport || !scrollbar) return;

      event.preventDefault();
      activeDragCleanupRef.current?.();

      const isVertical = orientation === 'vertical';
      const startPointerPos = isVertical ? event.clientY : event.clientX;
      const startScrollPos = isVertical ? viewport.scrollTop : viewport.scrollLeft;
      const clientSize = isVertical ? viewport.clientHeight : viewport.clientWidth;
      const scrollSize = isVertical ? viewport.scrollHeight : viewport.scrollWidth;
      const trackSize = isVertical ? scrollbar.clientHeight : scrollbar.clientWidth;
      const resolvedTrackSize = trackSize === 0 ? clientSize : trackSize;
      const metrics = calcScrollAreaThumb(resolvedTrackSize, scrollSize, startScrollPos);
      const maxScroll = Math.max(scrollSize - clientSize, 0);
      const maxThumbOffset = Math.max(resolvedTrackSize - metrics.thumbSize, 0);

      const handlePointerMove = (moveEvent: PointerEvent) => {
        if (maxScroll <= 0 || maxThumbOffset <= 0) return;

        const currentPointerPos = isVertical ? moveEvent.clientY : moveEvent.clientX;
        const pointerDelta = currentPointerPos - startPointerPos;
        const scrollDelta = (pointerDelta / maxThumbOffset) * maxScroll;

        if (isVertical) {
          viewport.scrollTop = startScrollPos + scrollDelta;
        } else {
          viewport.scrollLeft = startScrollPos + scrollDelta;
        }

        syncThumbs();
      };

      const handlePointerUp = () => {
        activeDragCleanupRef.current?.();
      };

      activeDragCleanupRef.current = () => {
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerup', handlePointerUp);
        window.removeEventListener('pointercancel', handlePointerUp);
        activeDragCleanupRef.current = null;
      };

      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
      window.addEventListener('pointercancel', handlePointerUp);
    },
    [syncThumbs],
  );

  useEffect(
    () => () => {
      activeDragCleanupRef.current?.();
    },
    [],
  );

  return {
    viewportId,
    viewportRef,
    vScrollbarRef,
    hScrollbarRef,
    vThumbRef,
    hThumbRef,
    getThumbPointerDown,
  };
};
