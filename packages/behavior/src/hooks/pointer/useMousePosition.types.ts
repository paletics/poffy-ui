/**
 * Pointer coordinates in CSS pixels.
 */
export interface MousePosition {
  /** Horizontal pointer coordinate. */
  x: number;
  /** Vertical pointer coordinate. */
  y: number;
  /** Optional depth coordinate for consumers that model three-dimensional input. */
  z?: number;
}
