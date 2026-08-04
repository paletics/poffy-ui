import type {
  TimeClockHourRing,
  TimeClockRect,
  TimeClockUnit,
  TimeConstraintOptions,
  TimeFormat,
  TimeMeridiem,
  TimeParts,
} from './time.types';

/**
 * Zeroed fallback time parts used for uncontrolled initialization.
 */
export const fallbackTimeParts: TimeParts = { hour: 0, minute: 0, second: 0 };

/**
 * Clamps a numeric value into the provided inclusive range.
 */
export const clampTimeUnit = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

const normalizeTimeParts = (parts: TimeParts): TimeParts => ({
  hour: clampTimeUnit(parts.hour, 0, 23),
  minute: clampTimeUnit(parts.minute, 0, 59),
  second: clampTimeUnit(parts.second, 0, 59),
});

const normalizeTimeValue = (value: string | TimeParts | null | undefined): TimeParts | null => {
  if (!value) return null;
  if (typeof value === 'string') return parseTimeValue(value);
  return normalizeTimeParts(value);
};

/**
 * Formats a numeric time unit as a two-digit string.
 */
export const padTimeUnit = (value: number): string => value.toString().padStart(2, '0');

/**
 * Formats time parts into an HH:mm or HH:mm:ss string.
 */
export const formatTimeParts = (parts: TimeParts, withSeconds: boolean): string =>
  withSeconds
    ? `${padTimeUnit(parts.hour)}:${padTimeUnit(parts.minute)}:${padTimeUnit(parts.second)}`
    : `${padTimeUnit(parts.hour)}:${padTimeUnit(parts.minute)}`;

/**
 * Parses a time string into normalized time parts.
 *
 * Accepts `H:mm`, `HH:mm`, `H:mm:ss`, and `HH:mm:ss` strings. Invalid strings
 * return `null`; numeric hour/minute/second parts are clamped to valid 24-hour
 * ranges instead of rejecting out-of-range input.
 */
export const parseTimeValue = (value?: string | null): TimeParts | null => {
  if (!value) return null;

  const match = /^(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?$/.exec(value.trim());
  if (!match) return null;

  const hour = Number(match[1]);
  const minute = Number(match[2]);
  const second = Number(match[3] ?? '0');

  if ([hour, minute, second].some((part) => Number.isNaN(part))) {
    return null;
  }

  return {
    hour: clampTimeUnit(hour, 0, 23),
    minute: clampTimeUnit(minute, 0, 59),
    second: clampTimeUnit(second, 0, 59),
  };
};

/**
 * Compares two time values by hour, minute, and second.
 */
export const compareTimeParts = (a: TimeParts, b: TimeParts): -1 | 0 | 1 => {
  if (a.hour !== b.hour) return a.hour < b.hour ? -1 : 1;
  if (a.minute !== b.minute) return a.minute < b.minute ? -1 : 1;
  if (a.second !== b.second) return a.second < b.second ? -1 : 1;
  return 0;
};

/**
 * Returns whether a time value is unavailable under time-level constraints.
 *
 * `null`, `undefined`, and unparseable strings are treated as available so
 * clear or invalid-input flows can pass through. `minTime` and `maxTime` are
 * inclusive. Parseable string values follow `parseTimeValue`, including clamp
 * normalization for out-of-range numeric parts.
 */
export const isTimeUnavailable = (
  value: string | TimeParts | null | undefined,
  { minTime, maxTime, isTimeDisabled }: TimeConstraintOptions,
): boolean => {
  const parts = normalizeTimeValue(value);
  if (!parts) return false;

  const minParts = normalizeTimeValue(minTime);
  const maxParts = normalizeTimeValue(maxTime);

  if (minParts && compareTimeParts(parts, minParts) < 0) return true;
  if (maxParts && compareTimeParts(parts, maxParts) > 0) return true;
  if (isTimeDisabled?.(parts)) return true;
  return false;
};

/**
 * Converts a 24-hour value into the displayed hour for the given format.
 */
export const toDisplayHour = (hour: number, format: TimeFormat): number => {
  if (format === '24h') return hour;

  const normalized = hour % 12;
  return normalized === 0 ? 12 : normalized;
};

/**
 * Returns the meridiem token for a 24-hour value.
 */
export const toMeridiem = (hour: number): TimeMeridiem => (hour >= 12 ? 'pm' : 'am');

/**
 * Applies a displayed hour value back to a 24-hour value.
 */
export const applyDisplayHour = (
  displayHour: number,
  currentHour: number,
  format: TimeFormat,
): number => {
  if (format === '24h') {
    return clampTimeUnit(displayHour, 0, 23);
  }

  const safeHour = clampTimeUnit(displayHour, 1, 12);
  const isPm = currentHour >= 12;

  if (safeHour === 12) {
    return isPm ? 12 : 0;
  }

  return isPm ? safeHour + 12 : safeHour;
};

/**
 * Applies a meridiem token to a 24-hour value.
 */
export const applyMeridiem = (hour: number, meridiem: TimeMeridiem): number => {
  const baseHour = hour % 12;
  return meridiem === 'pm' ? baseHour + 12 : baseHour;
};

const normalizeTimeStep = (step: number): number =>
  Number.isFinite(step) && step > 0 ? Math.max(1, Math.floor(step)) : 1;

const maxTimeUnitRangeLength = 60;

/**
 * Builds inclusive numeric options for minute/second clock units.
 *
 * Invalid bounds and ranges that would contain 60 or more normalized steps return an empty list,
 * preventing malformed input from causing unbounded option generation.
 */
export const buildTimeUnitRange = (min: number, max: number, step: number): number[] => {
  // A non-finite bound would never be reached by the finite normalized step.
  // Treat malformed public inputs as an empty option set instead of looping forever.
  if (!Number.isFinite(min) || !Number.isFinite(max)) return [];

  const normalizedStep = normalizeTimeStep(step);
  const stepCount = (max - min) / normalizedStep;
  if (!Number.isFinite(stepCount) || stepCount >= maxTimeUnitRangeLength) return [];
  const values: number[] = [];

  for (let value = min; value <= max; value += normalizedStep) {
    values.push(value);
  }

  return values;
};

/**
 * Builds hour options for an analog clock face in the requested display format.
 *
 * Twelve-hour mode represents midnight/noon as `12`; twenty-four-hour mode returns values from
 * `0` through `23`. Invalid or fractional steps are normalized to a positive whole increment.
 */
export const buildTimeClockHourOptions = (step: number, format: TimeFormat = '12h'): number[] => {
  const normalizedStep = normalizeTimeStep(step);
  const values: number[] = [];
  const end = format === '24h' ? 24 : 12;

  for (let value = 0; value < end; value += normalizedStep) {
    values.push(format === '12h' && value === 0 ? 12 : value);
  }

  return values;
};

/**
 * Returns the comparable displayed value for a clock unit.
 */
export const getTimeClockUnitValue = (
  parts: TimeParts,
  unit: TimeClockUnit,
  format: TimeFormat,
): number => {
  if (unit === 'hour') return toDisplayHour(parts.hour, format);
  if (unit === 'minute') return parts.minute;
  return parts.second;
};

/**
 * Converts a clock value into a clockwise angle where 12/00 is at the top.
 */
export const getTimeClockValueAngle = (value: number, unit: TimeClockUnit): number => {
  if (unit === 'hour') {
    return (value % 12) * 30;
  }

  return value * 6;
};

/** Returns the visual ring for an hour value. */
export const getTimeClockHourRing = (value: number, format: TimeFormat): TimeClockHourRing =>
  format === '24h' && (value === 0 || value > 12) ? 'inner' : 'outer';

/**
 * Resolves the 24-hour ring under a pointer. A small hysteresis band prevents
 * a drag near the midpoint from repeatedly switching rings.
 */
export const getTimeClockHourRingFromPoint = (
  rect: TimeClockRect,
  clientX: number,
  clientY: number,
  previousRing?: TimeClockHourRing,
): TimeClockHourRing => {
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const radius = Math.min(rect.width, rect.height) / 2;
  const distance = Math.hypot(clientX - centerX, clientY - centerY);
  const normalizedDistance = radius > 0 ? distance / radius : 0;
  const boundary = 0.66;
  const hysteresis = 0.04;

  if (previousRing === 'inner') {
    return normalizedDistance > boundary + hysteresis ? 'outer' : 'inner';
  }
  if (previousRing === 'outer') {
    return normalizedDistance < boundary - hysteresis ? 'inner' : 'outer';
  }
  return normalizedDistance < boundary ? 'inner' : 'outer';
};

/**
 * Converts a pointer coordinate on a clock face into the nearest unit value.
 */
export const getTimeClockValueFromPoint = (
  rect: TimeClockRect,
  clientX: number,
  clientY: number,
  unit: TimeClockUnit,
  format: TimeFormat = '12h',
  hourRing?: TimeClockHourRing,
): number => {
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const radians = Math.atan2(clientX - centerX, centerY - clientY);
  const degrees = (radians * 180) / Math.PI;
  const angle = (degrees + 360) % 360;

  if (unit === 'hour') {
    const hour = Math.round(angle / 30) % 12;
    if (format === '24h') {
      const ring = hourRing ?? getTimeClockHourRingFromPoint(rect, clientX, clientY);
      if (ring === 'inner') return hour === 0 ? 0 : hour + 12;
    }
    return hour === 0 ? 12 : hour;
  }

  return Math.round(angle / 6) % 60;
};
