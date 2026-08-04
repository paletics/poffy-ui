import type { ComponentPropsWithoutRef } from 'react';
import type {
  TimePickerFormat,
  TimePickerInputMode,
  TimePickerSize,
} from '../TimePicker/TimePicker.types';
import type { TimePickerMessages } from '../TimePicker/TimePicker.types';
import type { DatePickerMessages } from '../DatePicker/DatePicker.types';
import type { InputAppearanceProp } from '@/components/inputs/inputVariant';

/**
 * Format used for DateTimePicker hidden form values.
 *
 * `iso-datetime` submits `Date#toISOString()` in UTC. `iso-local` submits a
 * timezone-less local `YYYY-MM-DDTHH:mm` value, including seconds when
 * `withSeconds` is enabled.
 */
export type DateTimePickerValueFormat = 'iso-datetime' | 'iso-local' | ((date: Date) => string);

/** Shared props for a controlled or uncontrolled local date-and-time field. */
export interface DateTimePickerBaseProps extends Omit<
  ComponentPropsWithoutRef<'div'>,
  'defaultValue' | 'onChange' | 'role' | 'aria-disabled' | 'aria-readonly' | 'aria-required'
> {
  /** Controlled value. Reflect `onChange` to update it. */
  value?: Date | null;
  /** Initial uncontrolled value, restored by native form reset. */
  defaultValue?: Date | null;
  /** Called after an accepted merged date or time change. */
  onChange?: (value: Date | null) => void;
  size?: TimePickerSize;
  appearance?: InputAppearanceProp;
  error?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  locale?: string;
  /** Overrides localized defaults used by the composed date field. */
  dateMessages?: Partial<DatePickerMessages>;
  /** Overrides localized defaults used by the composed time field. */
  timeMessages?: Partial<TimePickerMessages>;
  /**
   * Earliest selectable date for the date field, inclusive.
   * The time portion is ignored; time editing is guarded by the resulting date.
   */
  minDate?: Date;
  /**
   * Latest selectable date for the date field, inclusive.
   * The time portion is ignored; time editing is guarded by the resulting date.
   */
  maxDate?: Date;
  /**
   * Returns whether a date is unavailable in the date field.
   * Applies to both date selection and emitted dates from time changes.
   */
  isDateDisabled?: (date: Date) => boolean;
  datePlaceholder?: string;
  dateAriaLabel?: string;
  timeAriaLabel?: string;
  timeFormat?: TimePickerFormat;
  timeInputMode?: TimePickerInputMode;
  withSeconds?: boolean;
  /**
   * Disables time controls until a date has been selected.
   *
   * Set to `false` to allow time-first editing with today's local date.
   *
   * @defaultValue true
   */
  requireDateBeforeTime?: boolean;
  hourStep?: number;
  minuteStep?: number;
  secondStep?: number;
  name?: string;
  form?: string;
  valueFormat?: DateTimePickerValueFormat;
}

/**
 * Props for a controlled or uncontrolled local date-and-time field.
 *
 * A controlled `value` requires `onChange` and excludes `defaultValue`; omitting `value` selects
 * hook-owned state whose `defaultValue` is restored on native form reset. Runtime input that
 * bypasses this union with an unpaired value follows the shared controllable-state warning and
 * fallback behavior.
 */
export type DateTimePickerProps = Omit<
  DateTimePickerBaseProps,
  'defaultValue' | 'onChange' | 'value'
> &
  (
    | {
        value: Date | null;
        defaultValue?: never;
        onChange: (value: Date | null) => void;
      }
    | {
        value?: never;
        defaultValue?: Date | null;
        onChange?: (value: Date | null) => void;
      }
  );
