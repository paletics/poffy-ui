import { describe, expect, it } from 'vitest';
import * as rootExports from '..';
import * as datetimeExports from '.';
import {
  formatDateTimeFormValue,
  formatDateTimeValue,
  formatLocalDateTimeValue,
  mergeDateAndTime,
  mergeTimeValueIntoDate,
} from './datetime';

describe('datetime behavior helpers', () => {
  it('exposes local datetime formatting from the datetime and root public surfaces', () => {
    expect(datetimeExports).toHaveProperty('formatLocalDateTimeValue');
    expect(rootExports).toHaveProperty('formatLocalDateTimeValue');
    expect(datetimeExports.formatLocalDateTimeValue).toBe(formatLocalDateTimeValue);
    expect(rootExports.formatLocalDateTimeValue).toBe(formatLocalDateTimeValue);
  });

  it('formats the time portion of a date', () => {
    const value = new Date(2026, 3, 14, 9, 5, 7);

    expect(formatDateTimeValue(value, false)).toBe('09:05');
    expect(formatDateTimeValue(value, true)).toBe('09:05:07');
  });

  it('formats local datetime values without UTC conversion', () => {
    const value = new Date(2026, 0, 2, 9, 5, 7);

    expect(formatLocalDateTimeValue(value, false)).toBe('2026-01-02T09:05');
    expect(formatLocalDateTimeValue(value, true)).toBe('2026-01-02T09:05:07');
    expect(formatLocalDateTimeValue(new Date(2026, 3, 5, 23, 30), false)).toBe('2026-04-05T23:30');
  });

  it('serializes combined form values through one policy helper', () => {
    const date = new Date(2026, 3, 5, 12, 30, 15);
    expect(formatDateTimeFormValue(date, 'iso-local', true)).toBe('2026-04-05T12:30:15');
    expect(formatDateTimeFormValue(date, 'iso-datetime', false)).toBe(date.toISOString());
    expect(formatDateTimeFormValue(null, 'iso-local', false)).toBe('');
  });

  it('merges a selected date with the base time', () => {
    const date = new Date(2026, 3, 20);
    const base = new Date(2026, 3, 14, 18, 30, 45);

    expect(mergeDateAndTime(date, base, true)).toEqual(new Date(2026, 3, 20, 18, 30, 45));
    expect(mergeDateAndTime(date, base, false)).toEqual(new Date(2026, 3, 20, 18, 30, 0));
    expect(mergeDateAndTime(date, null, false)).toEqual(new Date(2026, 3, 20, 0, 0, 0));
  });

  it('applies a time string to a date', () => {
    const base = new Date(2026, 3, 14, 9, 0, 0);

    expect(mergeTimeValueIntoDate(base, '18:45', false)).toEqual(new Date(2026, 3, 14, 18, 45, 0));
    expect(mergeTimeValueIntoDate(base, '18:45:12', true)).toEqual(
      new Date(2026, 3, 14, 18, 45, 12),
    );
    expect(mergeTimeValueIntoDate(base, 'bad', true)).toEqual(base);
  });
});
