import { CalendarVariantProps } from '@/styled-system/recipes';
import { ComponentProps } from 'react';

/**
 * Variants for the Calendar component based on Panda CSS recipe.
 * ### AI Usage
 * - Use this when extending calendar styles.
 */
export type CalendarVariants = CalendarVariantProps;

/**
 * Localized labels for the Calendar component to ensure a11y and i18n.
 * ### AI Usage
 * - Use this to provide custom translations for internal UI strings.
 */
export interface CalendarLabels {
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

interface BaseCalendarProps
  extends
    Omit<ComponentProps<'div'>, 'onSelect' | 'onChange' | 'selected' | 'defaultValue'>,
    CalendarVariants {
  mode?: 'single' | 'multiple' | 'range';
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
  labels?: Partial<CalendarLabels>;
  formatOptions?: Intl.DateTimeFormatOptions;
  asChild?: boolean;
  name?: string;
  form?: string;
  autoFocus?: boolean;
  components?: {
    Day?: React.ComponentType<DayProps>;
  };
  defaultValue?: Date | Date[] | DateRange;
}

/**
 * Props for single date selection.
 *
 * ### Notes
 * Use this mode for one date. `selected` is controlled and `onSelect` may
 * receive `undefined` when the selection is cleared.
 */
export interface SingleCalendarProps extends BaseCalendarProps {
  /**
   * Selects one date at a time.
   *
   * @defaultValue `'single'`
   */
  mode?: 'single';
  /**
   * Controlled selected date for single selection.
   */
  selected?: Date;
  /**
   * Called when the selected date changes or is cleared.
   */
  onSelect?: (date: Date | undefined) => void;
}

/**
 * Props for multiple date selection.
 *
 * ### Notes
 * Use this mode for independent multi-date selection. Keep `selected` as a
 * stable array of Date values when controlled.
 */
export interface MultipleCalendarProps extends BaseCalendarProps {
  /**
   * Enables independent multi-date selection.
   */
  mode: 'multiple';
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

/**
 * Props for date range selection.
 *
 * ### Notes
 * Range selections use `{ from, to }`; either edge can be omitted while the user
 * is choosing the range.
 */
export interface RangeCalendarProps extends BaseCalendarProps {
  /**
   * Enables start/end range selection.
   */
  mode: 'range';
  /**
   * Controlled selected date range.
   */
  selected?: DateRange;
  /**
   * Called when the selected range changes or is cleared.
   */
  onSelect?: (range: DateRange | undefined) => void;
}

/**
 * Comprehensive properties for the Calendar component.
 *
 * ### Notes
 * Calendar renders an interactive date grid. It should be paired with a visible
 * field label, heading, or `aria-label`/`aria-labelledby` on the root depending
 * on context. Disabled dates remain visible but cannot be selected.
 *
 * Do: choose the `mode` that matches the shape of `selected` and `defaultValue`.
 * Don't: mix a range value with `mode="single"` or a single Date with
 * `mode="multiple"`.
 *
 * @example
 * ```tsx
 * import { Calendar } from '@poffy-ui/react/inputs';
 *
 * <Calendar
 *   aria-label="Appointment date"
 *   selected={date}
 *   onSelect={setDate}
 *   minDate={new Date()}
 * />
 * ```
 *
 * Related: DatePickerProps for an input-triggered calendar popover.
 * ### Formula
 * - Silver Ratio (1:1.414) is applied to all spacing variants inside the recipe.
 */
export type CalendarProps = SingleCalendarProps | MultipleCalendarProps | RangeCalendarProps;
