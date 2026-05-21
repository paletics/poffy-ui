import type { CalendarGrid } from './grid.types';

/**
 * Builds the visible six-week calendar grid and localized weekday labels.
 *
 * ### Notes
 * The grid always contains 42 dates grouped into six rows, including leading
 * and trailing dates from adjacent months. `weekStartsOn` follows
 * `Date#getDay()` numbering (`0` Sunday through `6` Saturday). React calendar
 * components should add disabled, selected, today, and outside-month semantics
 * when rendering each date cell.
 */
export const buildCalendarGrid = (
  currentMonthDate: Date,
  weekStartsOn: number,
  weekdayFormatter: Intl.DateTimeFormat,
): CalendarGrid => {
  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const startDayOfWeek = firstDayOfMonth.getDay();

  const skipDays = (startDayOfWeek - weekStartsOn + 7) % 7;

  const prevMonthLastDay = new Date(year, month, 0);
  const prevMonthDays: Date[] = [];
  for (let i = skipDays - 1; i >= 0; i--) {
    prevMonthDays.push(new Date(year, month - 1, prevMonthLastDay.getDate() - i));
  }

  const currentMonthDays: Date[] = [];
  for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
    currentMonthDays.push(new Date(year, month, i));
  }

  const daysSoFar = prevMonthDays.length + currentMonthDays.length;
  const remainingDays = 42 - daysSoFar;
  const nextMonthDays: Date[] = [];
  for (let i = 1; i <= remainingDays; i++) {
    nextMonthDays.push(new Date(year, month + 1, i));
  }

  const allDays = [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
  const weekRows: Date[][] = [];
  for (let i = 0; i < allDays.length; i += 7) {
    weekRows.push(allDays.slice(i, i + 7));
  }

  const weekdayNames = Array.from({ length: 7 }, (_, i) =>
    weekdayFormatter.format(new Date(2000, 0, ((i + weekStartsOn) % 7) + 2)),
  );

  return { weeks: weekRows, weekdayNames };
};
