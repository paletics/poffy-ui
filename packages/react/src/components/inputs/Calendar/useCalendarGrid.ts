import { buildCalendarGrid, type CalendarGrid } from '@poffy-ui/behavior/calendar';

/**
 * Interface for grid hook result.
 */
type UseCalendarGridResult = CalendarGrid;

export const useCalendarGrid = (
  currentMonthDate: Date,
  weekStartsOn: number,
  weekdayFormatter: Intl.DateTimeFormat,
): UseCalendarGridResult => {
  return buildCalendarGrid(currentMonthDate, weekStartsOn, weekdayFormatter);
};
