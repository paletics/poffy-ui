/**
 * Scroll coordinates in CSS pixels.
 */
export interface ScrollPosition {
  /** Horizontal scroll offset. */
  x: number;
  /** Vertical scroll offset. */
  y: number;
  /** Optional depth offset for consumers that model three-dimensional scroll state. */
  z?: number;
}
