/**
 * Shared selection mode for calendar behavior helpers.
 */
export type CalendarSelectionMode = 'single' | 'multiple' | 'range';

/**
 * Date-range value used by range calendars.
 */
export interface CalendarDateRange {
  /** Inclusive range start, which may be the only value while the user is choosing an end. */
  from?: Date;
  /** Inclusive range end; normalized selection reorders it after `from`. */
  to?: Date;
}

/**
 * Shared selection value shape across calendar modes.
 *
 * Match the value shape to `CalendarSelectionMode`: `Date` for single,
 * `Date[]` for multiple, and `CalendarDateRange` for range.
 */
export type CalendarSelectionValue = Date | Date[] | CalendarDateRange | undefined;

/**
 * Input for deriving the next calendar selection value.
 */
export interface GetNextCalendarSelectionOptions {
  /** Selection behavior to apply. */
  mode: CalendarSelectionMode;
  /** Existing value; it is normalized before multiple/range changes. */
  selected: CalendarSelectionValue;
  /** Newly activated local calendar day. */
  date: Date;
}

/**
 * Input for date-selection predicates.
 */
export interface CalendarDatePredicateOptions {
  /** Selection behavior to inspect. */
  mode: CalendarSelectionMode;
  /** Current selection value. */
  selected: CalendarSelectionValue;
  /** Calendar day to test. */
  date: Date;
  /** Provisional end used to preview an incomplete range. */
  hoveredDate?: Date | null;
}
