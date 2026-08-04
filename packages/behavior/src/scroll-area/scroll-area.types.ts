/**
 * Derived thumb metrics for a scroll-area scrollbar.
 */
export interface ScrollAreaThumbMetrics {
  /** Thumb length in pixels, clamped to the supplied track length. */
  thumbSize: number;
  /** Thumb offset in pixels from the track start, clamped to its travel range. */
  thumbOffset: number;
  /** Whether content length exceeds the visible client length. */
  isOverflowing: boolean;
}
