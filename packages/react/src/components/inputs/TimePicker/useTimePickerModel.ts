'use client';

import {
  formatTimeParts,
  isTimeUnavailable,
  toDisplayHour,
  toMeridiem,
  type TimeConstraintOptions,
  type TimeParts,
} from '@poffy-ui/behavior/time';
import { useControllableTimeValue } from '@poffy-ui/behavior/time';
import { useEffect, useId, useMemo } from 'react';
import type { WheelPickerValue } from '../WheelPicker';
import type { TimePickerFormat } from './TimePicker.types';
import {
  applyTimeWheelValue,
  buildTimeWheelColumns,
  buildTimeWheelValue,
} from './TimePicker.wheel';

interface UseTimePickerModelOptions extends TimeConstraintOptions {
  amLabel: string;
  defaultValue?: string | null;
  format: TimePickerFormat;
  hourLabel: string;
  hourStep: number;
  id?: string;
  meridiemLabel: string;
  minuteLabel: string;
  minuteStep?: number;
  onChange?: (value: string | null) => void;
  pmLabel: string;
  secondLabel: string;
  secondStep?: number;
  value?: string | null;
  withSeconds: boolean;
}

/**
 * Central state model for TimePicker controlled/uncontrolled behavior.
 *
 * It normalizes display hour and meridiem without changing the canonical 24-hour parts, zeros
 * seconds when `withSeconds` is disabled, and rejects unavailable candidates before calling
 * `onChange`. Wheel values and columns are derived from the same canonical parts, retaining the
 * current value even if it is not aligned with the configured step.
 */
export const useTimePickerModel = ({
  amLabel,
  defaultValue,
  format,
  hourLabel,
  hourStep,
  id,
  meridiemLabel,
  minuteLabel,
  minuteStep,
  minTime,
  maxTime,
  onChange,
  pmLabel,
  secondLabel,
  secondStep,
  isTimeDisabled,
  value,
  withSeconds,
}: UseTimePickerModelOptions) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const { hasValue, isControlled, parts, resetValue, setParts } = useControllableTimeValue({
    defaultValue,
    value,
  });
  const displayHour = toDisplayHour(parts.hour, format);
  const meridiem = toMeridiem(parts.hour);
  const hourMin = format === '12h' ? 1 : 0;
  const hourMax = format === '12h' ? 12 : 23;
  const formattedValue = formatTimeParts(parts, withSeconds);
  useEffect(() => {
    if (isControlled || withSeconds || parts.second === 0) return;
    setParts({ ...parts, second: 0 });
  }, [isControlled, parts, setParts, withSeconds]);
  const emitChange = (nextParts: TimeParts) => {
    const emittedParts = withSeconds ? nextParts : { ...nextParts, second: 0 };
    if (isTimeUnavailable(emittedParts, { minTime, maxTime, isTimeDisabled })) return false;

    const nextFormattedValue = formatTimeParts(emittedParts, withSeconds);
    if (hasValue && nextFormattedValue === formattedValue) return false;
    if (!isControlled) {
      setParts(emittedParts);
    }
    onChange?.(nextFormattedValue);
    return true;
  };

  const wheelColumns = useMemo(
    () =>
      buildTimeWheelColumns({
        amLabel,
        displayHour,
        format,
        hourLabel,
        hourStep,
        meridiemLabel,
        minuteLabel,
        minuteStep,
        parts,
        pmLabel,
        secondLabel,
        secondStep,
        withSeconds,
      }),
    [
      amLabel,
      displayHour,
      format,
      hourLabel,
      hourStep,
      meridiemLabel,
      minuteLabel,
      minuteStep,
      parts,
      pmLabel,
      secondLabel,
      secondStep,
      withSeconds,
    ],
  );
  const wheelValue = useMemo(
    () => buildTimeWheelValue({ displayHour, format, parts, withSeconds }),
    [displayHour, format, parts, withSeconds],
  );
  const handleWheelChange = (nextValue: WheelPickerValue) => {
    return emitChange(applyTimeWheelValue({ displayHour, format, parts, value: nextValue }));
  };

  return {
    displayHour,
    emitChange,
    formattedValue,
    hasValue,
    hourMax,
    hourMin,
    inputId,
    isControlled,
    meridiem,
    parts,
    resetValue,
    handleWheelChange,
    wheelColumns,
    wheelValue,
  };
};
