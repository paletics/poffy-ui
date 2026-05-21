'use client';

import {
  formatDateTimeValue,
  mergeDateAndTime,
  mergeTimeValueIntoDate,
} from '@poffy-ui/behavior/datetime';
import { cx } from '@/styled-system/css';
import { dateTimePicker } from '@/styled-system/recipes';
import { forwardRef, useMemo, useState } from 'react';
import { DatePicker } from '../DatePicker';
import { TimePicker } from '../TimePicker';
import type { DateTimePickerProps, DateTimePickerValueFormat } from './DateTimePicker.types';

const formatLocalDateTime = (date: Date, withSeconds: boolean) => {
  const dateValue = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');
  return `${dateValue}T${formatDateTimeValue(date, withSeconds)}`;
};

const formatFormValue = (
  date: Date | null,
  valueFormat: DateTimePickerValueFormat,
  withSeconds: boolean,
) => {
  if (!date) return '';
  if (typeof valueFormat === 'function') return valueFormat(date);
  if (valueFormat === 'iso-local') return formatLocalDateTime(date, withSeconds);
  return date.toISOString();
};

/**
 * Combined date and time picker for forms that need one `Date` value from separate calendar
 * and time controls.
 *
 * ### AI Context & Architecture
 * - **Tier**: Molecules
 * - **Stack**: `DatePicker`, `TimePicker`, Panda CSS (`dateTimePicker` recipe)
 * - **Props**: `DateTimePickerProps`
 *
 * ### Design Tokens
 * - **spacing**: date/time column gap comes from the `dateTimePicker` recipe
 * - **color**: delegates field colors and error state to `DatePicker` and `TimePicker`
 *
 * ### Variant Logic
 * - **appearance="outline"**: Default form field treatment.
 * - **appearance="soft"**: Maps to the filled input variant for lower emphasis.
 * - **timeInputMode**: Use `segments` for dense forms, `clock` or `wheel` for guided selection.
 *
 * ### Accessibility
 * - **Role**: grouped date and time fields.
 * - **Pattern**: Date input plus time input; each child control owns its keyboard behavior.
 * - **Required**: Provide an external label via `FormControl`, `aria-label`, or `aria-labelledby`.
 *
 * ### AI Usage
 * - **DO**: Use when a form needs one combined timestamp value.
 * - **DON'T**: Use for date-only or time-only fields; choose `DatePicker` or `TimePicker`.
 *
 * @example Combined appointment field
 * ```tsx
 * import { DateTimePicker } from '@poffy-ui/react/inputs';
 *
 * <DateTimePicker name="startsAt" onChange={(date) => setStartsAt(date)} />
 * ```
 *
 * @example Wheel time input with seconds
 * ```tsx
 * import { DateTimePicker } from '@poffy-ui/react/inputs';
 *
 * <DateTimePicker timeInputMode="wheel" withSeconds valueFormat="iso-local" />
 * ```
 */
export const DateTimePicker = forwardRef<HTMLDivElement, DateTimePickerProps>(
  (
    {
      value: valueProp,
      defaultValue,
      onChange,
      size = 'md',
      appearance = 'outline',
      variant,
      error = false,
      disabled = false,
      readOnly = false,
      locale,
      datePlaceholder = 'Select date',
      timeFormat = '24h',
      timeInputMode = 'segments',
      withSeconds = false,
      hourStep = 1,
      minuteStep = 1,
      secondStep = 1,
      name,
      form,
      valueFormat = 'iso-datetime',
      className,
      ...props
    },
    ref,
  ) => {
    const isControlled = valueProp !== undefined;
    const [internalValue, setInternalValue] = useState<Date | null>(defaultValue ?? null);

    const value = isControlled ? (valueProp ?? null) : internalValue;
    const resolvedVariant = variant ?? (appearance === 'soft' ? 'filled' : 'outline');

    const emitChange = (nextValue: Date | null) => {
      if (!isControlled) {
        setInternalValue(nextValue);
      }
      onChange?.(nextValue);
    };

    const timeValue = useMemo(
      () => (value ? formatDateTimeValue(value, withSeconds) : null),
      [value, withSeconds],
    );
    const classes = dateTimePicker();
    const formValue = formatFormValue(value, valueFormat, withSeconds);

    return (
      <div ref={ref} className={cx(classes.root, className)} {...props}>
        {name && (
          <input
            type="hidden"
            name={name}
            value={formValue}
            form={form}
            disabled={disabled}
            readOnly
          />
        )}
        <div className={classes.date}>
          <DatePicker
            value={value}
            onChange={(nextDate) => emitChange(mergeDateAndTime(nextDate, value, withSeconds))}
            locale={locale}
            placeholder={datePlaceholder}
            size={size}
            appearance={appearance}
            variant={resolvedVariant}
            error={error}
            disabled={disabled}
            readOnly={readOnly}
          />
        </div>

        <div className={classes.time}>
          <TimePicker
            value={timeValue}
            onChange={(nextTime) =>
              emitChange(mergeTimeValueIntoDate(value, nextTime, withSeconds))
            }
            size={size}
            appearance={appearance}
            variant={resolvedVariant}
            error={error}
            disabled={disabled}
            readOnly={readOnly}
            inputMode={timeInputMode}
            format={timeFormat}
            withSeconds={withSeconds}
            hourStep={hourStep}
            minuteStep={minuteStep}
            secondStep={secondStep}
          />
        </div>
      </div>
    );
  },
);

DateTimePicker.displayName = 'DateTimePicker';
