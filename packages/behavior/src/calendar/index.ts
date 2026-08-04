/** Builds a fixed six-week calendar grid and weekday labels for a visible month. */
export { buildCalendarGrid } from './grid';

/** Derives initial visible/focused dates and keyboard focus movement with inclusive bounds. */
export {
  getInitialCalendarFocusDate,
  getInitialCalendarMonth,
  getNextCalendarFocusDate,
} from './navigation';
/** Normalizes and evaluates single, multiple, and range calendar selection by local day. */
export {
  getCalendarInitialSelection,
  getNextCalendarSelection,
  isCalendarDateSelected,
  isCalendarRangeEnd,
  isCalendarRangeMiddle,
  isCalendarRangeStart,
  normalizeCalendarSelection,
} from './selection';
/** Re-exported calendar grid type. */
export type { CalendarGrid } from './grid.types';
/** Re-exported calendar navigation option types. */
export type {
  GetInitialCalendarDateOptions,
  GetNextCalendarFocusDateOptions,
} from './navigation.types';
/** Re-exported calendar selection types. */
export type {
  CalendarDatePredicateOptions,
  CalendarDateRange,
  CalendarSelectionMode,
  CalendarSelectionValue,
  GetNextCalendarSelectionOptions,
} from './selection.types';
