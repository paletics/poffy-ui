'use client';

import React from 'react';
import { ActionMotion } from '@/components/animations/ActionMotion/ActionMotion';
import { ButtonPrimitive } from '@/components/inputs/ButtonPrimitive';
import { isSameDay, formatDateISO } from './Calendar.utils';
import { DayProps } from './Calendar.types';

interface CalendarGridProps {
  weeks: Date[][];
  weekdayNames: string[];
  focusedDate: Date;
  setHoveredDate: (date: Date | null) => void;
  handleDateSelect: (date: Date) => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  isDateUnavailable: (date: Date) => boolean;
  showOutsideDays: boolean;
  locale: string;
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
  isSelected: (date: Date) => boolean;
  isRangeStart: (date: Date) => boolean;
  isRangeEnd: (date: Date) => boolean;
  isRangeMiddle: (date: Date) => boolean;
  components?: {
    Day?: React.ComponentType<DayProps>;
  };
}

/**
 * Sub-component for the Calendar's grid (table) area.
 * ### AI Context & Architecture
 * - Tier: Molecules (Internal Sub-component), Stack: React, ActionMotion
 * ### Design Tokens
 * - sizes: silver.2 (button size), padding: silver.xs
 * ### Variant Logic
 * - N/A (Inherits from Calendar recipe)
 * @example <CalendarGrid {...props} />
 * ### Notes
 * Keyboard navigation relies on `gridRef` being passed. Do not use independently.
 * ### Accessibility
 * - Implements WAI-ARIA `grid`, `row`, `columnheader`, and `gridcell` roles with proper `aria-selected` and `aria-label` states.
 * ### AI Usage
 * - Internal component for Calendar to render the 42-day date table.
 */
export const CalendarGrid = ({
  weeks,
  weekdayNames,
  focusedDate,
  setHoveredDate,
  handleDateSelect,
  handleKeyDown,
  isDateUnavailable,
  showOutsideDays,
  locale,
  gridRef,
  classes,
  month,
  monthName,
  readOnly,
  isSelected: isDateSelected,
  isRangeStart,
  isRangeEnd,
  isRangeMiddle,
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
              const isFocused = isSameDay(date, focusedDate);
              const isToday = isSameDay(date, new Date());
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
                tabIndex: isFocused ? 0 : -1,
                'data-selected': isSelected ? '' : undefined,
                'data-today': isToday ? '' : undefined,
                'data-outside': isOutside ? '' : undefined,
                'data-range-start': rangeStart ? '' : undefined,
                'data-range-end': rangeEnd ? '' : undefined,
                'data-range-middle': rangeMiddle ? '' : undefined,
                'data-date': dateISO,
                'aria-label': date.toLocaleDateString(locale, { dateStyle: 'full' }),
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
