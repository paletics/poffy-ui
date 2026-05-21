'use client';

import { forwardRef, useMemo, useState } from 'react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/overlay/Popover';
import { Input } from '@/components/inputs/Input';
import { Calendar } from '@/components/inputs/Calendar';
import { CalendarIcon } from '@/components/media/Icon/icons';
import type { DatePickerProps, DatePickerValueFormat } from './DatePicker.types';
import { formatDateISO } from '../Calendar/Calendar.utils';

const parseIsoDate = (value: string) => {
  if (!value) return null;
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
};

const formatFormValue = (date: Date | null, valueFormat: DatePickerValueFormat) => {
  if (!date) return '';
  if (typeof valueFormat === 'function') return valueFormat(date);
  if (valueFormat === 'iso-datetime') return date.toISOString();
  return formatDateISO(date);
};

/**
 * A composite date selection component that pairs a read-only `Input` trigger
 * with a Calendar in a `Popover`. Supports controlled and uncontrolled modes.
 * The calendar icon is placed via `Input.endElement` and has `pointer-events: none`
 * so clicks pass through to the input trigger.
 *
 * ### AI Context & Architecture
 * - **Tier**: Molecules
 * - **Stack**: Panda CSS (via `Input` + `Calendar` + `Popover`), `Intl.DateTimeFormat`
 * - **Props**: `DatePickerProps` (extends `InputProps`)
 *
 * ### Design Tokens
 * - Delegates all visual tokens to `Input` (`variant`, `size`, `error`)
 * - Popover positioning: `bottom-start` placement by default
 *
 * ### Variant Logic
 * - **variant**: `outline` / `filled` / `flushed` — delegated directly to `Input`.
 * - **locale**: BCP 47 string (e.g., `'ja-JP'`). `Intl.DateTimeFormat` formats the displayed date.
 *
 * ### Accessibility
 * - **Role**: `combobox` on the `Input`; `aria-expanded` reflects `isOpen` state.
 * - Keyboard navigation inside the calendar is handled by `Calendar` component.
 *
 * @example
 * ```tsx
 * <DatePicker placeholder="Select date" onChange={(date) => setDate(date)} />
 * ```
 *
 * @example With locale formatting
 * ```tsx
 * <DatePicker locale="en-GB" placeholder="Select date" />
 * ```
 */
export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  (
    {
      value: controlledValue,
      defaultValue,
      onChange,
      locale,
      formatOptions,
      size,
      appearance = 'outline',
      variant,
      error,
      disabled = false,
      readOnly = false,
      className,
      placeholder = 'Select date',
      name,
      form,
      required,
      id,
      valueFormat = 'iso-date',
      native = false,
      ...props
    },
    ref,
  ) => {
    const [uncontrolledValue, setUncontrolledValue] = useState<Date | null>(defaultValue ?? null);
    const [isOpen, setIsOpen] = useState(false);

    const isControlled = controlledValue !== undefined;
    const value = isControlled ? controlledValue : uncontrolledValue;

    const commitValue = (nextValue: Date | null) => {
      if (disabled === true || readOnly === true) return;
      if (!isControlled) {
        setUncontrolledValue(nextValue);
      }
      onChange?.(nextValue);
    };

    const handleSelect = (date: Date | undefined) => {
      if (!date) return;
      commitValue(date);
      setIsOpen(false);
    };

    const formattedValue = useMemo(() => {
      if (!value) return '';
      try {
        return new Intl.DateTimeFormat(locale, {
          dateStyle: 'medium',
          ...formatOptions,
        }).format(value);
      } catch {
        return value.toLocaleDateString(locale);
      }
    }, [value, locale, formatOptions]);

    const formValue = formatFormValue(value, valueFormat);
    const nativeValue = value ? formatDateISO(value) : '';
    const nativeInputName = valueFormat === 'iso-date' ? name : undefined;
    const needsNativeHiddenInput = native && name && valueFormat !== 'iso-date';

    if (native) {
      return (
        <>
          {needsNativeHiddenInput && (
            <input
              type="hidden"
              name={name}
              value={formValue}
              form={form}
              disabled={disabled}
              readOnly
            />
          )}
          <Input
            {...props}
            ref={ref}
            id={id}
            type="date"
            name={nativeInputName}
            form={form}
            required={required}
            disabled={disabled}
            readOnly={readOnly}
            value={nativeValue}
            error={error}
            size={size}
            appearance={appearance}
            variant={variant}
            className={className}
            onChange={(event) => {
              commitValue(parseIsoDate(event.currentTarget.value));
            }}
          />
        </>
      );
    }

    return (
      <>
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
        <Popover
          open={isOpen}
          onOpenChange={(nextOpen) => {
            if (disabled === true || readOnly === true) {
              if (!nextOpen) setIsOpen(false);
              return;
            }
            setIsOpen(nextOpen);
          }}
          placement="bottom-start"
          showArrow={false}
        >
          <PopoverTrigger asChild>
            <Input
              ref={ref}
              id={id}
              role="combobox"
              aria-expanded={isOpen}
              aria-required={required ? true : undefined}
              readOnly
              disabled={disabled}
              placeholder={placeholder}
              value={formattedValue}
              error={error}
              size={size}
              appearance={appearance}
              variant={variant}
              endElement={<CalendarIcon />}
              className={className}
              data-datepicker-trigger=""
              {...props}
            />
          </PopoverTrigger>
          <PopoverContent>
            <Calendar
              selected={value ?? undefined}
              onSelect={handleSelect}
              locale={locale}
              defaultMonth={value ?? undefined}
              disabled={disabled}
              readOnly={readOnly}
            />
          </PopoverContent>
        </Popover>
      </>
    );
  },
);

DatePicker.displayName = 'DatePicker';
