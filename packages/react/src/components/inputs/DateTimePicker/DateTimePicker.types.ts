import type { ComponentPropsWithoutRef } from 'react';
import type { InputAppearance } from '@poffy-ui/types';
import type {
  TimePickerFormat,
  TimePickerInputMode,
  TimePickerSize,
  TimePickerVariant,
} from '../TimePicker/TimePicker.types';

/**
 * Format used for DateTimePicker hidden form values.
 */
export type DateTimePickerValueFormat = 'iso-datetime' | 'iso-local' | ((date: Date) => string);

/**
 * Props for a combined date and time picker.
 *
 * ### Notes
 * `value` is controlled and must be updated from `onChange`; use `defaultValue`
 * for uncontrolled initial selection. The date and time fields share one
 * `Date | null` value. Provide a visible label, `aria-label`, or
 * `aria-labelledby` on the containing form field.
 *
 * Do: set `name` when the chosen DateTime should submit with a form.
 * Don't: pass ISO strings directly; convert them to Date objects first.
 *
 * @example
 * ```tsx
 * import { DateTimePicker } from '@poffy-ui/react/inputs';
 *
 * <DateTimePicker aria-label="Starts at" value={startsAt} onChange={setStartsAt} />
 * ```
 *
 * Related: DatePickerProps for date-only selection.
 * Related: TimePickerProps for time-only selection.
 */
export interface DateTimePickerProps extends Omit<
  ComponentPropsWithoutRef<'div'>,
  'defaultValue' | 'onChange'
> {
  value?: Date | null;
  defaultValue?: Date | null;
  onChange?: (value: Date | null) => void;
  size?: TimePickerSize;
  appearance?: InputAppearance;
  variant?: TimePickerVariant;
  error?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  locale?: string;
  datePlaceholder?: string;
  timeFormat?: TimePickerFormat;
  timeInputMode?: TimePickerInputMode;
  withSeconds?: boolean;
  hourStep?: number;
  minuteStep?: number;
  secondStep?: number;
  name?: string;
  form?: string;
  valueFormat?: DateTimePickerValueFormat;
}
