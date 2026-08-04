/**
 * Parses, normalizes, constrains, formats, and maps renderer-neutral local-clock values.
 *
 * Parsing deliberately clamps syntactically valid numeric segments rather than rejecting them.
 */
export {
  applyDisplayHour,
  applyMeridiem,
  buildTimeClockHourOptions,
  buildTimeUnitRange,
  clampTimeUnit,
  compareTimeParts,
  fallbackTimeParts,
  formatTimeParts,
  getTimeClockUnitValue,
  getTimeClockHourRing,
  getTimeClockHourRingFromPoint,
  getTimeClockValueAngle,
  getTimeClockValueFromPoint,
  isTimeUnavailable,
  padTimeUnit,
  parseTimeValue,
  toDisplayHour,
  toMeridiem,
} from './time';
/** Owns nullable controlled/uncontrolled parsed time state without imposing feature-level constraints. */
export { useControllableTimeValue } from './useControllableTimeValue';
export type {
  UseControllableTimeValueOptions,
  UseControllableTimeValueReturn,
} from './useControllableTimeValue';
/** Time parsing, constraints, display-format, and clock-geometry contracts. */
export type {
  TimeConstraintOptions,
  TimeClockRect,
  TimeClockHourRing,
  TimeClockUnit,
  TimeFormat,
  TimeMeridiem,
  TimeParts,
} from './time.types';
