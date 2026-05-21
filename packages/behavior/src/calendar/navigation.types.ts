import type { CalendarSelectionMode, CalendarSelectionValue } from './selection.types';

/**
 * Input for deriving initial calendar navigation dates.
 */
export interface GetInitialCalendarDateOptions {
  /** Calendar selection mode used to read the selected anchor shape. */
  mode: CalendarSelectionMode;
  /** Current or initial selected value to derive the anchor from. */
  selected: CalendarSelectionValue;
  /** Explicit initial visible month; takes priority over selected anchors. */
  defaultMonth?: Date;
  /** Stable fallback date used when no selected/default month is available. */
  fallbackDate?: Date;
}

/**
 * Input for deriving the next focused date from a keyboard event.
 */
export interface GetNextCalendarFocusDateOptions {
  /** Current roving-focus date. */
  focusedDate: Date;
  /** Keyboard event key value to interpret. */
  key: string;
  /**
   * Whether PageUp/PageDown should move by year instead of month.
   *
   * @defaultValue `false`
   */
  shiftKey?: boolean;
  /** Inclusive lower focus boundary. */
  minDate?: Date;
  /** Inclusive upper focus boundary. */
  maxDate?: Date;
}
