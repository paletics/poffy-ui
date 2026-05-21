'use client';

import { ActionMotion } from '@/components/animations/ActionMotion/ActionMotion';
import { ButtonPrimitive } from '@/components/inputs/ButtonPrimitive';
import { DirectionalButton } from '@/components/inputs/DirectionalButton';
import { CalendarLabels } from './Calendar.types';
import { CalendarMonthYearSelects } from './CalendarMonthYearSelects';

interface CalendarHeaderProps {
  currentMonthDate: Date;
  navMonth: (offset: number) => void;
  goToToday: () => void;
  handleMonthChange: (date: Date) => void;
  canNavPrev: boolean;
  canNavNext: boolean;
  showYearMonthSelect: boolean;
  locale: string;
  minDate?: Date;
  maxDate?: Date;
  classes: {
    header: string;
    headerLeft?: string;
    headerRight?: string;
    navButton: string;
    selectContainer: string;
    title: string;
    todayButton: string;
  };
  monthFormatter: Intl.DateTimeFormat;
  labels: CalendarLabels;
  disabled: boolean;
}

/**
 * Sub-component for the Calendar's header/navigation area.
 * ### AI Context & Architecture
 * - Tier: Molecules (Internal Sub-component), Stack: React, ActionMotion, Select
 * ### Design Tokens
 * - spacing: silver.md (header margin), silver.xs (select gap)
 * ### Variant Logic
 * - N/A (Inherits from Calendar recipe)
 * @example <CalendarHeader {...props} />
 * ### Notes
 * Do not use independently. This is tightly coupled with `useCalendarNavigation`.
 * ### Accessibility
 * - Uses `aria-live` for month announcements and proper `aria-label` for navigation buttons.
 * ### AI Usage
 * - Internal component for Calendar to manage the header section and month/year dropdowns.
 */
export const CalendarHeader = ({
  currentMonthDate,
  navMonth,
  goToToday,
  handleMonthChange,
  canNavPrev,
  canNavNext,
  showYearMonthSelect,
  locale,
  minDate,
  maxDate,
  classes,
  monthFormatter,
  labels,
  disabled,
}: CalendarHeaderProps) => {
  return (
    <header className={classes.header}>
      <div className={classes.headerLeft}>
        <DirectionalButton
          direction="left"
          className={classes.navButton}
          onClick={() => navMonth(-1)}
          disabled={!canNavPrev ? true : disabled}
          aria-label={labels.previousMonth}
        />
      </div>

      <div className={classes.selectContainer}>
        {showYearMonthSelect ? (
          <CalendarMonthYearSelects
            currentMonthDate={currentMonthDate}
            disabled={disabled}
            handleMonthChange={handleMonthChange}
            labels={labels}
            locale={locale}
            minDate={minDate}
            maxDate={maxDate}
          />
        ) : (
          <div className={classes.title} aria-live="polite">
            {monthFormatter.format(currentMonthDate)}
          </div>
        )}

        {showYearMonthSelect && (
          <span className="sr-only" aria-live="polite">
            {monthFormatter.format(currentMonthDate)}
          </span>
        )}
      </div>

      <div className={classes.headerRight}>
        <ActionMotion animationType="press" asChild>
          <ButtonPrimitive
            className={classes.todayButton}
            onClick={goToToday}
            disabled={disabled}
            aria-label={labels.goToToday}
          >
            {labels.today}
          </ButtonPrimitive>
        </ActionMotion>

        <DirectionalButton
          direction="right"
          className={classes.navButton}
          onClick={() => navMonth(1)}
          disabled={!canNavNext ? true : disabled}
          aria-label={labels.nextMonth}
        />
      </div>
    </header>
  );
};
