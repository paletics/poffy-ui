import { describe, expect, it } from 'vitest';
import {
  getCalendarInitialSelection,
  getNextCalendarSelection,
  isCalendarDateSelected,
  isCalendarRangeEnd,
  isCalendarRangeMiddle,
  isCalendarRangeStart,
} from './selection';

describe('calendar selection helpers', () => {
  it('normalizes uncontrolled selection by mode', () => {
    expect(getCalendarInitialSelection('single', undefined)).toBeUndefined();
    expect(getCalendarInitialSelection('multiple', undefined)).toEqual([]);
  });

  it('toggles dates for multiple selection', () => {
    const date = new Date(2026, 3, 14);
    const selected = [date, new Date(2026, 3, 15)];

    expect(getNextCalendarSelection({ mode: 'multiple', selected, date })).toEqual([
      new Date(2026, 3, 15),
    ]);
  });

  it('creates and completes date ranges', () => {
    const start = new Date(2026, 3, 10);
    const end = new Date(2026, 3, 14);

    expect(getNextCalendarSelection({ mode: 'range', selected: {}, date: start })).toEqual({
      from: start,
      to: undefined,
    });

    expect(
      getNextCalendarSelection({ mode: 'range', selected: { from: end }, date: start }),
    ).toEqual({
      from: start,
      to: end,
    });
  });

  it('reports selected dates and range boundaries', () => {
    const range = { from: new Date(2026, 3, 10), to: new Date(2026, 3, 14) };

    expect(
      isCalendarDateSelected({
        mode: 'range',
        selected: range,
        date: new Date(2026, 3, 10),
      }),
    ).toBe(true);

    expect(
      isCalendarRangeStart({
        mode: 'range',
        selected: range,
        date: new Date(2026, 3, 10),
      }),
    ).toBe(true);

    expect(
      isCalendarRangeMiddle({
        mode: 'range',
        selected: range,
        date: new Date(2026, 3, 12),
      }),
    ).toBe(true);

    expect(
      isCalendarRangeEnd({
        mode: 'range',
        selected: range,
        date: new Date(2026, 3, 14),
      }),
    ).toBe(true);
  });

  it('uses hovered date for preview range boundaries', () => {
    const selected = { from: new Date(2026, 3, 14) };
    const hoveredDate = new Date(2026, 3, 10);

    expect(
      isCalendarRangeStart({
        mode: 'range',
        selected,
        hoveredDate,
        date: new Date(2026, 3, 10),
      }),
    ).toBe(true);

    expect(
      isCalendarRangeEnd({
        mode: 'range',
        selected,
        hoveredDate,
        date: new Date(2026, 3, 14),
      }),
    ).toBe(true);
  });
});
