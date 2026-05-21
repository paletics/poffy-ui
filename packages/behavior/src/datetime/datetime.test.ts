import { describe, expect, it } from 'vitest';
import { formatDateTimeValue, mergeDateAndTime, mergeTimeValueIntoDate } from './datetime';

describe('datetime behavior helpers', () => {
  it('formats the time portion of a date', () => {
    const value = new Date(2026, 3, 14, 9, 5, 7);

    expect(formatDateTimeValue(value, false)).toBe('09:05');
    expect(formatDateTimeValue(value, true)).toBe('09:05:07');
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
