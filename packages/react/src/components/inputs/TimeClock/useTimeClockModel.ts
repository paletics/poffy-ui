'use client';

import {
  applyDisplayHour,
  applyMeridiem,
  buildTimeClockHourOptions,
  buildTimeUnitRange,
  formatTimeParts,
  getTimeClockUnitValue,
  getTimeClockValueAngle,
  toDisplayHour,
  toMeridiem,
  useControllableTimeValue,
  type TimeMeridiem,
  type TimeParts,
} from '@poffy-ui/behavior/time';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { TimeClockFormat, TimeClockProps, TimeClockUnit } from './TimeClock.types';

interface UseTimeClockModelOptions {
  defaultValue: TimeClockProps['defaultValue'];
  disabled: boolean;
  format: TimeClockFormat;
  hourStep: number;
  minuteStep: number;
  onChange: TimeClockProps['onChange'];
  readOnly: boolean;
  secondStep: number;
  value: TimeClockProps['value'];
  withSeconds: boolean;
}

export const useTimeClockModel = ({
  defaultValue,
  disabled,
  format,
  hourStep,
  minuteStep,
  onChange,
  readOnly,
  secondStep,
  value,
  withSeconds,
}: UseTimeClockModelOptions) => {
  const [activeUnit, setActiveUnit] = useState<TimeClockUnit>('hour');
  const [previewValue, setPreviewValue] = useState<number | null>(null);
  const { hasValue, isControlled, parts, resetValue, setParts } = useControllableTimeValue({
    defaultValue,
    value,
  });

  useEffect(() => {
    if (isControlled || withSeconds || parts.second === 0) return;
    setParts({ ...parts, second: 0 });
  }, [isControlled, parts, setParts, withSeconds]);

  useEffect(() => {
    if (!withSeconds && activeUnit === 'second') {
      setActiveUnit('minute');
      setPreviewValue(null);
    }
  }, [activeUnit, withSeconds]);

  const hourOptions = useMemo(
    () => buildTimeClockHourOptions(hourStep, format),
    [format, hourStep],
  );
  const minuteOptions = useMemo(() => buildTimeUnitRange(0, 59, minuteStep), [minuteStep]);
  const secondOptions = useMemo(() => buildTimeUnitRange(0, 59, secondStep), [secondStep]);
  const selectedValue = getTimeClockUnitValue(parts, activeUnit, format);
  const baseOptions =
    activeUnit === 'hour' ? hourOptions : activeUnit === 'minute' ? minuteOptions : secondOptions;
  const options = useMemo(
    () => [...new Set([...baseOptions, selectedValue])].sort((left, right) => left - right),
    [baseOptions, selectedValue],
  );

  const emitChange = useCallback(
    (nextParts: TimeParts) => {
      const nextFormattedValue = formatTimeParts(nextParts, withSeconds);
      if (hasValue && nextFormattedValue === formatTimeParts(parts, withSeconds)) return;
      if (!isControlled) setParts(nextParts);
      onChange?.(nextFormattedValue);
    },
    [hasValue, isControlled, onChange, parts, setParts, withSeconds],
  );

  const selectValue = useCallback(
    (nextValue: number, advanceUnit = true) => {
      if (disabled || readOnly) return;

      if (activeUnit === 'hour') {
        emitChange({ ...parts, hour: applyDisplayHour(nextValue, parts.hour, format) });
        if (advanceUnit) {
          setActiveUnit('minute');
        }
        return;
      }

      if (activeUnit === 'minute') {
        emitChange({ ...parts, minute: nextValue });
        if (advanceUnit && withSeconds) {
          setActiveUnit('second');
        }
        return;
      }

      emitChange({ ...parts, second: nextValue });
    },
    [activeUnit, disabled, emitChange, format, parts, readOnly, withSeconds],
  );

  const selectMeridiem = useCallback(
    (nextMeridiem: TimeMeridiem) => {
      if (disabled || readOnly) return;
      emitChange({ ...parts, hour: applyMeridiem(parts.hour, nextMeridiem) });
    },
    [disabled, emitChange, parts, readOnly],
  );

  const reset = useCallback(
    (nextDefaultValue: string | null | undefined) => {
      if (isControlled) return;
      resetValue(nextDefaultValue);
      setActiveUnit('hour');
      setPreviewValue(null);
    },
    [isControlled, resetValue],
  );

  return {
    activeUnit,
    displayHour: toDisplayHour(parts.hour, format),
    hasValue,
    isControlled,
    meridiem: toMeridiem(parts.hour),
    options,
    parts,
    previewValue,
    reset,
    selectMeridiem,
    selectValue,
    selectedAngle: `${getTimeClockValueAngle(previewValue ?? selectedValue, activeUnit)}deg`,
    selectedValue,
    setActiveUnit,
    setPreviewValue,
  };
};
