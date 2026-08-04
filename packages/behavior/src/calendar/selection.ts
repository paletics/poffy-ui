import { compareDateDay, isSameDay, isValidDate } from '../date';
import type {
  CalendarDatePredicateOptions,
  CalendarDateRange,
  CalendarSelectionMode,
  CalendarSelectionValue,
  GetNextCalendarSelectionOptions,
} from './selection.types';

const getSelectedDates = (selected: CalendarSelectionValue): Date[] =>
  Array.isArray(selected) ? selected : [];

const getSelectedRange = (selected: CalendarSelectionValue): CalendarDateRange =>
  selected && typeof selected === 'object' && !Array.isArray(selected)
    ? (selected as CalendarDateRange)
    : {};

/** Canonicalizes external selection values by their local calendar-day identity. */
export const normalizeCalendarSelection = (
  mode: CalendarSelectionMode,
  value: CalendarSelectionValue,
): CalendarSelectionValue => {
  if (mode === 'single') return isValidDate(value as Date | undefined) ? value : undefined;
  if (mode === 'multiple') {
    if (!Array.isArray(value)) return [];
    const normalized: Date[] = [];
    let changed = false;
    for (const date of value) {
      if (!isValidDate(date) || normalized.some((candidate) => isSameDay(candidate, date))) {
        changed = true;
        continue;
      }
      normalized.push(date);
    }
    return changed ? normalized : value;
  }

  const range = getSelectedRange(value);
  const from = isValidDate(range.from) ? range.from : undefined;
  const to = isValidDate(range.to) ? range.to : undefined;
  if (!from && !to) return undefined;
  if (
    value === range &&
    from === range.from &&
    to === range.to &&
    (!from || !to || compareDateDay(from, to) <= 0)
  ) {
    return value;
  }
  if (!from || !to || compareDateDay(from, to) <= 0) return { from, to };
  return { from: to, to: from };
};

const getResolvedRange = (range: CalendarDateRange, hoveredDate?: Date | null) => {
  if (!range.from) return null;

  const to = range.to ?? hoveredDate;
  if (!to) {
    return { start: range.from, end: range.from, hasEnd: false };
  }

  return compareDateDay(range.from, to) <= 0
    ? { start: range.from, end: to, hasEnd: true }
    : { start: to, end: range.from, hasEnd: true };
};

/**
 * Normalizes uncontrolled calendar selection state by mode.
 *
 * Invalid single values become `undefined`; multiple values drop invalid or duplicate calendar
 * days, and ranges are reordered chronologically. Missing multiple-selection values become an
 * empty array so multi-select renderers can map safely; missing single/range values remain
 * `undefined`.
 */
export const getCalendarInitialSelection = (
  mode: CalendarSelectionMode,
  value: CalendarSelectionValue,
): CalendarSelectionValue => {
  return normalizeCalendarSelection(mode, value);
};

/**
 * Derives the next selection value for a calendar interaction.
 *
 * Single mode replaces the selected date. Multiple mode toggles membership by
 * local calendar day. Range mode starts a new range when empty or complete, and
 * otherwise completes the existing range in chronological order.
 */
export const getNextCalendarSelection = ({
  mode,
  selected,
  date,
}: GetNextCalendarSelectionOptions): CalendarSelectionValue => {
  if (mode === 'single') {
    return date;
  }

  if (mode === 'multiple') {
    const selectedDates = getSelectedDates(normalizeCalendarSelection(mode, selected));
    const isAlreadySelected = selectedDates.some((selectedDate) => isSameDay(selectedDate, date));

    return isAlreadySelected
      ? selectedDates.filter((selectedDate) => !isSameDay(selectedDate, date))
      : [...selectedDates, date];
  }

  const range = getSelectedRange(normalizeCalendarSelection(mode, selected));
  if (!range.from || range.to) {
    return { from: date, to: undefined };
  }

  return compareDateDay(date, range.from) < 0
    ? { from: date, to: range.from }
    : { from: range.from, to: date };
};

/**
 * Returns whether the given date is selected in the current calendar mode.
 */
export const isCalendarDateSelected = ({
  mode,
  selected,
  date,
}: CalendarDatePredicateOptions): boolean => {
  if (mode === 'single') {
    return isSameDay(date, selected as Date | null);
  }

  if (mode === 'multiple') {
    return getSelectedDates(selected).some((selectedDate) => isSameDay(selectedDate, date));
  }

  const range = getSelectedRange(selected);
  return isSameDay(date, range.from) ? true : isSameDay(date, range.to);
};

/**
 * Returns whether the given date is the start of the active range.
 */
export const isCalendarRangeStart = ({
  mode,
  selected,
  date,
  hoveredDate,
}: CalendarDatePredicateOptions): boolean => {
  if (mode !== 'range') return false;

  const resolvedRange = getResolvedRange(getSelectedRange(selected), hoveredDate);
  if (!resolvedRange) return false;

  return isSameDay(date, resolvedRange.start);
};

/**
 * Returns whether the given date is the end of the active range.
 */
export const isCalendarRangeEnd = ({
  mode,
  selected,
  date,
  hoveredDate,
}: CalendarDatePredicateOptions): boolean => {
  if (mode !== 'range') return false;

  const resolvedRange = getResolvedRange(getSelectedRange(selected), hoveredDate);
  if (!resolvedRange?.hasEnd) return false;

  return isSameDay(date, resolvedRange.end);
};

/**
 * Returns whether the given date sits inside the active range, excluding endpoints.
 *
 * Pass `hoveredDate` while the range is incomplete to preview the provisional
 * middle dates during pointer hover or keyboard exploration.
 */
export const isCalendarRangeMiddle = ({
  mode,
  selected,
  date,
  hoveredDate,
}: CalendarDatePredicateOptions): boolean => {
  if (mode !== 'range') return false;

  const resolvedRange = getResolvedRange(getSelectedRange(selected), hoveredDate);
  if (!resolvedRange?.hasEnd) return false;

  return (
    compareDateDay(date, resolvedRange.start) > 0 && compareDateDay(date, resolvedRange.end) < 0
  );
};
