'use client';

import {
  formatDateFormValue,
  formatDateISO,
  normalizeDateFormatOptions,
} from '@poffy-ui/behavior/date';
import { useDatePickerState } from '@poffy-ui/behavior/date/react';
import type { DateOnlyFormatOptions } from '@poffy-ui/types';
import { useMemo } from 'react';
import { useWarnInvalidControllableState } from '@/components/inputs/shared/useWarnInvalidControllableState';
import type { DatePickerValueFormat } from './DatePicker.types';

interface UseDatePickerModelOptions {
  value: Date | null | undefined;
  defaultValue: Date | null | undefined;
  onChange: ((date: Date | null) => void) | undefined;
  minDate: Date | undefined;
  maxDate: Date | undefined;
  isDateDisabled: ((date: Date) => boolean) | undefined;
  disabled: boolean;
  readOnly: boolean;
  locale: string;
  formatOptions: DateOnlyFormatOptions | undefined;
  valueFormat: DatePickerValueFormat;
}

/**
 * Normalized DatePicker selection state and representations for rendering and form submission.
 * All date values represent local calendar days; `nativeValue` is always ISO regardless of the
 * selected submitted `formValue` format.
 */
export interface DatePickerModel {
  value: Date | null;
  isControlled: boolean;
  defaultValue: Date | null;
  minDate: Date | undefined;
  maxDate: Date | undefined;
  formattedValue: string;
  formValue: string;
  nativeValue: string;
  hasUnavailableSelection: boolean;
  commitValue: (value: Date | null) => void;
  reset: () => void;
}

/**
 * Composes date-state validation with localized display and form-value formatting for DatePicker.
 *
 * The underlying behavior state rejects unavailable or interaction-blocked commits. Invalid Intl
 * formatting options fall back to `Date#toLocaleDateString`; this hook does not catch errors from a
 * custom `valueFormat` callback used while submitting.
 */
export function useDatePickerModel({
  value: controlledValue,
  defaultValue,
  onChange,
  minDate,
  maxDate,
  isDateDisabled,
  disabled,
  readOnly,
  locale,
  formatOptions,
  valueFormat,
}: UseDatePickerModelOptions): DatePickerModel {
  useWarnInvalidControllableState({
    componentName: 'DatePicker',
    value: controlledValue,
    defaultValue,
    handler: onChange,
  });

  const state = useDatePickerState({
    value: controlledValue,
    defaultValue,
    onChange,
    minDate,
    maxDate,
    isDateDisabled,
    interactionBlocked: [disabled, readOnly].some(Boolean),
  });

  const formattedValue = useMemo(() => {
    if (!state.value) return '';
    try {
      return new Intl.DateTimeFormat(locale, normalizeDateFormatOptions(formatOptions)).format(
        state.value,
      );
    } catch {
      return state.value.toLocaleDateString(locale);
    }
  }, [formatOptions, locale, state.value]);

  return {
    ...state,
    formattedValue,
    formValue: formatDateFormValue(state.value, valueFormat),
    nativeValue: state.value ? formatDateISO(state.value) : '',
  };
}
