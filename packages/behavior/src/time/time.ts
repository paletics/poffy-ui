import type {
  TimeClockRect,
  TimeClockUnit,
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
 * ### Notes
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

/**
 * Builds inclusive numeric options for minute/second clock units.
 */
export const buildTimeUnitRange = (min: number, max: number, step: number): number[] => {
  const normalizedStep = Math.max(1, Math.floor(step));
  const values: number[] = [];

  for (let value = min; value <= max; value += normalizedStep) {
    values.push(value);
  }

  return values;
};

/**
 * Builds hour options for a 12-hour analog clock face.
 */
export const buildTimeClockHourOptions = (step: number, _format?: TimeFormat): number[] => {
  const normalizedStep = Math.max(1, Math.floor(step));
  const values: number[] = [];

  for (let value = 0; value < 12; value += normalizedStep) {
    values.push(value === 0 ? 12 : value);
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

/**
 * Converts a pointer coordinate on a clock face into the nearest unit value.
 */
export const getTimeClockValueFromPoint = (
  rect: TimeClockRect,
  clientX: number,
  clientY: number,
  unit: TimeClockUnit,
): number => {
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const radians = Math.atan2(clientX - centerX, centerY - clientY);
  const degrees = (radians * 180) / Math.PI;
  const angle = (degrees + 360) % 360;

  if (unit === 'hour') {
    const hour = Math.round(angle / 30) % 12;
    return hour === 0 ? 12 : hour;
  }

  return Math.round(angle / 6) % 60;
};
