/**
 * Shared selection mode for calendar behavior helpers.
 */
export type CalendarSelectionMode = 'single' | 'multiple' | 'range';

/**
 * Date-range value used by range calendars.
 */
export interface CalendarDateRange {
  from?: Date;
  to?: Date;
}

/**
 * Shared selection value shape across calendar modes.
 *
 * ### Notes
 * Match the value shape to `CalendarSelectionMode`: `Date` for single,
 * `Date[]` for multiple, and `CalendarDateRange` for range.
 */
export type CalendarSelectionValue = Date | Date[] | CalendarDateRange | undefined;

/**
 * Input for deriving the next calendar selection value.
 */
export interface GetNextCalendarSelectionOptions {
  mode: CalendarSelectionMode;
  selected: CalendarSelectionValue;
  date: Date;
}

/**
 * Input for date-selection predicates.
 */
export interface CalendarDatePredicateOptions {
  mode: CalendarSelectionMode;
  selected: CalendarSelectionValue;
  date: Date;
  hoveredDate?: Date | null;
}
