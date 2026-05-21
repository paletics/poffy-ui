import { describe, expect, it } from 'vitest';
import {
  applyDisplayHour,
  applyMeridiem,
  buildTimeClockHourOptions,
  buildTimeUnitRange,
  clampTimeUnit,
  fallbackTimeParts,
  formatTimeParts,
  getTimeClockUnitValue,
  getTimeClockValueAngle,
  getTimeClockValueFromPoint,
  padTimeUnit,
  parseTimeValue,
  toDisplayHour,
  toMeridiem,
} from './time';

describe('time behavior helpers', () => {
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
    expect(buildTimeClockHourOptions(6, '24h')).toEqual([12, 6]);
    expect(buildTimeClockHourOptions(3)).toEqual([12, 3, 6, 9]);
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
  });
});
