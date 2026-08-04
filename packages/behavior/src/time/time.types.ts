/**
 * Shared time-segment shape used by time input behavior helpers.
 */
export interface TimeParts {
  /** 24-hour clock hour; helpers normalize supplied values into 0–23 where documented. */
  hour: number;
  /** Minute; helpers normalize supplied values into 0–59 where documented. */
  minute: number;
  /** Second; helpers normalize supplied values into 0–59 where documented. */
  second: number;
}

/**
 * Options for time-level availability checks.
 */
export interface TimeConstraintOptions {
  /** Earliest available time, inclusive. Strings are parsed as local clock values. */
  minTime?: string | TimeParts;
  /** Latest available time, inclusive. Strings are parsed as local clock values. */
  maxTime?: string | TimeParts;
  /** Returns whether normalized time parts should be treated as unavailable. */
  isTimeDisabled?: (parts: TimeParts) => boolean;
}

/**
 * Supported display formats for time inputs.
 */
export type TimeFormat = '24h' | '12h';

/**
 * Meridiem token used by 12-hour time inputs.
 */
export type TimeMeridiem = 'am' | 'pm';

/**
 * Editable unit represented by an analog time clock face.
 */
export type TimeClockUnit = 'hour' | 'minute' | 'second';

/** Ring used to place an hour on a 24-hour analog clock face. */
export type TimeClockHourRing = 'inner' | 'outer';

/**
 * Rect-like shape used for clock face geometry.
 */
export interface TimeClockRect {
  /** Viewport x-coordinate of the clock face. */
  left: number;
  /** Viewport y-coordinate of the clock face. */
  top: number;
  /** Clock face width in CSS pixels. */
  width: number;
  /** Clock face height in CSS pixels. */
  height: number;
}
