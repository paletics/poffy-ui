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
  canGoToToday: boolean;
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
  isRtl: boolean;
}

/**
 * Renders Calendar's month controls and localized heading.
 *
 * Previous/next controls use logical directions for RTL, and every navigation action is disabled
 * when the month bound or Calendar disabled state disallows it. Enabling month/year selects
 * replaces the visible heading while preserving an announced month label.
 */
export const CalendarHeader = ({
  currentMonthDate,
  navMonth,
  goToToday,
  handleMonthChange,
  canNavPrev,
  canNavNext,
  canGoToToday,
  showYearMonthSelect,
  locale,
  minDate,
  maxDate,
  classes,
  monthFormatter,
  labels,
  disabled,
  isRtl,
}: CalendarHeaderProps) => {
  const previousDirection = isRtl ? 'right' : 'left';
  const nextDirection = isRtl ? 'left' : 'right';

  return (
    <header className={classes.header}>
      <div className={classes.headerLeft}>
        <DirectionalButton
          direction={previousDirection}
          data-calendar-navigation-direction={previousDirection}
          data-calendar-navigation-position="previous"
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
            disabled={[!canGoToToday, disabled].some(Boolean)}
            aria-label={labels.goToToday}
          >
            {labels.today}
          </ButtonPrimitive>
        </ActionMotion>

        <DirectionalButton
          direction={nextDirection}
          data-calendar-navigation-direction={nextDirection}
          data-calendar-navigation-position="next"
          className={classes.navButton}
          onClick={() => navMonth(1)}
          disabled={!canNavNext ? true : disabled}
          aria-label={labels.nextMonth}
        />
      </div>
    </header>
  );
};
