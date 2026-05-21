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
 * Renders the month and year selectors used by `CalendarHeader`.
 *
 * ### AI Context & Architecture
 * - **Tier**: Molecules
 * - **Stack**: Native `Select` components and `Intl.DateTimeFormat`
 * - **Props**: Current month, bounds, locale labels, and month-change callback
 *
 * ### Design Tokens
 * - **spacing**: inherited from the header select container recipe class
 * - **color**: inherited from `Select` field variants
 *
 * ### Variant Logic
 * - **minDate / maxDate**: Disable months outside the allowed range and clamp year/month changes.
 * - **disabled**: Disables both native select fields.
 *
 * ### Accessibility
 * - **Role**: native select controls
 * - **Keyboard**: Browser-native select keyboard interaction
 * - **Required**: `labels.selectMonth` and `labels.selectYear` provide accessible names.
 *
 * ### AI Usage
 * - **DO**: Keep this internal to `CalendarHeader` so date bounds stay consistent.
 * - **DON'T**: Use as a standalone month picker; it only changes the visible calendar month.
 *
 * @example Internal month/year controls
 * ```tsx
 * <CalendarMonthYearSelects currentMonthDate={date} labels={labels} />
 * ```
 *
 * @example Bounded controls
 * ```tsx
 * <CalendarMonthYearSelects currentMonthDate={date} minDate={min} maxDate={max} />
 * ```
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
    const currentYear = new Date().getFullYear();
    const startYear = minDate ? minDate.getFullYear() : currentYear - 100;
    const endYear = maxDate ? maxDate.getFullYear() : currentYear + 100;
    return Array.from({ length: endYear - startYear + 1 }, (_, index) => {
      const value = (startYear + index).toString();
      return { value, label: value };
    });
  }, [minDate, maxDate]);

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
