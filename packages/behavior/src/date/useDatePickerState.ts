'use client';

import { useCallback } from 'react';
import { useControllableState } from '../hooks/state';
import { isDateUnavailable, isSameDay, isValidDate } from './date';
import type {
  UseDatePickerStateOptions,
  UseDatePickerStateReturn,
} from './useDatePickerState.types';

/**
 * Owns a DatePicker's controlled or uncontrolled selection and date constraints.
 *
 * `commitValue` ignores blocked interactions, unavailable dates, and same-calendar-day updates.
 * Accepted changes update internal state only when uncontrolled and always notify `onChange`;
 * controlled callers must reflect the requested value themselves. Invalid initial constraints are
 * omitted, and invalid controlled or default values are normalized to `null`.
 */
export const useDatePickerState = ({
  defaultValue,
  interactionBlocked = false,
  isDateDisabled,
  maxDate,
  minDate,
  onChange,
  value: controlledValue,
}: UseDatePickerStateOptions): UseDatePickerStateReturn => {
  const validControlledValue =
    controlledValue === undefined
      ? undefined
      : isValidDate(controlledValue)
        ? controlledValue
        : null;
  const validDefaultValue = isValidDate(defaultValue) ? defaultValue : null;
  const validMinDate = isValidDate(minDate) ? minDate : undefined;
  const validMaxDate = isValidDate(maxDate) ? maxDate : undefined;
  const { isControlled, setValue, value } = useControllableState({
    value: validControlledValue,
    defaultValue: validDefaultValue,
  });
  const commitValue = useCallback(
    (nextValue: Date | null) => {
      if (interactionBlocked) return;
      if (
        isDateUnavailable(nextValue, {
          minDate: validMinDate,
          maxDate: validMaxDate,
          isDateDisabled,
        })
      ) {
        return;
      }
      if ((value === null && nextValue === null) || isSameDay(value, nextValue)) return;
      if (!isControlled) setValue(nextValue);
      onChange?.(nextValue);
    },
    [
      interactionBlocked,
      isControlled,
      isDateDisabled,
      onChange,
      setValue,
      validMaxDate,
      validMinDate,
      value,
    ],
  );
  const reset = useCallback(() => {
    if (!isControlled) setValue(validDefaultValue);
  }, [isControlled, setValue, validDefaultValue]);

  return {
    commitValue,
    defaultValue: validDefaultValue,
    hasUnavailableSelection: isDateUnavailable(value, {
      minDate: validMinDate,
      maxDate: validMaxDate,
      isDateDisabled,
    }),
    isControlled,
    maxDate: validMaxDate,
    minDate: validMinDate,
    reset,
    value,
  };
};
