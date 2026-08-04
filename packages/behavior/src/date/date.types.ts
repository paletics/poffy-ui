/**
 * Options for date-level availability checks.
 */
export interface DateConstraintOptions {
  /** Earliest available local calendar day, inclusive. Time is ignored. */
  minDate?: Date;
  /** Latest available local calendar day, inclusive. Time is ignored. */
  maxDate?: Date;
  /** Returns whether a local calendar day should be treated as unavailable. */
  isDateDisabled?: (date: Date) => boolean;
}

/** Supported date-only form serialization policies. */
export type DateFormValueFormat =
  | 'iso-date'
  | 'iso-datetime'
  | ((date: Date) => string);
