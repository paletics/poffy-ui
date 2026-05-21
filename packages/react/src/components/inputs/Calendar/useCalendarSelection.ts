import { useCallback, useMemo } from 'react';
import {
  getNextCalendarSelection,
  isCalendarDateSelected,
  isCalendarRangeEnd,
  isCalendarRangeMiddle,
  isCalendarRangeStart,
} from '@poffy-ui/behavior/calendar';
import type { CalendarProps, DateRange } from './Calendar.types';

/**
 * Options passed from useCalendarNavigation to this hook.
 * ### AI Context & Architecture
 * - Keeping selection logic separate from navigation prevents
 * useCalendarNavigation from exceeding the 200-line limit, and lets each
 * concern be tested in isolation.
 */
interface UseCalendarSelectionOptions {
  mode: NonNullable<CalendarProps['mode']>;
  selected: CalendarProps['selected'];
  onSelect: CalendarProps['onSelect'];
  disabled: boolean;
  readOnly: boolean;
  minDate?: Date;
  maxDate?: Date;
  isDateDisabled?: (date: Date) => boolean;
  focusedDate: Date;
  setFocusedDate: (date: Date) => void;
  month: number;
  year: number;
  handleMonthChange: (date: Date) => void;
  hoveredDate: Date | null;
}

/**
 * Selection helpers returned by this hook.
 */
export interface UseCalendarSelectionResult {
  isDateUnavailable: (date: Date) => boolean;
  handleDateSelect: (date: Date) => void;
  isSelected: (date: Date) => boolean;
  isRangeStart: (date: Date) => boolean;
  isRangeEnd: (date: Date) => boolean;
  isRangeMiddle: (date: Date) => boolean;
}

/**
 * Manages date selection state and derived helpers for the Calendar component.
 * Receives navigation state as parameters to avoid cross-hook state coupling.
 *
 * ### AI Context & Architecture
 * - Extracted from useCalendarNavigation to keep file size under 200 lines.
 */
export const useCalendarSelection = ({
  mode,
  selected,
  onSelect,
  disabled,
  readOnly,
  minDate,
  maxDate,
  isDateDisabled,
  focusedDate: _focusedDate,
  setFocusedDate,
  month,
  year,
  handleMonthChange,
  hoveredDate,
}: UseCalendarSelectionOptions): UseCalendarSelectionResult => {
  const normalizedMinDate = useMemo(
    () =>
      minDate ? new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate()) : undefined,
    [minDate],
  );
  const normalizedMaxDate = useMemo(
    () =>
      maxDate ? new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate()) : undefined,
    [maxDate],
  );

  const isDateUnavailable = useCallback(
    (date: Date) => {
      if (disabled) return true;
      if (normalizedMinDate && date < normalizedMinDate) return true;
      if (normalizedMaxDate && date > normalizedMaxDate) return true;
      if (isDateDisabled?.(date)) return true;
      return false;
    },
    [disabled, normalizedMinDate, normalizedMaxDate, isDateDisabled],
  );

  const handleDateSelect = useCallback(
    (date: Date) => {
      if (disabled || readOnly) return;
      if (isDateUnavailable(date)) return;

      const nextSelection = getNextCalendarSelection({ mode, selected, date });
      (onSelect as ((value: Date | Date[] | DateRange | undefined) => void) | undefined)?.(
        nextSelection as Date | Date[] | DateRange | undefined,
      );

      setFocusedDate(date);
      if (date.getMonth() !== month || date.getFullYear() !== year) {
        handleMonthChange(date);
      }
    },
    [
      disabled,
      handleMonthChange,
      isDateUnavailable,
      mode,
      month,
      onSelect,
      readOnly,
      selected,
      setFocusedDate,
      year,
    ],
  );

  const isSelected = useCallback(
    (date: Date) => isCalendarDateSelected({ mode, selected, date }),
    [mode, selected],
  );

  const isRangeStart = useCallback(
    (date: Date) => isCalendarRangeStart({ mode, selected, date, hoveredDate }),
    [hoveredDate, mode, selected],
  );

  const isRangeEnd = useCallback(
    (date: Date) => isCalendarRangeEnd({ mode, selected, date, hoveredDate }),
    [hoveredDate, mode, selected],
  );

  const isRangeMiddle = useCallback(
    (date: Date) => isCalendarRangeMiddle({ mode, selected, date, hoveredDate }),
    [hoveredDate, mode, selected],
  );

  return {
    isDateUnavailable,
    handleDateSelect,
    isSelected,
    isRangeStart,
    isRangeEnd,
    isRangeMiddle,
  };
};
