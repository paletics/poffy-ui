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
 * Merges a selected date with the time portion of an existing value.
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
 * Applies a time-input string to a Date value.
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
