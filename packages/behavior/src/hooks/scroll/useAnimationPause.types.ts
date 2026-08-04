/**
 * Options for calculating whether a decorative animation should pause.
 * The hook is conservative: unavailable document or intersection observation is treated as a
 * pause when the corresponding observation is requested.
 */
export interface UseAnimationPauseOptions {
  /**
   * The visual root to observe when `pauseWhenOffscreen` is enabled.
   * Pass a reactive element value, such as one captured with a callback ref.
   */
  target?: Element | null;
  /** Document used when no target element is available. `null` disables document observation. */
  targetDocument?: Document | null;
  /**
   * Explicitly pauses the animation.
   *
   * @defaultValue `false`
   */
  disabled?: boolean;
  /**
   * Pauses while the document is hidden.
   *
   * @defaultValue `true`
   */
  pauseWhenDocumentHidden?: boolean;
  /**
   * Pauses while `target` is outside the viewport.
   *
   * @defaultValue `false`
   */
  pauseWhenOffscreen?: boolean;
  /** Intersection observer root margin. Used only when `pauseWhenOffscreen` is enabled. */
  rootMargin?: string;
  /**
   * Intersection observer threshold.
   *
   * @defaultValue `0`
   */
  threshold?: number | readonly number[];
}
