import type { DateConstraintOptions, DateFormValueFormat } from './date.types';

const normalizeDateDay = (date: Date): Date =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

/** Returns whether a Date represents a finite calendar instant. */
export const isValidDate = (date: Date | null | undefined): date is Date => {
  if (date == null) return false;
  try {
    return Number.isFinite(Date.prototype.getTime.call(date));
  } catch {
    return false;
  }
};

/**
 * Compares two dates by local calendar day.
 *
 * Time-of-day and UTC conversion are ignored. Invalid `Date` objects are
 * outside the supported input contract.
 */
export const compareDateDay = (a: Date, b: Date): -1 | 0 | 1 => {
  const aYear = a.getFullYear();
  const bYear = b.getFullYear();
  if (aYear !== bYear) return aYear < bYear ? -1 : 1;

  const aMonth = a.getMonth();
  const bMonth = b.getMonth();
  if (aMonth !== bMonth) return aMonth < bMonth ? -1 : 1;

  const aDate = a.getDate();
  const bDate = b.getDate();
  if (aDate !== bDate) return aDate < bDate ? -1 : 1;

  return 0;
};

/**
 * Checks whether two dates represent the same calendar day in local time.
 *
 * `null` and `undefined` never match. Time-of-day, timezone offset metadata,
 * and object identity are ignored once both inputs are valid `Date` objects.
 */
export const isSameDay = (d1?: Date | null, d2?: Date | null): boolean => {
  if (!isValidDate(d1) || !isValidDate(d2)) return false;
  return compareDateDay(d1, d2) === 0;
};

/**
 * Formats a date as `YYYY-MM-DD` in local time.
 *
 * Use for native date input values and hidden form fields. This intentionally
 * does not call `toISOString()`, which would shift dates through UTC.
 */
export const formatDateISO = (date: Date): string => {
  const y = String(date.getFullYear()).padStart(4, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

/** Parses a local `YYYY-MM-DD` value without applying a UTC offset. */
export const parseDateISO = (value: string): Date | null => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const [, yearPart, monthPart, dayPart] = match;
  const year = Number(yearPart);
  const month = Number(monthPart);
  const day = Number(dayPart);
  const date = new Date(0);
  date.setFullYear(year, month - 1, day);
  date.setHours(0, 0, 0, 0);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day
    ? date
    : null;
};

/** Removes time-only fields from options used to display a calendar date. */
export const normalizeDateFormatOptions = (
  options: Intl.DateTimeFormatOptions | undefined,
  fallbackDateStyle: 'full' | 'long' | 'medium' | 'short' = 'medium',
): Intl.DateTimeFormatOptions => {
  if (!options) return { dateStyle: fallbackDateStyle };
  const {
    dateStyle,
    weekday,
    era,
    year,
    month,
    day,
    timeStyle: _timeStyle,
    hour: _hour,
    minute: _minute,
    second: _second,
    fractionalSecondDigits: _fractionalSecondDigits,
    dayPeriod: _dayPeriod,
    timeZoneName: _timeZoneName,
    timeZone: _timeZone,
    hour12: _hour12,
    hourCycle: _hourCycle,
    ...shared
  } = options;
  return dateStyle ? { ...shared, dateStyle } : { ...shared, weekday, era, year, month, day };
};

/** Serializes a date-only field according to its public form value policy. */
export const formatDateFormValue = (
  date: Date | null,
  valueFormat: DateFormValueFormat,
): string => {
  if (!isValidDate(date)) return '';
  if (typeof valueFormat === 'function') return valueFormat(date);
  return valueFormat === 'iso-datetime' ? date.toISOString() : formatDateISO(date);
};

/**
 * Returns whether a date is unavailable under date-level constraints.
 *
 * `null` and `undefined` are treated as available so clear actions can pass
 * through. `minDate` and `maxDate` are inclusive and compared by local calendar day.
 */
export const isDateUnavailable = (
  date: Date | null | undefined,
  { minDate, maxDate, isDateDisabled }: DateConstraintOptions,
): boolean => {
  if (!date) return false;
  if (!isValidDate(date)) return true;

  const day = normalizeDateDay(date);
  const minDay = isValidDate(minDate) ? normalizeDateDay(minDate) : undefined;
  const maxDay = isValidDate(maxDate) ? normalizeDateDay(maxDate) : undefined;

  if (minDay && compareDateDay(day, minDay) < 0) return true;
  if (maxDay && compareDateDay(day, maxDay) > 0) return true;
  if (isDateDisabled?.(day)) return true;
  return false;
};
