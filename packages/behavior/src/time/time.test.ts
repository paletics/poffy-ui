import { describe, expect, expectTypeOf, it } from 'vitest';
import * as rootExports from '..';
import * as timeExports from '.';
import {
  applyDisplayHour,
  applyMeridiem,
  buildTimeClockHourOptions,
  buildTimeUnitRange,
  clampTimeUnit,
  compareTimeParts,
  fallbackTimeParts,
  formatTimeParts,
  getTimeClockHourRing,
  getTimeClockHourRingFromPoint,
  getTimeClockUnitValue,
  getTimeClockValueAngle,
  getTimeClockValueFromPoint,
  isTimeUnavailable,
  padTimeUnit,
  parseTimeValue,
  toDisplayHour,
  toMeridiem,
} from './time';
import type { TimeConstraintOptions } from './time.types';
import type { TimeConstraintOptions as RootTimeConstraintOptions } from '..';
import type { TimeConstraintOptions as SubpathTimeConstraintOptions } from '.';

describe('time behavior helpers', () => {
  it('exposes time constraints from the time and root public surfaces', () => {
    expect(timeExports).toHaveProperty('compareTimeParts');
    expect(timeExports).toHaveProperty('isTimeUnavailable');
    expect(rootExports).toHaveProperty('compareTimeParts');
    expect(rootExports).toHaveProperty('isTimeUnavailable');
    expect(timeExports.compareTimeParts).toBe(compareTimeParts);
    expect(timeExports.isTimeUnavailable).toBe(isTimeUnavailable);
    expect(rootExports.compareTimeParts).toBe(compareTimeParts);
    expect(rootExports.isTimeUnavailable).toBe(isTimeUnavailable);
    expectTypeOf<SubpathTimeConstraintOptions>().toEqualTypeOf<TimeConstraintOptions>();
    expectTypeOf<RootTimeConstraintOptions>().toEqualTypeOf<TimeConstraintOptions>();
  });

  it('exposes zeroed fallback parts', () => {
    expect(fallbackTimeParts).toEqual({ hour: 0, minute: 0, second: 0 });
  });

  it('clamps and pads time units', () => {
    expect(clampTimeUnit(99, 0, 59)).toBe(59);
    expect(padTimeUnit(4)).toBe('04');
  });

  it('formats time strings with and without seconds', () => {
    const parts = { hour: 9, minute: 5, second: 7 };

    expect(formatTimeParts(parts, false)).toBe('09:05');
    expect(formatTimeParts(parts, true)).toBe('09:05:07');
  });

  it('parses and normalizes time strings', () => {
    expect(parseTimeValue('23:09')).toEqual({ hour: 23, minute: 9, second: 0 });
    expect(parseTimeValue('29:77:88')).toEqual({ hour: 23, minute: 59, second: 59 });
    expect(parseTimeValue('bad')).toBeNull();
  });

  it('compares time parts by hour, minute, and second', () => {
    expect(
      compareTimeParts({ hour: 8, minute: 0, second: 0 }, { hour: 9, minute: 0, second: 0 }),
    ).toBe(-1);
    expect(
      compareTimeParts({ hour: 9, minute: 0, second: 0 }, { hour: 8, minute: 59, second: 59 }),
    ).toBe(1);
    expect(
      compareTimeParts({ hour: 9, minute: 4, second: 0 }, { hour: 9, minute: 5, second: 0 }),
    ).toBe(-1);
    expect(
      compareTimeParts({ hour: 9, minute: 6, second: 0 }, { hour: 9, minute: 5, second: 59 }),
    ).toBe(1);
    expect(
      compareTimeParts({ hour: 9, minute: 5, second: 6 }, { hour: 9, minute: 5, second: 7 }),
    ).toBe(-1);
    expect(
      compareTimeParts({ hour: 9, minute: 5, second: 8 }, { hour: 9, minute: 5, second: 7 }),
    ).toBe(1);
    expect(
      compareTimeParts({ hour: 9, minute: 5, second: 7 }, { hour: 9, minute: 5, second: 7 }),
    ).toBe(0);
  });

  it('treats missing and unparseable time values as available', () => {
    const options = { minTime: '09:00', maxTime: '17:00' };

    expect(isTimeUnavailable(null, options)).toBe(false);
    expect(isTimeUnavailable(undefined, options)).toBe(false);
    expect(isTimeUnavailable('bad', options)).toBe(false);
  });

  it('applies inclusive min and max constraints to normalized time values', () => {
    const options = { minTime: '09:30', maxTime: { hour: 17, minute: 45, second: 0 } };

    expect(isTimeUnavailable('09:29:59', options)).toBe(true);
    expect(isTimeUnavailable('09:30', options)).toBe(false);
    expect(isTimeUnavailable({ hour: 17, minute: 45, second: 0 }, options)).toBe(false);
    expect(isTimeUnavailable({ hour: 17, minute: 45, second: 1 }, options)).toBe(true);
  });

  it('ignores unparseable min and max constraints', () => {
    expect(isTimeUnavailable('09:30', { minTime: 'bad', maxTime: 'also-bad' })).toBe(false);
  });

  it('applies disabled predicates to normalized time parts without mutating inputs', () => {
    const value = { hour: 29, minute: 77, second: 88 };
    const checkedTimes: { hour: number; minute: number; second: number }[] = [];

    const unavailable = isTimeUnavailable(value, {
      maxTime: '23:59:59',
      isTimeDisabled: (parts) => {
        checkedTimes.push(parts);
        return parts.hour === 23 && parts.minute === 59 && parts.second === 59;
      },
    });

    expect(unavailable).toBe(true);
    expect(checkedTimes[0]).toEqual({ hour: 23, minute: 59, second: 59 });
    expect(value).toEqual({ hour: 29, minute: 77, second: 88 });
  });

  it('maps display hours and meridiem tokens', () => {
    expect(toDisplayHour(0, '12h')).toBe(12);
    expect(toDisplayHour(15, '12h')).toBe(3);
    expect(toDisplayHour(15, '24h')).toBe(15);
    expect(toMeridiem(11)).toBe('am');
    expect(toMeridiem(12)).toBe('pm');
  });

  it('applies display hour and meridiem changes', () => {
    expect(applyDisplayHour(12, 3, '12h')).toBe(0);
    expect(applyDisplayHour(12, 15, '12h')).toBe(12);
    expect(applyDisplayHour(3, 15, '12h')).toBe(15);
    expect(applyDisplayHour(30, 0, '24h')).toBe(23);
    expect(applyMeridiem(0, 'pm')).toBe(12);
    expect(applyMeridiem(15, 'am')).toBe(3);
  });

  it('builds clock unit ranges and hour options', () => {
    expect(buildTimeUnitRange(0, 59, 15)).toEqual([0, 15, 30, 45]);
    expect(buildTimeClockHourOptions(6, '24h')).toEqual([0, 6, 12, 18]);
    expect(buildTimeClockHourOptions(3)).toEqual([12, 3, 6, 9]);
  });

  it('maps 24-hour values onto inner and outer clock rings', () => {
    expect(getTimeClockHourRing(0, '24h')).toBe('inner');
    expect(getTimeClockHourRing(12, '24h')).toBe('outer');
    expect(getTimeClockHourRing(23, '24h')).toBe('inner');
    expect(getTimeClockHourRing(23, '12h')).toBe('outer');
  });

  it('normalizes invalid clock step values to one', () => {
    expect(buildTimeUnitRange(0, 2, Number.NaN)).toEqual([0, 1, 2]);
    expect(buildTimeUnitRange(0, 2, Number.POSITIVE_INFINITY)).toEqual([0, 1, 2]);
    expect(buildTimeClockHourOptions(-1)).toEqual([12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
  });

  it('rejects non-finite range bounds without iterating indefinitely', () => {
    expect(buildTimeUnitRange(0, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY)).toEqual([]);
    expect(buildTimeUnitRange(Number.NEGATIVE_INFINITY, 59, 1)).toEqual([]);
    expect(buildTimeUnitRange(Number.NaN, 59, 1)).toEqual([]);
  });

  it('rejects finite ranges that exceed the time-unit option limit', () => {
    expect(buildTimeUnitRange(0, Number.MAX_SAFE_INTEGER, 1)).toEqual([]);
    expect(buildTimeUnitRange(0, 60, 1)).toEqual([]);
  });

  it('returns comparable clock unit values', () => {
    const parts = { hour: 15, minute: 30, second: 45 };

    expect(getTimeClockUnitValue(parts, 'hour', '24h')).toBe(15);
    expect(getTimeClockUnitValue(parts, 'hour', '12h')).toBe(3);
    expect(getTimeClockUnitValue(parts, 'minute', '24h')).toBe(30);
    expect(getTimeClockUnitValue(parts, 'second', '24h')).toBe(45);
  });

  it('maps clock face values and pointer positions', () => {
    const rect = { left: 0, top: 0, width: 200, height: 200 };

    expect(getTimeClockValueAngle(3, 'hour')).toBe(90);
    expect(getTimeClockValueAngle(44, 'minute')).toBe(264);
    expect(getTimeClockValueFromPoint(rect, 10, 100, 'minute')).toBe(45);
    expect(getTimeClockValueFromPoint(rect, 100, 10, 'hour')).toBe(12);
    expect(getTimeClockValueFromPoint(rect, 100, 10, 'hour', '24h')).toBe(12);
    expect(getTimeClockValueFromPoint(rect, 100, 70, 'hour', '24h')).toBe(0);
    expect(getTimeClockValueFromPoint(rect, 145, 22, 'hour', '24h')).toBe(1);
    expect(getTimeClockValueFromPoint(rect, 118, 69, 'hour', '24h')).toBe(13);
  });

  it('uses hysteresis when a pointer crosses the 24-hour ring boundary', () => {
    const rect = { left: 0, top: 0, width: 200, height: 200 };

    expect(getTimeClockHourRingFromPoint(rect, 100, 35)).toBe('inner');
    expect(getTimeClockHourRingFromPoint(rect, 100, 35, 'outer')).toBe('outer');
    expect(getTimeClockHourRingFromPoint(rect, 100, 25, 'inner')).toBe('outer');
  });
});
