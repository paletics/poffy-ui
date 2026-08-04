import { formatDateISO } from '../date';
import { formatTimeParts, parseTimeValue } from '../time';

/**
 * Formats the time portion of a Date for a time input value.
 */
export const formatDateTimeValue = (value: Date, withSeconds: boolean): string =>
  formatTimeParts(
    {
      hour: value.getHours(),
      minute: value.getMinutes(),
      second: value.getSeconds(),
    },
    withSeconds,
  );

/**
 * Formats a Date as a local `YYYY-MM-DDTHH:mm` or `YYYY-MM-DDTHH:mm:ss` value.
 *
 * Use for timezone-less local datetime form values. This intentionally does
 * not call `toISOString()`, which would shift dates through UTC.
 */
export const formatLocalDateTimeValue = (value: Date, withSeconds: boolean): string =>
  `${formatDateISO(value)}T${formatDateTimeValue(value, withSeconds)}`;

/** Serializes a combined date-time field according to its public form policy. */
export const formatDateTimeFormValue = (
  date: Date | null,
  valueFormat: 'iso-datetime' | 'iso-local' | ((date: Date) => string),
  withSeconds: boolean,
): string => {
  if (!date || !Number.isFinite(date.getTime())) return '';
  if (typeof valueFormat === 'function') return valueFormat(date);
  return valueFormat === 'iso-local'
    ? formatLocalDateTimeValue(date, withSeconds)
    : date.toISOString();
};

/**
 * Merges a selected date with the local time portion of an existing value.
 *
 * Returns `null` when no date is selected. Otherwise it creates a new `Date`, preserving the
 * base hour and minute (and optionally seconds), or using local midnight when no base is present.
 */
export const mergeDateAndTime = (
  date: Date | null | undefined,
  base: Date | null | undefined,
  withSeconds: boolean,
): Date | null => {
  if (!date) return null;

  const next = new Date(date);

  if (base) {
    next.setHours(base.getHours(), base.getMinutes(), withSeconds ? base.getSeconds() : 0, 0);
  } else {
    next.setHours(0, 0, 0, 0);
  }

  return next;
};

/**
 * Applies a parsed local time-input string to a Date value.
 *
 * Invalid or absent time input returns the original value unchanged. When the time is valid and
 * no date is supplied, the result uses the current local date; successful updates always return a
 * new `Date` with milliseconds cleared.
 */
export const mergeTimeValueIntoDate = (
  value: Date | null | undefined,
  timeValue: string | null | undefined,
  withSeconds: boolean,
): Date | null => {
  const parsed = parseTimeValue(timeValue);
  if (!parsed) {
    return value ?? null;
  }

  const next = value ? new Date(value) : new Date();
  next.setHours(parsed.hour, parsed.minute, withSeconds ? parsed.second : 0, 0);
  return next;
};
