import { useState, useCallback, useEffect, useRef } from 'react';
import {
  getInitialCalendarFocusDate,
  getInitialCalendarMonth,
  getNextCalendarFocusDate,
} from '@poffy-ui/behavior/calendar';
import { formatDateISO } from './Calendar.utils';
import { CalendarProps } from './Calendar.types';
import { useCalendarSelection } from './useCalendarSelection';
import type { UseCalendarSelectionResult } from './useCalendarSelection';

/**
 * Interface for navigation hook result.
 */
interface UseCalendarNavigationResult extends UseCalendarSelectionResult {
  currentMonthDate: Date;
  focusedDate: Date;
  setFocusedDate: (date: Date) => void;
  hoveredDate: Date | null;
  setHoveredDate: (date: Date | null) => void;
  handleMonthChange: (date: Date) => void;
  navMonth: (offset: number) => void;
  goToToday: () => void;
  handleDateSelect: (date: Date) => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  canNavPrev: boolean;
  canNavNext: boolean;
  gridRef: React.RefObject<HTMLTableElement | null>;
}

/**
 * Hook to manage calendar navigation and selection state across different modes.
 *
 * ### AI Context & Architecture
 * - Selection helpers are delegated to useCalendarSelection to keep
 * this file under 200 lines. Navigation (months, keyboard) lives here;
 * selection predicates (isSelected, isRangeStart, etc.) live in useCalendarSelection.
 */
export const useCalendarNavigation = (props: CalendarProps): UseCalendarNavigationResult => {
  const {
    selected,
    onSelect,
    mode = 'single',
    month: controlledMonth,
    onMonthChange,
    defaultMonth,
    minDate,
    maxDate,
    disabled = false,
    readOnly = false,
    isDateDisabled,
  } = props;

  const [internalMonthDate, setInternalMonthDate] = useState(
    getInitialCalendarMonth({
      mode,
      selected,
      defaultMonth,
    }),
  );
  const currentMonthDate = controlledMonth ?? internalMonthDate;

  const [focusedDate, setFocusedDate] = useState(
    getInitialCalendarFocusDate({
      mode,
      selected,
      fallbackDate: currentMonthDate,
    }),
  );

  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const gridRef = useRef<HTMLTableElement>(null);
  const isKeyboardNav = useRef<boolean>(false);

  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();

  const handleMonthChange = useCallback(
    (date: Date) => {
      if (disabled) return;
      const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
      setInternalMonthDate(firstDay);
      onMonthChange?.(firstDay);
    },
    [onMonthChange, disabled],
  );

  const navMonth = useCallback(
    (offset: number) => {
      const nextMonth = new Date(
        currentMonthDate.getFullYear(),
        currentMonthDate.getMonth() + offset,
        1,
      );
      handleMonthChange(nextMonth);
    },
    [currentMonthDate, handleMonthChange],
  );

  const goToToday = useCallback(
    (focus = true) => {
      const now = new Date();
      handleMonthChange(new Date(now.getFullYear(), now.getMonth(), 1));
      if (focus) setFocusedDate(now);
    },
    [handleMonthChange],
  );

  const selection = useCalendarSelection({
    mode,
    selected,
    onSelect,
    disabled,
    readOnly,
    minDate,
    maxDate,
    isDateDisabled,
    focusedDate,
    setFocusedDate,
    month,
    year,
    handleMonthChange,
    hoveredDate,
  });

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return;
      if (['Enter', ' '].includes(e.key)) {
        e.preventDefault();
        if (!readOnly) selection.handleDateSelect(focusedDate);
        return;
      }

      const nextDate = getNextCalendarFocusDate({
        focusedDate,
        key: e.key,
        shiftKey: e.shiftKey,
        minDate,
        maxDate,
      });

      if (nextDate) {
        e.preventDefault();
        isKeyboardNav.current = true;
        setFocusedDate(nextDate);
        if ([nextDate.getMonth() !== month, nextDate.getFullYear() !== year].some(Boolean)) {
          handleMonthChange(nextDate);
        }
      }
    },
    [focusedDate, selection, handleMonthChange, maxDate, minDate, month, year, disabled, readOnly],
  );

  useEffect(() => {
    const dateISO = formatDateISO(focusedDate);
    const button = gridRef.current?.querySelector(
      `button[data-date="${dateISO}"]`,
    ) as HTMLButtonElement | null;
    if (button && document.activeElement !== button) {
      if (
        [isKeyboardNav.current, gridRef.current?.contains(document.activeElement) ?? false].some(
          Boolean,
        )
      ) {
        button.focus();
      }
    }
    isKeyboardNav.current = false;
  }, [focusedDate]);

  const canNavPrev = minDate ? new Date(year, month, 0) >= minDate : true;
  const canNavNext = maxDate ? new Date(year, month + 1, 1) <= maxDate : true;

  return {
    currentMonthDate,
    focusedDate,
    setFocusedDate,
    hoveredDate,
    setHoveredDate,
    handleMonthChange,
    navMonth,
    goToToday,
    handleKeyDown,
    canNavPrev,
    canNavNext,
    gridRef,
    ...selection,
  };
};
