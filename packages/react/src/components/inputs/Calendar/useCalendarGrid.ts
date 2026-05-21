import { buildCalendarGrid, type CalendarGrid } from '@poffy-ui/behavior/calendar';

/**
 * Interface for grid hook result.
 */
type UseCalendarGridResult = CalendarGrid;

/**
 * Hook to compute the calendar grid and weekday names.
 * ### AI Usage
 * - Internal logic for the Calendar component.
 */
export const useCalendarGrid = (
  currentMonthDate: Date,
  weekStartsOn: number,
  weekdayFormatter: Intl.DateTimeFormat,
): UseCalendarGridResult => {
  return buildCalendarGrid(currentMonthDate, weekStartsOn, weekdayFormatter);
};
