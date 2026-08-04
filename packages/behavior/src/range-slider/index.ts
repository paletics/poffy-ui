/**
 * Normalization, keyboard, geometry, and endpoint helpers for two-thumb range sliders.
 *
 * Every returned range is ascending and honors normalized bounds, steps, and minimum thumb gap.
 */
export {
  clampRangeSliderThumb,
  getClosestRangeSliderThumb,
  getNextRangeSliderValue,
  getRangeSliderKeyboardAction,
  getRangeSliderPercent,
  getRangeSliderThumbBounds,
  normalizeRangeSliderValue,
  roundRangeSliderValue,
} from './range-slider';
export type {
  GetNextRangeSliderValueOptions,
  RangeSliderKeyboardAction,
  RangeSliderOptions,
  RangeSliderThumb,
  RangeSliderValue,
} from './range-slider.types';
