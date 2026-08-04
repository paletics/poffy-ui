import { useState, useCallback, useEffect, useRef } from 'react';
import {
  getInitialCalendarFocusDate,
  getInitialCalendarMonth,
  getNextCalendarFocusDate,
} from '@poffy-ui/behavior/calendar';
import { isDateUnavailable as isDateUnavailableByConstraints } from '@poffy-ui/behavior/date';
import { useControllableState } from '@poffy-ui/behavior/hooks';
import { formatDateISO } from './Calendar.utils';
import { CalendarProps } from './Calendar.types';
import { useCalendarSelection } from './useCalendarSelection';
import type { UseCalendarSelectionResult } from './useCalendarSelection';
import { isSameCalendarDay, resolveCalendarFocusDate } from './resolveCalendarFocusDate';

const getHydrationFallbackDate = () => new Date(2000, 0, 1);
const MAX_UNAVAILABLE_DAYS_TO_SKIP = 366 * 100;

const getDayDirection = (from: Date, to: Date) => (to.getTime() < from.getTime() ? -1 : 1);

const getNextAvailableDate = ({
  candidate,
  direction,
  isDateUnavailable,
  minDate,
  maxDate,
}: {
  candidate: Date;
  direction: -1 | 1;
  isDateUnavailable: (date: Date) => boolean;
  minDate?: Date;
  maxDate?: Date;
}): Date | undefined => {
  const date = new Date(candidate.getFullYear(), candidate.getMonth(), candidate.getDate());
  const minTime =
    minDate && new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate()).getTime();
  const maxTime =
    maxDate && new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate()).getTime();

  for (let skippedDays = 0; isDateUnavailable(date); skippedDays += 1) {
    if (skippedDays >= MAX_UNAVAILABLE_DAYS_TO_SKIP) return undefined;
    date.setDate(date.getDate() + direction);
    const time = date.getTime();
    if ((minTime !== undefined && time < minTime) || (maxTime !== undefined && time > maxTime)) {
      return undefined;
    }
  }

  return date;
};

/**
 * Interface for navigation hook result.
 */
interface UseCalendarNavigationResult extends UseCalendarSelectionResult {
  isInitialDateReady: boolean;
  today: Date;
  currentMonthDate: Date;
  focusedDate: Date | undefined;
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
  canGoToToday: boolean;
  gridRef: React.RefObject<HTMLTableElement | null>;
}

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

  const shouldSyncTodayInitially =
    controlledMonth === undefined && defaultMonth === undefined && selected === undefined;
  const shouldSyncTodayAfterHydration = useRef(shouldSyncTodayInitially);
  const [isInitialDateReady, setIsInitialDateReady] = useState(!shouldSyncTodayInitially);
  const [initialMonth] = useState(() =>
    getInitialCalendarMonth({
      mode,
      selected,
      defaultMonth,
      fallbackDate: getHydrationFallbackDate(),
    }),
  );
  const { value: currentMonthDate, setValue: setMonthDate } = useControllableState({
    value: controlledMonth,
    defaultValue: initialMonth,
  });

  const getInitialFocusCandidate = useCallback(
    () =>
      getInitialCalendarFocusDate({
        mode,
        selected,
        fallbackDate: currentMonthDate,
      }),
    [currentMonthDate, mode, selected],
  );
  const [focusedDate, setFocusedDate] = useState<Date | undefined>(() =>
    resolveCalendarFocusDate({
      currentMonthDate,
      preferredDate: getInitialCalendarFocusDate({
        mode,
        selected,
        fallbackDate: currentMonthDate,
      }),
      isDateUnavailable: (date) =>
        disabled
          ? true
          : isDateUnavailableByConstraints(date, { minDate, maxDate, isDateDisabled }),
    }),
  );

  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [today, setToday] = useState(getHydrationFallbackDate);
  const gridRef = useRef<HTMLTableElement>(null);
  const isKeyboardNav = useRef<boolean>(false);
  const hydrationFocusDateRef = useRef<Date | undefined>(undefined);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydration replaces the deterministic SSR date with the browser's current date.
    setToday(new Date());
  }, []);

  useEffect(() => {
    if (!shouldSyncTodayAfterHydration.current) return;
    shouldSyncTodayAfterHydration.current = false;

    const now = new Date();
    hydrationFocusDateRef.current = now;
    setMonthDate(new Date(now.getFullYear(), now.getMonth(), 1));
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydration synchronizes the client-only current date after deterministic SSR.
    setFocusedDate(now);
    setIsInitialDateReady(true);
  }, [setMonthDate]);

  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();

  const handleMonthChange = useCallback(
    (date: Date) => {
      if (disabled) return;
      const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
      setMonthDate(firstDay);
      onMonthChange?.(firstDay);
    },
    [disabled, onMonthChange, setMonthDate],
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

  const selection = useCalendarSelection({
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
  });
  const isSelectionDateUnavailable = selection.isDateUnavailable;

  const goToToday = useCallback(
    (focus = true) => {
      const now = new Date();
      if (disabled || isSelectionDateUnavailable(now)) return;
      handleMonthChange(new Date(now.getFullYear(), now.getMonth(), 1));
      if (focus) setFocusedDate(now);
    },
    [disabled, handleMonthChange, isSelectionDateUnavailable],
  );

  useEffect(() => {
    const nextFocusedDate = resolveCalendarFocusDate({
      currentMonthDate,
      preferredDate: hydrationFocusDateRef.current ?? focusedDate ?? getInitialFocusCandidate(),
      isDateUnavailable: selection.isDateUnavailable,
    });
    // eslint-disable-next-line react-hooks/set-state-in-effect -- controlled month changes must repair the roving focus target before interaction.
    setFocusedDate((previous) =>
      isSameCalendarDay(previous, nextFocusedDate) ? previous : nextFocusedDate,
    );
    if (
      hydrationFocusDateRef.current?.getFullYear() === currentMonthDate.getFullYear() &&
      hydrationFocusDateRef.current.getMonth() === currentMonthDate.getMonth()
    ) {
      hydrationFocusDateRef.current = undefined;
    }
  }, [currentMonthDate, focusedDate, getInitialFocusCandidate, selection.isDateUnavailable]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled || !focusedDate) return;
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
        const availableDate = getNextAvailableDate({
          candidate: nextDate,
          direction: getDayDirection(focusedDate, nextDate),
          isDateUnavailable: selection.isDateUnavailable,
          minDate,
          maxDate,
        });
        if (!availableDate) return;

        e.preventDefault();
        isKeyboardNav.current = true;
        setFocusedDate(availableDate);
        if (
          [availableDate.getMonth() !== month, availableDate.getFullYear() !== year].some(Boolean)
        ) {
          handleMonthChange(availableDate);
        }
      }
    },
    [focusedDate, selection, handleMonthChange, maxDate, minDate, month, year, disabled, readOnly],
  );

  useEffect(() => {
    if (!focusedDate) return;
    const dateISO = formatDateISO(focusedDate);
    const button = gridRef.current?.querySelector(
      `button[data-date="${dateISO}"]`,
    ) as HTMLButtonElement | null;
    const activeElement = gridRef.current?.ownerDocument.activeElement ?? null;
    if (button && activeElement !== button) {
      if (
        [isKeyboardNav.current, gridRef.current?.contains(activeElement) ?? false].some(Boolean)
      ) {
        button.focus();
      }
    }
    isKeyboardNav.current = false;
  }, [focusedDate]);

  const canNavPrev = minDate ? new Date(year, month, 0) >= minDate : true;
  const canNavNext = maxDate ? new Date(year, month + 1, 1) <= maxDate : true;
  const canGoToToday = !selection.isDateUnavailable(today);

  return {
    currentMonthDate,
    isInitialDateReady,
    today,
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
    canGoToToday,
    gridRef,
    ...selection,
  };
};
