'use client';

import { useMemo } from 'react';
import { Select } from '@/components/inputs/Select/Select';
import type { CalendarLabels } from './Calendar.types';

interface CalendarMonthYearSelectsProps {
  currentMonthDate: Date;
  disabled: boolean;
  handleMonthChange: (date: Date) => void;
  labels: CalendarLabels;
  locale: string;
  maxDate?: Date;
  minDate?: Date;
}

const MAX_YEAR_OPTIONS = 201;
const YEAR_WINDOW_RADIUS = Math.floor(MAX_YEAR_OPTIONS / 2);

const getValidYear = (date: Date | undefined) =>
  date && Number.isFinite(date.getTime()) ? date.getFullYear() : undefined;

const createYearOption = (year: number) => {
  const value = year.toString();
  return { value, label: value };
};

/**
 * Returns a bounded, contiguous year option window centered on the visible year.
 *
 * At most 201 options are emitted. Valid min/max dates constrain the window, while inconsistent
 * bounds or an invalid visible year return a conservative single option or no options rather than
 * constructing an unbounded native select.
 */
export const getCalendarYearOptions = (visibleYear: number, minDate?: Date, maxDate?: Date) => {
  const minYear = getValidYear(minDate);
  const maxYear = getValidYear(maxDate);

  if (
    !Number.isInteger(visibleYear) ||
    (minYear !== undefined && maxYear !== undefined && minYear > maxYear)
  ) {
    return Number.isInteger(visibleYear) ? [createYearOption(visibleYear)] : [];
  }

  let startYear = visibleYear - YEAR_WINDOW_RADIUS;
  let endYear = visibleYear + YEAR_WINDOW_RADIUS;

  if (minYear !== undefined) startYear = Math.max(startYear, minYear);
  if (maxYear !== undefined) endYear = Math.min(endYear, maxYear);

  if (endYear < startYear) return [createYearOption(visibleYear)];

  if (endYear - startYear + 1 < MAX_YEAR_OPTIONS) {
    if (minYear !== undefined && startYear === minYear) {
      endYear = Math.min(maxYear ?? Number.POSITIVE_INFINITY, startYear + MAX_YEAR_OPTIONS - 1);
    }
    if (maxYear !== undefined && endYear === maxYear) {
      startYear = Math.max(minYear ?? Number.NEGATIVE_INFINITY, endYear - MAX_YEAR_OPTIONS + 1);
    }
  }

  return Array.from({ length: endYear - startYear + 1 }, (_, index) => {
    return createYearOption(startYear + index);
  });
};

const clampToCalendarMonthBounds = (date: Date, minDate?: Date, maxDate?: Date) => {
  let nextDate = date;
  if (minDate) {
    const minMonth = new Date(minDate.getFullYear(), minDate.getMonth(), 1);
    if (nextDate < minMonth) nextDate = minMonth;
  }
  if (maxDate) {
    const maxMonth = new Date(maxDate.getFullYear(), maxDate.getMonth(), 1);
    if (nextDate > maxMonth) nextDate = maxMonth;
  }
  return nextDate;
};

/**
 * Renders bounded native month and year selectors for Calendar's visible month.
 *
 * Months outside min/max bounds are disabled. Every selected value is clamped to the nearest valid
 * month before it reaches Calendar navigation, so changing the year cannot temporarily escape the
 * configured range.
 */
export const CalendarMonthYearSelects = ({
  currentMonthDate,
  disabled,
  handleMonthChange,
  labels,
  locale,
  maxDate,
  minDate,
}: CalendarMonthYearSelectsProps) => {
  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();

  const months = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const date = new Date(year, i, 1);
      const lastDay = new Date(year, i + 1, 0);

      let isDisabled = false;
      if (minDate && lastDay < minDate) isDisabled = true;
      if (maxDate && date > maxDate) isDisabled = true;

      return {
        value: i.toString(),
        label: new Intl.DateTimeFormat(locale, { month: 'long' }).format(date),
        disabled: isDisabled,
      };
    });
  }, [year, locale, minDate, maxDate]);

  const years = useMemo(() => {
    return getCalendarYearOptions(year, minDate, maxDate);
  }, [year, minDate, maxDate]);

  return (
    <>
      <Select
        size="sm"
        value={month.toString()}
        onChange={(event) => {
          const nextMonth = parseInt(event.target.value, 10);
          handleMonthChange(
            clampToCalendarMonthBounds(
              new Date(currentMonthDate.getFullYear(), nextMonth, 1),
              minDate,
              maxDate,
            ),
          );
        }}
        disabled={disabled}
        aria-label={labels.selectMonth}
      >
        {months.map((item) => (
          <option key={item.value} value={item.value} disabled={item.disabled}>
            {item.label}
          </option>
        ))}
      </Select>
      <Select
        size="sm"
        value={year.toString()}
        onChange={(event) => {
          const nextYear = parseInt(event.target.value, 10);
          handleMonthChange(
            clampToCalendarMonthBounds(new Date(nextYear, month, 1), minDate, maxDate),
          );
        }}
        aria-label={labels.selectYear}
        disabled={disabled}
      >
        {years.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </Select>
    </>
  );
};
