import { useCallback } from 'react';
import { isDateUnavailable as isDateUnavailableByConstraints } from '@poffy-ui/behavior/date';
import {
  getNextCalendarSelection,
  isCalendarDateSelected,
  isCalendarRangeEnd,
  isCalendarRangeMiddle,
  isCalendarRangeStart,
} from '@poffy-ui/behavior/calendar';
import type { CalendarProps, DateRange } from './Calendar.types';

interface UseCalendarSelectionOptions {
  mode: NonNullable<CalendarProps['mode']>;
  selected: CalendarProps['selected'];
  onSelect: CalendarProps['onSelect'];
  disabled: boolean;
  readOnly: boolean;
  minDate?: Date;
  maxDate?: Date;
  isDateDisabled?: (date: Date) => boolean;
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

export const useCalendarSelection = ({
  mode,
  selected,
  onSelect,
  disabled,
  readOnly,
  minDate,
  maxDate,
  isDateDisabled,
  setFocusedDate,
  month,
  year,
  handleMonthChange,
  hoveredDate,
}: UseCalendarSelectionOptions): UseCalendarSelectionResult => {
  const isDateUnavailable = useCallback(
    (date: Date) => {
      if (disabled) return true;
      return isDateUnavailableByConstraints(date, { minDate, maxDate, isDateDisabled });
    },
    [disabled, minDate, maxDate, isDateDisabled],
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
