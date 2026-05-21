'use client';

import { forwardRef, useMemo, useEffect } from 'react';
import { Slot, Slottable } from '@radix-ui/react-slot';
import { cx } from '@/styled-system/css';
import { calendar } from '@/styled-system/recipes';
import { CalendarProps } from './Calendar.types';
import { useCalendarNavigation } from './useCalendarNavigation';
import { useCalendarGrid } from './useCalendarGrid';
import { CalendarHeader } from './CalendarHeader';
import { CalendarGrid } from './CalendarGrid';
import { CalendarHiddenInputs } from './CalendarHiddenInputs';
import { getCalendarLabels } from './Calendar.locales';
import { formatDateISO } from './Calendar.utils';
import { useCalendarControlledSelection } from './useCalendarControlledSelection';

/**
 * A highly accessible, localized calendar component for single-date, multiple-date,
 * and date-range selection. Supports controlled and uncontrolled modes via
 * `selected` and `defaultValue`.
 *
 * ### AI Context & Architecture
 * - **Tier**: Molecules
 * - **Stack**: Panda CSS (`calendar` SlotRecipe), Radix Slot, `useCalendarNavigation`,
 *   `useCalendarGrid`
 * - **Sub-components**: `CalendarHeader`, `CalendarGrid`, `CalendarHiddenInputs`
 * - **Hooks**: `useCalendarNavigation` (selection + keyboard), `useCalendarGrid` (week layout)
 *
 * ### Design Tokens
 * - **spacing**: cell padding `silver.xs`; header gap `silver.md`
 * - **sizing**: cell size uses the `silver.2` scale
 * - **color**: selected date `brand.main`; range fill `brand.subtle`; disabled `neutral.muted`
 *
 * ### Variant Logic
 * - **mode**: `'single'` (default) | `'multiple'` | `'range'`; controls the `selected` value
 *   shape and selection behavior
 * - **showYearMonthSelect**: Replaces prev/next navigation with month and year `<select>` inputs
 * - **size**: sm / md / lg; scales cell and header size uniformly
 *
 * ### Accessibility
 * - **Role**: `grid` (WAI-ARIA Grid pattern with roving tabindex)
 * - **Keyboard**: Arrow keys navigate, Enter/Space select, Page Up/Down moves months
 * - `autoFocus` programmatically focuses the current interactive date on mount
 *
 * @example Single date
 * ```tsx
 * <Calendar mode="single" onSelect={(date) => setDate(date)} />
 * ```
 *
 * @example Date range
 * ```tsx
 * <Calendar mode="range" onSelect={({ from, to }) => setRange({ from, to })} />
 * ```
 */
export const Calendar = forwardRef<HTMLDivElement, CalendarProps>((props, ref) => {
  const {
    minDate,
    maxDate,
    showOutsideDays = true,
    showYearMonthSelect = false,
    weekStartsOn = 0,
    locale = 'en-US',
    disabled = false,
    readOnly = false,
    labels,
    asChild = false,
    className,
    isDateDisabled: _isDateDisabled,
    mode = 'single',
    selected: propsSelected,
    defaultValue,
    onSelect,
    onMonthChange: _onMonthChange,
    month: _month,
    defaultMonth: _defaultMonth,
    components,
    autoFocus,
    name,
    form,
    children,
    size,
    formatOptions: _formatOptions,
    ...rest
  } = props;

  const classes = calendar({ size });

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

  const { handleSelect, selected } = useCalendarControlledSelection({
    defaultValue,
    mode,
    onSelect,
    selectedProp: propsSelected,
  });

  const {
    currentMonthDate,
    focusedDate,
    setHoveredDate,
    navMonth,
    goToToday,
    handleMonthChange,
    handleDateSelect,
    handleKeyDown,
    canNavPrev,
    canNavNext,
    gridRef,
    isDateUnavailable,
    isSelected,
    isRangeStart,
    isRangeEnd,
    isRangeMiddle,
  } = useCalendarNavigation({
    ...props,
    minDate: normalizedMinDate,
    maxDate: normalizedMaxDate,
    selected,
    onSelect: handleSelect,
  } as CalendarProps);

  const calendarLabels = useMemo(() => getCalendarLabels(locale, labels), [locale, labels]);

  const monthFormatter = useMemo(
    () => new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }),
    [locale],
  );

  const weekdayFormatter = useMemo(
    () => new Intl.DateTimeFormat(locale, { weekday: 'short' }),
    [locale],
  );

  const calendarGrid = useCalendarGrid(currentMonthDate, weekStartsOn, weekdayFormatter);

  useEffect(() => {
    if (autoFocus) {
      const dateISO = formatDateISO(focusedDate);
      const button = gridRef.current?.querySelector(
        `button[data-date="${dateISO}"]`,
      ) as HTMLButtonElement | null;
      button?.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- autofocus is intentionally a mount-only effect; subsequent focused-date changes are user navigation and must not steal focus.
  }, []);

  const Component = asChild ? Slot : 'div';

  return (
    <Component
      ref={ref}
      className={cx(classes.root, className)}
      data-disabled={disabled ? '' : undefined}
      {...rest}
    >
      <Slottable>{children}</Slottable>
      {name && (
        <CalendarHiddenInputs
          name={name}
          form={form}
          mode={mode}
          selected={selected}
          disabled={disabled}
        />
      )}
      <CalendarHeader
        currentMonthDate={currentMonthDate}
        navMonth={navMonth}
        goToToday={goToToday}
        handleMonthChange={handleMonthChange}
        canNavPrev={canNavPrev}
        canNavNext={canNavNext}
        showYearMonthSelect={showYearMonthSelect}
        locale={locale}
        minDate={normalizedMinDate}
        maxDate={normalizedMaxDate}
        classes={classes}
        monthFormatter={monthFormatter}
        labels={calendarLabels}
        disabled={disabled}
      />
      <CalendarGrid
        weeks={calendarGrid.weeks}
        weekdayNames={calendarGrid.weekdayNames}
        focusedDate={focusedDate}
        setHoveredDate={setHoveredDate}
        handleDateSelect={handleDateSelect}
        handleKeyDown={handleKeyDown}
        isDateUnavailable={isDateUnavailable}
        showOutsideDays={showOutsideDays}
        locale={locale}
        gridRef={gridRef}
        classes={classes}
        month={currentMonthDate.getMonth()}
        monthName={monthFormatter.format(currentMonthDate)}
        readOnly={readOnly}
        isSelected={isSelected}
        isRangeStart={isRangeStart}
        isRangeEnd={isRangeEnd}
        isRangeMiddle={isRangeMiddle}
        components={components}
      />
    </Component>
  );
});

Calendar.displayName = 'Calendar';
