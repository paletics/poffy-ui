/**
 * Shared time-segment shape used by time input behavior helpers.
 */
export interface TimeParts {
  hour: number;
  minute: number;
  second: number;
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

/**
 * Rect-like shape used for clock face geometry.
 */
export interface TimeClockRect {
  left: number;
  top: number;
  width: number;
  height: number;
}
