import type { CalendarVariantProps } from '@/styled-system/recipes';
import type { DateOnlyFormatOptions, NativeProps } from '@poffy-ui/types';
import type { ComponentProps } from 'react';

/** Visual recipe options for `Calendar`. */
export type CalendarVariants = CalendarVariantProps;

/**
 * Date-only Intl options accepted for Calendar day button labels.
 *
 * `dateStyle` and individual date components are mutually exclusive, matching
 * `Intl.DateTimeFormat`. Time and time-zone options are intentionally excluded
 * because Calendar represents local calendar days without a time of day.
 */
export type CalendarDateFormatOptions = DateOnlyFormatOptions;

/** Localized labels used by `Calendar`. */
export interface CalendarLabels {
  /** Accessible fallback name for the calendar control. */
  calendar?: string;
  /** Native validation message for an unavailable selected date. */
  unavailable: string;
  /** Display text for the "Today" button. */
  today: string;
  /** Accessibility label for the "Go to today" button. */
  goToToday: string;
  /** Accessibility label for the "Previous month" button. */
  previousMonth: string;
  /** Accessibility label for the "Next month" button. */
  nextMonth: string;
  /** Accessibility label for the Month selector. */
  selectMonth: string;
  /** Accessibility label for the Year selector. */
  selectYear: string;
}

/**
 * Props for custom day rendering.
 */
export interface DayProps {
  /** The date for this cell. */
  date: Date;
  /** Whether the date is currently selected. */
  isSelected: boolean;
  /** Whether the date is today. */
  isToday: boolean;
  /** Whether the date is outside the current month. */
  isOutside: boolean;
  /** Whether the date is disabled. */
  isDisabled: boolean;
  /** Whether the date is in the middle of a range selection. */
  isRangeMiddle?: boolean;
  /** Whether the date is the start of a range selection. */
  isRangeStart?: boolean;
  /** Whether the date is the end of a range selection. */
  isRangeEnd?: boolean;
  /** Standard button props to spread onto the custom component. */
  buttonProps: ComponentProps<'button'>;
}

/**
 * Shared Calendar props.
 *
 * Every `Date` accepted or emitted by Calendar represents a local calendar
 * day: only its local year, month, and day are used. For SSR, do not pass a
 * UTC-midnight instant such as `new Date('2026-04-14')` when server and client
 * time zones can differ. Preserve a `YYYY-MM-DD` value and construct
 * `new Date(year, month - 1, day)` in each environment instead.
 */
interface BaseCalendarProps
  extends
    Omit<NativeProps<'div'>, 'defaultValue' | 'onChange' | 'onSelect' | 'role' | 'selected'>,
    CalendarVariants {
  month?: Date;
  onMonthChange?: (date: Date) => void;
  defaultMonth?: Date;
  minDate?: Date;
  maxDate?: Date;
  showOutsideDays?: boolean;
  showYearMonthSelect?: boolean;
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  isDateDisabled?: (date: Date) => boolean;
  locale?: string;
  disabled?: boolean;
  readOnly?: boolean;
  /** Whether a completed date selection is required for native form validation. */
  required?: boolean;
  labels?: Partial<CalendarLabels>;
  /**
   * Formatting options for each day button's accessible date label.
   * The visible month heading and weekday names remain locale-standard so grid
   * navigation stays recognizable.
   */
  formatOptions?: CalendarDateFormatOptions;
  name?: string;
  form?: string;
  autoFocus?: boolean;
  components?: {
    Day?: React.ComponentType<DayProps>;
  };
}

/** Props for single-date selection. */
export interface SingleCalendarProps extends BaseCalendarProps {
  /**
   * Selects one date at a time.
   *
   * @defaultValue `'single'`
   */
  mode?: 'single';
  /** Initial selected date for uncontrolled single selection. */
  defaultValue?: Date;
  /**
   * Controlled selected date for single selection.
   */
  selected?: Date;
  /**
   * Called when the selected date changes or is cleared.
   */
  onSelect?: (date: Date | undefined) => void;
}

/** Props for independent multi-date selection. */
export interface MultipleCalendarProps extends BaseCalendarProps {
  /**
   * Enables independent multi-date selection.
   */
  mode: 'multiple';
  /** Initial selected dates for uncontrolled multiple selection. */
  defaultValue?: Date[];
  /**
   * Controlled selected dates.
   */
  selected?: Date[];
  /**
   * Called when the selected date array changes or is cleared.
   */
  onSelect?: (dates: Date[] | undefined) => void;
}

/**
 * Props for date range selection.
 */
export interface DateRange {
  /**
   * Inclusive start date for the selected range.
   */
  from?: Date;
  /**
   * Inclusive end date for the selected range.
   */
  to?: Date;
}

/** Props for range selection; either edge may be omitted while the range is incomplete. */
export interface RangeCalendarProps extends BaseCalendarProps {
  /**
   * Enables start/end range selection.
   */
  mode: 'range';
  /** Initial selected range for uncontrolled range selection. */
  defaultValue?: DateRange;
  /**
   * Controlled selected date range.
   */
  selected?: DateRange;
  /**
   * Called when the selected range changes or is cleared.
   */
  onSelect?: (range: DateRange | undefined) => void;
}

/** Discriminated props for one Calendar selection mode. Provide a visible or ARIA label. */
export type CalendarProps = SingleCalendarProps | MultipleCalendarProps | RangeCalendarProps;
