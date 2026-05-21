/**
 * Calendar month grid grouped by week rows.
 */
export interface CalendarGrid {
  /** Week rows containing dates to render for the visible month grid. */
  weeks: Date[][];
  /** Localized weekday labels aligned with the grid columns. */
  weekdayNames: string[];
}
