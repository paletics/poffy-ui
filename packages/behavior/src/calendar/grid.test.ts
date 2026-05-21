import { describe, expect, it } from 'vitest';
import { buildCalendarGrid } from './grid';

describe('buildCalendarGrid', () => {
  it('builds a six-week grid for the visible month', () => {
    const formatter = new Intl.DateTimeFormat('en-US', { weekday: 'short' });
    const grid = buildCalendarGrid(new Date(2026, 3, 1), 0, formatter);

    expect(grid.weeks).toHaveLength(6);
    expect(grid.weeks.flat()).toHaveLength(42);
    expect(grid.weeks[0][0]).toEqual(new Date(2026, 2, 29));
    expect(grid.weeks[5][6]).toEqual(new Date(2026, 4, 9));
  });

  it('rotates weekday names based on weekStartsOn', () => {
    const formatter = new Intl.DateTimeFormat('en-US', { weekday: 'short' });
    const grid = buildCalendarGrid(new Date(2026, 3, 1), 1, formatter);

    expect(grid.weekdayNames).toEqual(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
  });
});
