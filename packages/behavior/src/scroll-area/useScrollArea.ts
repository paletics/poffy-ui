'use client';

import { useCallback, useEffect, useId, useRef } from 'react';
import { calcScrollAreaThumb } from './scroll-area';
import type { UseScrollAreaReturn } from './useScrollArea.types';

type RtlScrollType = 'default' | 'negative' | 'reverse';

const rtlScrollTypes = new WeakMap<Document, RtlScrollType>();

const getRtlScrollType = (ownerDocument: Document): RtlScrollType => {
  const cached = rtlScrollTypes.get(ownerDocument);
  if (cached) return cached;
  if (!ownerDocument.body) return 'default';

  const scrollbar = ownerDocument.createElement('div');
  const content = ownerDocument.createElement('div');
  scrollbar.dir = 'rtl';
  scrollbar.style.cssText = 'width:4px;height:1px;overflow:scroll;position:absolute;top:-9999px;';
  content.style.width = '8px';
  scrollbar.append(content);
  ownerDocument.body.append(scrollbar);

  let scrollType: RtlScrollType;
  if (scrollbar.scrollLeft > 0) {
    scrollType = 'reverse';
  } else {
    scrollbar.scrollLeft = 1;
    scrollType = scrollbar.scrollLeft === 0 ? 'negative' : 'default';
  }

  scrollbar.remove();
  rtlScrollTypes.set(ownerDocument, scrollType);
  return scrollType;
};

const getScrollPosition = (
  viewport: HTMLDivElement,
  orientation: 'vertical' | 'horizontal',
  clientSize: number,
  scrollSize: number,
) => {
  const ownerWindow = viewport.ownerDocument.defaultView;
  if (orientation === 'vertical' || ownerWindow?.getComputedStyle(viewport).direction !== 'rtl') {
    return orientation === 'vertical' ? viewport.scrollTop : viewport.scrollLeft;
  }

  const maxScroll = Math.max(scrollSize - clientSize, 0);
  switch (getRtlScrollType(viewport.ownerDocument)) {
    case 'negative':
      return maxScroll + viewport.scrollLeft;
    case 'default':
      return maxScroll - viewport.scrollLeft;
    default:
      return viewport.scrollLeft;
  }
};

const setScrollPosition = (
  viewport: HTMLDivElement,
  orientation: 'vertical' | 'horizontal',
  position: number,
  clientSize: number,
  scrollSize: number,
) => {
  if (orientation === 'vertical') {
    viewport.scrollTop = position;
    return;
  }
  const ownerWindow = viewport.ownerDocument.defaultView;
  if (ownerWindow?.getComputedStyle(viewport).direction !== 'rtl') {
    viewport.scrollLeft = position;
    return;
  }

  const maxScroll = Math.max(scrollSize - clientSize, 0);
  switch (getRtlScrollType(viewport.ownerDocument)) {
    case 'negative':
      viewport.scrollLeft = position - maxScroll;
      break;
    case 'default':
      viewport.scrollLeft = maxScroll - position;
      break;
    default:
      viewport.scrollLeft = position;
  }
};

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
  const scrollPos = getScrollPosition(viewport, orientation, clientSize, scrollSize);
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
 * Manages scroll-area refs, thumb metrics, and pointer-driven scrollbar dragging.
 *
 * Attach every returned ref to its matching viewport, track, or thumb, and attach the handler
 * returned by `getThumbPointerDown` to the corresponding thumb. The hook tracks scrolling,
 * window resize, content mutations, and element resizing; it removes those subscriptions and any
 * active window-level drag listeners on unmount. Horizontal dragging normalizes browser-specific
 * RTL `scrollLeft` behavior.
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
    const ownerWindow = viewport?.ownerDocument.defaultView;
    if (!viewport || !ownerWindow) return;

    syncThumbs();
    viewport.addEventListener('scroll', syncThumbs, { passive: true });
    ownerWindow.addEventListener('resize', syncThumbs);

    const ResizeObserverConstructor = ownerWindow.ResizeObserver;
    if (!ResizeObserverConstructor) {
      return () => {
        viewport.removeEventListener('scroll', syncThumbs);
        ownerWindow.removeEventListener('resize', syncThumbs);
      };
    }

    const resizeObserver = new ResizeObserverConstructor(syncThumbs);
    const observeSizes = () => {
      resizeObserver.disconnect();
      resizeObserver.observe(viewport);
      [vScrollbarRef.current, hScrollbarRef.current, ...Array.from(viewport.children)].forEach(
        (element) => {
          if (element) resizeObserver.observe(element);
        },
      );
    };
    observeSizes();

    const MutationObserverConstructor = ownerWindow.MutationObserver;
    let mutationAnimationFrame: number | undefined;
    const mutationObserver = MutationObserverConstructor
      ? new MutationObserverConstructor(() => {
          if (mutationAnimationFrame !== undefined) return;
          mutationAnimationFrame = ownerWindow.requestAnimationFrame(() => {
            mutationAnimationFrame = undefined;
            observeSizes();
            syncThumbs();
          });
        })
      : undefined;
    mutationObserver?.observe(viewport, { childList: true, characterData: true, subtree: true });

    return () => {
      viewport.removeEventListener('scroll', syncThumbs);
      ownerWindow.removeEventListener('resize', syncThumbs);
      resizeObserver.disconnect();
      mutationObserver?.disconnect();
      if (mutationAnimationFrame !== undefined) {
        ownerWindow.cancelAnimationFrame(mutationAnimationFrame);
      }
    };
  }, [syncThumbs]);

  const getThumbPointerDown = useCallback(
    (orientation: 'vertical' | 'horizontal') => (event: React.PointerEvent<HTMLDivElement>) => {
      if (event.button > 0 || event.isPrimary === false) return;

      const viewport = viewportRef.current;
      const scrollbar = orientation === 'vertical' ? vScrollbarRef.current : hScrollbarRef.current;
      const ownerWindow = viewport?.ownerDocument.defaultView;
      if (!viewport || !scrollbar || !ownerWindow) return;

      event.preventDefault();
      activeDragCleanupRef.current?.();

      const isVertical = orientation === 'vertical';
      const startPointerPos = isVertical ? event.clientY : event.clientX;
      const clientSize = isVertical ? viewport.clientHeight : viewport.clientWidth;
      const scrollSize = isVertical ? viewport.scrollHeight : viewport.scrollWidth;
      const startScrollPos = getScrollPosition(viewport, orientation, clientSize, scrollSize);
      const trackSize = isVertical ? scrollbar.clientHeight : scrollbar.clientWidth;
      const resolvedTrackSize = trackSize === 0 ? clientSize : trackSize;
      const metrics = calcScrollAreaThumb(resolvedTrackSize, scrollSize, startScrollPos);
      const maxScroll = Math.max(scrollSize - clientSize, 0);
      const maxThumbOffset = Math.max(resolvedTrackSize - metrics.thumbSize, 0);

      const handlePointerMove = (moveEvent: PointerEvent) => {
        if (moveEvent.pointerId !== event.pointerId) return;
        if (maxScroll <= 0 || maxThumbOffset <= 0) return;

        const currentPointerPos = isVertical ? moveEvent.clientY : moveEvent.clientX;
        const pointerDelta = currentPointerPos - startPointerPos;
        const scrollDelta = (pointerDelta / maxThumbOffset) * maxScroll;

        setScrollPosition(
          viewport,
          orientation,
          startScrollPos + scrollDelta,
          clientSize,
          scrollSize,
        );

        syncThumbs();
      };

      const handlePointerUp = (upEvent: PointerEvent) => {
        if (upEvent.pointerId !== event.pointerId) return;
        activeDragCleanupRef.current?.();
      };

      const cleanup = () => {
        ownerWindow.removeEventListener('pointermove', handlePointerMove);
        ownerWindow.removeEventListener('pointerup', handlePointerUp);
        ownerWindow.removeEventListener('pointercancel', handlePointerUp);
        if (activeDragCleanupRef.current === cleanup) activeDragCleanupRef.current = null;
      };

      activeDragCleanupRef.current = cleanup;
      ownerWindow.addEventListener('pointermove', handlePointerMove);
      ownerWindow.addEventListener('pointerup', handlePointerUp);
      ownerWindow.addEventListener('pointercancel', handlePointerUp);
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
