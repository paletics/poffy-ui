'use client';

import {
  fallbackTimeParts,
  formatTimeParts,
  parseTimeValue,
  toDisplayHour,
  toMeridiem,
  type TimeParts,
} from '@poffy-ui/behavior/time';
import { useId, useMemo, useState } from 'react';
import type { WheelPickerValue } from '../WheelPicker';
import type { TimePickerFormat } from './TimePicker.types';
import {
  applyTimeWheelValue,
  buildTimeWheelColumns,
  buildTimeWheelValue,
} from './TimePicker.wheel';

interface UseTimePickerModelOptions {
  defaultValue?: string | null;
  format: TimePickerFormat;
  hourLabel: string;
  hourStep: number;
  id?: string;
  meridiemLabel: string;
  minuteLabel: string;
  minuteStep?: number;
  onChange?: (value: string | null) => void;
  secondLabel: string;
  secondStep?: number;
  value?: string | null;
  withSeconds: boolean;
}

/**
 * Central state model for TimePicker controlled/uncontrolled behavior.
 */
export const useTimePickerModel = ({
  defaultValue,
  format,
  hourLabel,
  hourStep,
  id,
  meridiemLabel,
  minuteLabel,
  minuteStep,
  onChange,
  secondLabel,
  secondStep,
  value,
  withSeconds,
}: UseTimePickerModelOptions) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const isControlled = value !== undefined;
  const [internalParts, setInternalParts] = useState<TimeParts>(
    () => parseTimeValue(defaultValue) ?? fallbackTimeParts,
  );
  const parts = useMemo(
    () => (isControlled ? (parseTimeValue(value) ?? fallbackTimeParts) : internalParts),
    [internalParts, isControlled, value],
  );
  const displayHour = toDisplayHour(parts.hour, format);
  const meridiem = toMeridiem(parts.hour);
  const hourMin = format === '12h' ? 1 : 0;
  const hourMax = format === '12h' ? 12 : 23;
  const formattedValue = formatTimeParts(parts, withSeconds);

  const emitChange = (nextParts: TimeParts) => {
    if (!isControlled) {
      setInternalParts(nextParts);
    }
    onChange?.(formatTimeParts(nextParts, withSeconds));
  };

  const wheelColumns = useMemo(
    () =>
      buildTimeWheelColumns({
        displayHour,
        format,
        hourLabel,
        hourStep,
        meridiemLabel,
        minuteLabel,
        minuteStep,
        parts,
        secondLabel,
        secondStep,
        withSeconds,
      }),
    [
      displayHour,
      format,
      hourLabel,
      hourStep,
      meridiemLabel,
      minuteLabel,
      minuteStep,
      parts,
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
    emitChange(applyTimeWheelValue({ displayHour, format, parts, value: nextValue }));
  };

  return {
    displayHour,
    emitChange,
    formattedValue,
    hourMax,
    hourMin,
    inputId,
    meridiem,
    parts,
    handleWheelChange,
    wheelColumns,
    wheelValue,
  };
};
