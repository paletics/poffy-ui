import type {
  GetInitialCalendarDateOptions,
  GetNextCalendarFocusDateOptions,
} from './navigation.types';

const getSelectedAnchorDate = ({
  mode,
  selected,
}: GetInitialCalendarDateOptions): Date | undefined => {
  if (mode === 'single' && selected instanceof Date) return selected;
  if (mode === 'multiple' && Array.isArray(selected) && selected.length > 0) return selected[0];
  if (mode === 'range' && selected && typeof selected === 'object' && !Array.isArray(selected)) {
    return (selected as { from?: Date }).from;
  }
  return undefined;
};

const addMonthsClamped = (date: Date, monthDelta: number): Date => {
  const nextDate = new Date(date);
  nextDate.setDate(1);
  nextDate.setMonth(date.getMonth() + monthDelta);

  const lastDayOfTargetMonth = new Date(
    nextDate.getFullYear(),
    nextDate.getMonth() + 1,
    0,
  ).getDate();
  nextDate.setDate(Math.min(date.getDate(), lastDayOfTargetMonth));

  return nextDate;
};

/**
 * Derives the initial visible month for the calendar.
 *
 * ### Notes
 * Priority is `defaultMonth`, then the selected value's anchor date, then
 * `fallbackDate`, then the current date. The returned `Date` is not cloned when
 * it comes from caller-provided input, so React components should treat it as
 * immutable state.
 */
export const getInitialCalendarMonth = ({
  mode,
  selected,
  defaultMonth,
  fallbackDate,
}: GetInitialCalendarDateOptions): Date => {
  return (
    defaultMonth ??
    getSelectedAnchorDate({ mode, selected, defaultMonth, fallbackDate }) ??
    fallbackDate ??
    new Date()
  );
};

/**
 * Derives the initial focused date for the calendar.
 *
 * ### Notes
 * Priority is the selected value's anchor date, then `fallbackDate`, then the
 * current date. React components should use this as roving-tabindex focus state
 * and keep it synchronized with visible month navigation.
 */
export const getInitialCalendarFocusDate = ({
  mode,
  selected,
  fallbackDate,
}: Omit<GetInitialCalendarDateOptions, 'defaultMonth'>): Date => {
  return getSelectedAnchorDate({ mode, selected, fallbackDate }) ?? fallbackDate ?? new Date();
};

/**
 * Derives the next focused date for keyboard navigation.
 *
 * ### Notes
 * Handles Arrow keys by day/week, PageUp/PageDown by month, Shift+PageUp and
 * Shift+PageDown by year, and Home/End by month boundary. Returns `null` for
 * unhandled keys so components can leave unrelated keyboard behavior alone.
 * `minDate` and `maxDate` clamp the result inclusively.
 */
export const getNextCalendarFocusDate = ({
  focusedDate,
  key,
  shiftKey = false,
  minDate,
  maxDate,
}: GetNextCalendarFocusDateOptions): Date | null => {
  let nextDate = new Date(focusedDate);

  switch (key) {
    case 'ArrowLeft':
      nextDate.setDate(focusedDate.getDate() - 1);
      break;
    case 'ArrowRight':
      nextDate.setDate(focusedDate.getDate() + 1);
      break;
    case 'ArrowUp':
      nextDate.setDate(focusedDate.getDate() - 7);
      break;
    case 'ArrowDown':
      nextDate.setDate(focusedDate.getDate() + 7);
      break;
    case 'PageUp':
      nextDate = addMonthsClamped(focusedDate, -(shiftKey ? 12 : 1));
      break;
    case 'PageDown':
      nextDate = addMonthsClamped(focusedDate, shiftKey ? 12 : 1);
      break;
    case 'Home':
      nextDate.setDate(1);
      break;
    case 'End':
      nextDate.setMonth(focusedDate.getMonth() + 1, 0);
      break;
    default:
      return null;
  }

  if (minDate && nextDate < minDate) {
    return new Date(minDate);
  }

  if (maxDate && nextDate > maxDate) {
    return new Date(maxDate);
  }

  return nextDate;
};
