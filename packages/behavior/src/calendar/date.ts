/**
 * Checks whether two dates represent the same calendar day in local time.
 *
 * ### Notes
 * `null` and `undefined` never match. Time-of-day, timezone offset metadata,
 * and object identity are ignored once both inputs are valid `Date` objects.
 */
export const isSameDay = (d1?: Date | null, d2?: Date | null): boolean => {
  if (!d1 || !d2) return false;
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

/**
 * Formats a date as `YYYY-MM-DD` in local time.
 *
 * ### Notes
 * Use for native date input values and hidden form fields. This intentionally
 * does not call `toISOString()`, which would shift dates through UTC.
 */
export const formatDateISO = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};
