'use client';

import React from 'react';
import { ActionMotion } from '@/components/animations/ActionMotion/ActionMotion';
import { ButtonPrimitive } from '@/components/inputs/ButtonPrimitive';
import { formatDateISO, isSameDay, normalizeDateFormatOptions } from '@poffy-ui/behavior/date';
import { CalendarDateFormatOptions, DayProps } from './Calendar.types';

interface CalendarGridProps {
  ariaDescribedBy?: string;
  weeks: Date[][];
  weekdayNames: string[];
  focusedDate?: Date;
  setHoveredDate: (date: Date | null) => void;
  handleDateSelect: (date: Date) => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  isDateUnavailable: (date: Date) => boolean;
  showOutsideDays: boolean;
  locale: string;
  dateFormatOptions?: CalendarDateFormatOptions;
  gridRef: React.RefObject<HTMLTableElement | null>;
  classes: {
    table: string;
    headCell: string;
    cell: string;
    dayButton: string;
  };
  month: number;
  monthName: string;
  readOnly?: boolean;
  today: Date;
  isSelected: (date: Date) => boolean;
  isRangeStart: (date: Date) => boolean;
  isRangeEnd: (date: Date) => boolean;
  isRangeMiddle: (date: Date) => boolean;
  isMultiselectable?: boolean;
  components?: {
    Day?: React.ComponentType<DayProps>;
  };
}

/**
 * Renders Calendar's APG-style date grid from the navigation hook's month snapshot.
 *
 * It owns `grid`/`gridcell` ARIA, one roving day-button tab stop, unavailable-day disabling, and
 * range-state data attributes. When a custom Day is supplied, it receives the same button props
 * and must spread them onto its interactive day control to retain navigation and labelling.
 */
export const CalendarGrid = ({
  ariaDescribedBy,
  weeks,
  weekdayNames,
  focusedDate,
  setHoveredDate,
  handleDateSelect,
  handleKeyDown,
  isDateUnavailable,
  showOutsideDays,
  locale,
  dateFormatOptions,
  gridRef,
  classes,
  month,
  monthName,
  readOnly,
  today,
  isSelected: isDateSelected,
  isRangeStart,
  isRangeEnd,
  isRangeMiddle,
  isMultiselectable,
  components,
}: CalendarGridProps) => {
  const CustomDay = components?.Day;

  return (
    <table
      ref={gridRef}
      className={classes.table}
      role="grid"
      onKeyDown={handleKeyDown}
      aria-label={monthName}
      aria-multiselectable={isMultiselectable || undefined}
      aria-readonly={readOnly ? true : undefined}
      onMouseLeave={() => setHoveredDate(null)}
    >
      <thead>
        <tr role="row">
          {weekdayNames.map((day, i) => (
            <th key={i} className={classes.headCell} role="columnheader" aria-label={day}>
              {day}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {weeks.map((week, wIndex) => (
          <tr key={wIndex} role="row">
            {week.map((date, dIndex) => {
              const isOutside = date.getMonth() !== month;
              const isWeekend = [0, 6].includes(date.getDay());

              if (isOutside && !showOutsideDays) {
                return (
                  <td
                    key={dIndex}
                    className={classes.cell}
                    role="gridcell"
                    data-weekend={isWeekend ? '' : undefined}
                  />
                );
              }

              const isSelected = isDateSelected(date);
              const isFocused = focusedDate ? isSameDay(date, focusedDate) : false;
              const isToday = isSameDay(date, today);
              const isDisabled = isDateUnavailable(date);

              const rangeStart = isRangeStart(date);
              const rangeEnd = isRangeEnd(date);
              const rangeMiddle = isRangeMiddle(date);

              const isRangeStartOnly = rangeStart && !rangeEnd;
              const isRangeEndOnly = rangeEnd && !rangeStart;

              const dateISO = formatDateISO(date);

              const buttonProps = {
                type: 'button' as const,
                className: classes.dayButton,
                onClick: () => handleDateSelect(date),
                onMouseEnter: () => setHoveredDate(date),
                disabled: isDisabled,
                'aria-disabled': isDisabled,
                'data-disabled': isDisabled ? '' : undefined,
                tabIndex: isFocused && !isDisabled ? 0 : -1,
                'data-selected': isSelected ? '' : undefined,
                'data-today': isToday ? '' : undefined,
                'data-outside': isOutside ? '' : undefined,
                'data-range-start': rangeStart ? '' : undefined,
                'data-range-end': rangeEnd ? '' : undefined,
                'data-range-middle': rangeMiddle ? '' : undefined,
                'data-date': dateISO,
                'aria-label': date.toLocaleDateString(
                  locale,
                  normalizeDateFormatOptions(dateFormatOptions, 'full'),
                ),
                'aria-describedby': ariaDescribedBy,
              };

              const dayButton = CustomDay ? (
                <CustomDay
                  date={date}
                  isSelected={isSelected}
                  isToday={isToday}
                  isOutside={isOutside}
                  isDisabled={!!isDisabled}
                  isRangeStart={rangeStart}
                  isRangeEnd={rangeEnd}
                  isRangeMiddle={rangeMiddle}
                  buttonProps={buttonProps}
                />
              ) : (
                <ActionMotion animationType="press" asChild>
                  <ButtonPrimitive {...buttonProps}>{date.getDate()}</ButtonPrimitive>
                </ActionMotion>
              );

              return (
                <td
                  key={dateISO}
                  className={classes.cell}
                  role="gridcell"
                  aria-selected={isSelected}
                  aria-disabled={!!isDisabled}
                  data-weekend={isWeekend ? '' : undefined}
                  data-range-start={isRangeStartOnly ? '' : undefined}
                  data-range-end={isRangeEndOnly ? '' : undefined}
                  data-range-middle={rangeMiddle ? '' : undefined}
                >
                  {dayButton}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
