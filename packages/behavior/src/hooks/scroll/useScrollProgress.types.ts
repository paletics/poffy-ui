/** Axis whose scroll offset is measured. */
export type ScrollProgressAxis = 'x' | 'y';

/**
 * Options for observing document or element scroll progress.
 * When `container` is supplied, its owner document takes precedence over `targetDocument`.
 */
export interface UseScrollProgressOptions {
  /**
   * The scroll container to observe. Omit to observe document scrolling.
   *
   * Pass a reactive element value, such as one captured with a callback ref,
   * so the hook can detach and attach observers when the node changes.
   */
  container?: HTMLElement | null;
  /** Document observed when `container` is omitted. `null` disables document observation. */
  targetDocument?: Document | null;
  /**
   * Axis used for both offset and maximum-scroll calculations.
   *
   * @defaultValue `'y'`
   */
  axis?: ScrollProgressAxis;
  /**
   * Stops listeners and returns a static zero progress value.
   *
   * @defaultValue `false`
   */
  disabled?: boolean;
}

/** Normalized scroll metrics for the selected axis. */
export interface ScrollProgress {
  /** Current scroll offset in CSS pixels. */
  position: number;
  /** Largest reachable scroll offset in CSS pixels. */
  maxPosition: number;
  /** Current position normalized to the inclusive range from `0` to `1`. */
  progress: number;
}
