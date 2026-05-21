import { describe, expect, it } from 'vitest';
import {
  getInitialCalendarFocusDate,
  getInitialCalendarMonth,
  getNextCalendarFocusDate,
} from './navigation';

describe('calendar navigation helpers', () => {
  it('derives the initial month from defaultMonth or selected value', () => {
    expect(
      getInitialCalendarMonth({
        mode: 'single',
        selected: new Date(2026, 3, 14),
        defaultMonth: new Date(2026, 5, 1),
      }),
    ).toEqual(new Date(2026, 5, 1));

    expect(
      getInitialCalendarMonth({
        mode: 'range',
        selected: { from: new Date(2026, 3, 10) },
      }),
    ).toEqual(new Date(2026, 3, 10));
  });

  it('derives the initial focused date from selection or fallback', () => {
    expect(
      getInitialCalendarFocusDate({
        mode: 'multiple',
        selected: [new Date(2026, 3, 14)],
      }),
    ).toEqual(new Date(2026, 3, 14));

    expect(
      getInitialCalendarFocusDate({
        mode: 'single',
        selected: undefined,
        fallbackDate: new Date(2026, 3, 1),
      }),
    ).toEqual(new Date(2026, 3, 1));
  });

  it('computes next focused dates for handled keys and clamps to bounds', () => {
    expect(
      getNextCalendarFocusDate({
        focusedDate: new Date(2026, 3, 14),
        key: 'ArrowLeft',
      }),
    ).toEqual(new Date(2026, 3, 13));

    expect(
      getNextCalendarFocusDate({
        focusedDate: new Date(2026, 3, 14),
        key: 'PageUp',
        shiftKey: true,
      }),
    ).toEqual(new Date(2025, 3, 14));

    expect(
      getNextCalendarFocusDate({
        focusedDate: new Date(2026, 3, 14),
        key: 'ArrowLeft',
        minDate: new Date(2026, 3, 14),
      }),
    ).toEqual(new Date(2026, 3, 14));

    expect(
      getNextCalendarFocusDate({
        focusedDate: new Date(2026, 3, 14),
        key: 'Escape',
      }),
    ).toBeNull();
  });

  it('clamps month navigation to the target month end', () => {
    expect(
      getNextCalendarFocusDate({
        focusedDate: new Date(2024, 0, 31),
        key: 'PageDown',
      }),
    ).toEqual(new Date(2024, 1, 29));

    expect(
      getNextCalendarFocusDate({
        focusedDate: new Date(2023, 0, 31),
        key: 'PageDown',
      }),
    ).toEqual(new Date(2023, 1, 28));

    expect(
      getNextCalendarFocusDate({
        focusedDate: new Date(2024, 1, 29),
        key: 'PageDown',
        shiftKey: true,
      }),
    ).toEqual(new Date(2025, 1, 28));
  });

  it('applies bounds after clamped month navigation', () => {
    expect(
      getNextCalendarFocusDate({
        focusedDate: new Date(2026, 0, 31),
        key: 'PageDown',
        maxDate: new Date(2026, 1, 10),
      }),
    ).toEqual(new Date(2026, 1, 10));
  });
});
