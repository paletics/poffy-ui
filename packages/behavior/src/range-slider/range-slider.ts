import type {
  GetNextRangeSliderValueOptions,
  RangeSliderKeyboardAction,
  RangeSliderOptions,
  RangeSliderThumb,
  RangeSliderValue,
} from './range-slider.types';

const DEFAULT_MIN = 0;
const DEFAULT_MAX = 100;
const DEFAULT_STEP = 1;

const rangeSliderKeyActionMap: Partial<Record<string, RangeSliderKeyboardAction>> = {
  ArrowDown: 'decrement',
  ArrowLeft: 'decrement',
  ArrowRight: 'increment',
  ArrowUp: 'increment',
  PageDown: 'largeDecrement',
  PageUp: 'largeIncrement',
  Home: 'min',
  End: 'max',
};

/** Resolves keyboard input into a direction-aware RangeSlider action. */
export const getRangeSliderKeyboardAction = (
  key: string,
  isRtl = false,
): RangeSliderKeyboardAction | undefined => {
  const action = rangeSliderKeyActionMap[key];
  if (!isRtl || (key !== 'ArrowLeft' && key !== 'ArrowRight')) return action;
  return action === 'increment' ? 'decrement' : action === 'decrement' ? 'increment' : action;
};

const getPrecision = (step: number) => {
  const stepText = String(step);
  const [coefficient, exponentText] = stepText.split('e-');

  if (exponentText !== undefined) {
    const coefficientDecimals = coefficient.split('.')[1]?.length ?? 0;
    return Number(exponentText) + coefficientDecimals;
  }

  if (!stepText.includes('.')) return 0;
  return stepText.split('.')[1]?.length ?? 0;
};

const roundToStepPrecision = (value: number, step: number) => {
  const digits = getPrecision(step) + 2;
  // Number#toFixed accepts at most 100 digits. Smaller exponential steps are
  // already represented more accurately by the computed floating-point value.
  return digits <= 100 ? Number(value.toFixed(digits)) : value;
};

const getBounds = ({
  min = DEFAULT_MIN,
  max = DEFAULT_MAX,
  step = DEFAULT_STEP,
}: RangeSliderOptions) => {
  const resolvedMin = Number.isFinite(min) ? min : DEFAULT_MIN;
  const resolvedMax = Number.isFinite(max) ? max : DEFAULT_MAX;
  const resolvedStep = Number.isFinite(step) && step > 0 ? step : DEFAULT_STEP;

  return {
    min: Math.min(resolvedMin, resolvedMax),
    max: Math.max(resolvedMin, resolvedMax),
    step: resolvedStep,
  };
};

const getMinGap = (options: RangeSliderOptions) => {
  const { min, max, step } = getBounds(options);
  const requestedSteps = options.minStepsBetweenThumbs;
  const safeSteps =
    typeof requestedSteps === 'number' && Number.isFinite(requestedSteps)
      ? Math.max(0, Math.floor(requestedSteps))
      : 0;
  const requestedGap = roundToStepPrecision(safeSteps * step, step);
  return Math.min(requestedGap, max - min);
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

/** Clamps a value to normalized bounds and rounds it to the nearest configured step. */
export const roundRangeSliderValue = (value: number, options: RangeSliderOptions = {}) => {
  const { min, max, step } = getBounds(options);
  const clamped = clamp(value, min, max);
  if (clamped === min || clamped === max) return clamped;
  const stepped = Math.round((clamped - min) / step) * step + min;
  return clamp(roundToStepPrecision(stepped, step), min, max);
};

const roundRangeSliderBound = (
  value: number,
  direction: 'up' | 'down',
  options: RangeSliderOptions,
) => {
  const { min, max, step } = getBounds(options);
  const clamped = clamp(value, min, max);
  if (clamped === min || clamped === max) return clamped;
  const stepIndex = (clamped - min) / step;
  const stepEpsilon = Math.min(0.25, Number.EPSILON * Math.max(1, Math.abs(stepIndex)) * 4);
  const stepped =
    (direction === 'up'
      ? Math.ceil(stepIndex - stepEpsilon)
      : Math.floor(stepIndex + stepEpsilon)) *
      step +
    min;
  return clamp(roundToStepPrecision(stepped, step), min, max);
};

/**
 * Normalizes a two-thumb range into ascending, stepped, bounded values that honor the configured
 * minimum gap. Invalid entries fall back to the normalized minimum and maximum.
 */
export const normalizeRangeSliderValue = (
  value: RangeSliderValue,
  options: RangeSliderOptions = {},
): RangeSliderValue => {
  const { min, max } = getBounds(options);
  const minGap = getMinGap(options);
  const rawValue: readonly unknown[] = Array.isArray(value) ? value : [];
  const [rawLower, rawUpper] = rawValue;
  const lowerCandidate = typeof rawLower === 'number' && Number.isFinite(rawLower) ? rawLower : min;
  const upperCandidate = typeof rawUpper === 'number' && Number.isFinite(rawUpper) ? rawUpper : max;
  let lower = roundRangeSliderValue(
    clamp(Math.min(lowerCandidate, upperCandidate), min, max),
    options,
  );
  let upper = roundRangeSliderValue(
    clamp(Math.max(lowerCandidate, upperCandidate), min, max),
    options,
  );

  lower = clamp(lower, min, max - minGap);
  upper = clamp(upper, min + minGap, max);

  if (upper - lower < minGap) {
    upper = clamp(roundRangeSliderValue(lower + minGap, options), min + minGap, max);
    lower = clamp(roundRangeSliderValue(upper - minGap, options), min, max - minGap);
  }

  return [lower, upper];
};

/** Moves one thumb without crossing the other or violating the configured minimum gap. */
export const clampRangeSliderThumb = (
  nextValue: number,
  thumb: RangeSliderThumb,
  currentValue: RangeSliderValue,
  options: RangeSliderOptions = {},
): RangeSliderValue => {
  const { min, max } = getBounds(options);
  const minGap = getMinGap(options);
  const [lower, upper] = normalizeRangeSliderValue(currentValue, options);
  const rounded = roundRangeSliderValue(nextValue, options);

  if (thumb === 'lower') {
    const allowedMax = roundRangeSliderBound(upper - minGap, 'down', options);
    return [clamp(rounded, min, allowedMax), upper];
  }

  const allowedMin = roundRangeSliderBound(lower + minGap, 'up', options);
  return [lower, clamp(rounded, allowedMin, max)];
};

/** Returns the values an individual thumb can reach without violating the minimum gap. */
export const getRangeSliderThumbBounds = (
  thumb: RangeSliderThumb,
  currentValue: RangeSliderValue,
  options: RangeSliderOptions = {},
): { min: number; max: number } => {
  const { min, max } = getBounds(options);
  const minGap = getMinGap(options);
  const [lower, upper] = normalizeRangeSliderValue(currentValue, options);

  return thumb === 'lower'
    ? { min, max: roundRangeSliderBound(upper - minGap, 'down', options) }
    : { min: roundRangeSliderBound(lower + minGap, 'up', options), max };
};

/** Applies a keyboard action to one thumb while preserving normalized range constraints. */
export const getNextRangeSliderValue = ({
  value,
  thumb,
  action,
  pageStep,
  ...options
}: GetNextRangeSliderValueOptions): RangeSliderValue => {
  const { min, max, step } = getBounds(options);
  const minGap = getMinGap(options);
  const [lower, upper] = normalizeRangeSliderValue(value, options);
  const largeStep = pageStep && pageStep > 0 ? pageStep : step * 10;
  const current = thumb === 'lower' ? lower : upper;
  const allowedMin = thumb === 'lower' ? min : lower + minGap;
  const allowedMax = thumb === 'lower' ? upper - minGap : max;
  const next =
    action === 'increment'
      ? current + step
      : action === 'decrement'
        ? current - step
        : action === 'largeIncrement'
          ? current + largeStep
          : action === 'largeDecrement'
            ? current - largeStep
            : action === 'min'
              ? allowedMin
              : allowedMax;

  return clampRangeSliderThumb(clamp(next, allowedMin, allowedMax), thumb, [lower, upper], options);
};

/** Converts a bounded range value to a clamped percentage from `0` to `100`. */
export const getRangeSliderPercent = (value: number, options: RangeSliderOptions = {}) => {
  const { min, max } = getBounds(options);
  if (max === min) return 0;
  return clamp(((value - min) / (max - min)) * 100, 0, 100);
};

/** Returns the closest thumb, preferring the lower thumb when distances are equal. */
export const getClosestRangeSliderThumb = (
  value: number,
  range: RangeSliderValue,
): RangeSliderThumb =>
  Math.abs(value - range[0]) <= Math.abs(value - range[1]) ? 'lower' : 'upper';
