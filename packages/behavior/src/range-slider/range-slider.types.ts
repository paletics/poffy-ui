/** Identity of one endpoint in an ascending two-thumb range. */
export type RangeSliderThumb = 'lower' | 'upper';

/** Lower then upper numeric endpoints before or after normalization. */
export type RangeSliderValue = [number, number];

/** Keyboard action understood by the range helpers. */
export type RangeSliderKeyboardAction =
  | 'decrement'
  | 'increment'
  | 'largeDecrement'
  | 'largeIncrement'
  | 'min'
  | 'max';

/** Numeric constraints used by the two-thumb range helpers. */
export interface RangeSliderOptions {
  /**
   * Inclusive lower bound. Non-finite values use the default.
   *
   * @defaultValue `0`
   */
  min?: number;
  /**
   * Inclusive upper bound. Non-finite values use the default; reversed bounds are reordered.
   *
   * @defaultValue `100`
   */
  max?: number;
  /**
   * Positive increment used for value rounding. Invalid values use the default.
   *
   * @defaultValue `1`
   */
  step?: number;
  /** Step distance used for PageUp and PageDown; an omitted or non-positive value uses ten steps. */
  pageStep?: number;
  /**
   * Minimum whole number of `step` increments between thumbs. Fractions are rounded down, invalid
   * values become zero, and the resulting gap cannot exceed the normalized range width.
   */
  minStepsBetweenThumbs?: number;
}

/** Inputs needed to apply one keyboard action to one normalized thumb. */
export interface GetNextRangeSliderValueOptions extends RangeSliderOptions {
  /** Current endpoints, normalized before the action is applied. */
  value: RangeSliderValue;
  /** Endpoint that receives the action. */
  thumb: RangeSliderThumb;
  /** Requested keyboard movement or boundary action. */
  action: RangeSliderKeyboardAction;
}
