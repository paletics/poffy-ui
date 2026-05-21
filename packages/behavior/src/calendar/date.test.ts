import { describe, expect, it } from 'vitest';
import { formatDateISO, isSameDay } from './date';

describe('calendar date utilities', () => {
  it('detects the same calendar day', () => {
    expect(isSameDay(new Date(2026, 3, 14, 1), new Date(2026, 3, 14, 23))).toBe(true);
    expect(isSameDay(new Date(2026, 3, 14), new Date(2026, 3, 15))).toBe(false);
  });

  it('returns false when either date is missing', () => {
    expect(isSameDay(undefined, new Date(2026, 3, 14))).toBe(false);
    expect(isSameDay(new Date(2026, 3, 14), null)).toBe(false);
  });

  it('formats a date in local YYYY-MM-DD form', () => {
    expect(formatDateISO(new Date(2026, 3, 5))).toBe('2026-04-05');
  });
});
