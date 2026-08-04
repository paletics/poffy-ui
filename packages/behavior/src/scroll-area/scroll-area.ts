import type { ScrollAreaThumbMetrics } from './scroll-area.types';

/**
 * Minimum pixel size for a scrollbar thumb.
 */
export const MIN_SCROLL_AREA_THUMB_SIZE = 20;

/**
 * Calculates scrollbar thumb size and offset for a scrollable track.
 *
 * `clientSize` is the track length, `scrollSize` is the scrollable content length, and
 * `scrollPos` is clamped to the available scroll range. A non-scrollable or zero-sized input
 * reports `isOverflowing: false`; its thumb starts at offset zero.
 */
export const calcScrollAreaThumb = (
  clientSize: number,
  scrollSize: number,
  scrollPos: number,
): ScrollAreaThumbMetrics => {
  if (scrollSize <= 0 || clientSize <= 0) {
    return {
      thumbSize: MIN_SCROLL_AREA_THUMB_SIZE,
      thumbOffset: 0,
      isOverflowing: false,
    };
  }

  if (scrollSize <= clientSize) {
    return {
      thumbSize: clientSize,
      thumbOffset: 0,
      isOverflowing: false,
    };
  }

  const ratio = clientSize / scrollSize;
  const thumbSize = Math.min(clientSize, Math.max(ratio * clientSize, MIN_SCROLL_AREA_THUMB_SIZE));
  const maxOffset = Math.max(clientSize - thumbSize, 0);
  const maxScroll = Math.max(scrollSize - clientSize, 0);
  const clampedScrollPos = Math.min(Math.max(scrollPos, 0), maxScroll);
  const thumbOffset = maxScroll > 0 ? (clampedScrollPos / maxScroll) * maxOffset : 0;

  return {
    thumbSize,
    thumbOffset,
    isOverflowing: scrollSize > clientSize,
  };
};
