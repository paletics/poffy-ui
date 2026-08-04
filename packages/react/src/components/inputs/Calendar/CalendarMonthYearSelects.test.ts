import { describe, expect, it } from 'vitest';
import { getCalendarYearOptions } from './CalendarMonthYearSelects';

describe('getCalendarYearOptions', () => {
  it('centers a deterministic 201-year window on the visible year', () => {
    const years = getCalendarYearOptions(1800);

    expect(years).toHaveLength(201);
    expect(years[0]?.value).toBe('1700');
    expect(years[100]?.value).toBe('1800');
    expect(years[200]?.value).toBe('1900');
  });

  it('bounds a large range and refills the window at either edge', () => {
    const minDate = new Date(-10000, 0, 1);
    const maxDate = new Date(10000, 11, 31);

    const lowerYears = getCalendarYearOptions(-10000, minDate, maxDate);
    expect(lowerYears).toHaveLength(201);
    expect(lowerYears[0]?.value).toBe('-10000');
    expect(lowerYears[200]?.value).toBe('-9800');

    const upperYears = getCalendarYearOptions(10000, minDate, maxDate);
    expect(upperYears).toHaveLength(201);
    expect(upperYears[0]?.value).toBe('9800');
    expect(upperYears[200]?.value).toBe('10000');
  });

  it('keeps every year for a small range and guards invalid bounds', () => {
    expect(getCalendarYearOptions(2025, new Date(2020, 0, 1), new Date(2030, 0, 1))).toHaveLength(
      11,
    );
    expect(getCalendarYearOptions(2025, new Date(2030, 0, 1), new Date(2020, 0, 1))).toEqual([
      { value: '2025', label: '2025' },
    ]);
    expect(getCalendarYearOptions(2025, new Date(Number.NaN), new Date(Number.NaN))).toHaveLength(
      201,
    );
  });
});
