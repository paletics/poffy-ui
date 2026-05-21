import {
  applyDisplayHour,
  applyMeridiem,
  buildTimeUnitRange,
  padTimeUnit,
  toMeridiem,
  type TimeFormat,
  type TimeParts,
} from '@poffy-ui/behavior/time';
import type { WheelPickerColumn, WheelPickerValue } from '../WheelPicker';

interface TimeWheelLabels {
  hourLabel: string;
  meridiemLabel: string;
  minuteLabel: string;
  secondLabel: string;
}

interface TimeWheelSteps {
  hourStep: number;
  minuteStep?: number;
  secondStep?: number;
}

interface BuildTimeWheelOptions extends TimeWheelLabels, TimeWheelSteps {
  displayHour: number;
  format: TimeFormat;
  parts: TimeParts;
  withSeconds: boolean;
}

interface ApplyTimeWheelValueOptions {
  displayHour: number;
  format: TimeFormat;
  parts: TimeParts;
  value: WheelPickerValue;
}

const toWheelOptions = (values: number[], currentValue: number) =>
  [...new Set([...values, currentValue])]
    .sort((a, b) => a - b)
    .map((value) => ({ value: String(value), label: padTimeUnit(value) }));

/**
 * Builds WheelPicker columns for a TimePicker value.
 */
export const buildTimeWheelColumns = ({
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
}: BuildTimeWheelOptions): WheelPickerColumn[] => {
  const columns: WheelPickerColumn[] = [
    buildHourColumn({ displayHour, format, hourLabel, hourStep }),
    buildMinuteColumn({ minuteLabel, minuteStep, parts }),
  ];

  if (withSeconds) {
    columns.push(buildSecondColumn({ parts, secondLabel, secondStep }));
  }

  if (format === '12h') {
    columns.push(buildMeridiemColumn(meridiemLabel));
  }

  return columns;
};

/**
 * Converts TimePicker parts into a WheelPicker value map.
 */
export const buildTimeWheelValue = ({
  displayHour,
  format,
  parts,
  withSeconds,
}: Pick<BuildTimeWheelOptions, 'displayHour' | 'format' | 'parts' | 'withSeconds'>) => ({
  hour: String(displayHour),
  minute: String(parts.minute),
  ...(withSeconds ? { second: String(parts.second) } : {}),
  ...(format === '12h' ? { meridiem: toMeridiem(parts.hour) } : {}),
});

/**
 * Applies a WheelPicker value map back to normalized time parts.
 */
export const applyTimeWheelValue = ({
  displayHour,
  format,
  parts,
  value,
}: ApplyTimeWheelValueOptions): TimeParts => {
  const timeValue = toTimeWheelValue(value);
  const nextDisplayHour = Number(timeValue.hour ?? displayHour);
  const nextParts: TimeParts = {
    hour: applyDisplayHour(nextDisplayHour, parts.hour, format),
    minute: Number(timeValue.minute ?? parts.minute),
    second: Number(timeValue.second ?? parts.second),
  };

  return {
    ...nextParts,
    hour:
      format === '12h'
        ? applyMeridiem(nextParts.hour, getWheelMeridiem(timeValue, parts))
        : nextParts.hour,
  };
};

const buildHourColumn = ({
  displayHour,
  format,
  hourLabel,
  hourStep,
}: Pick<BuildTimeWheelOptions, 'displayHour' | 'format' | 'hourLabel' | 'hourStep'>) => {
  const hourMin = format === '12h' ? 1 : 0;
  const hourMax = format === '12h' ? 12 : 23;

  return {
    id: 'hour',
    label: hourLabel,
    options: toWheelOptions(buildTimeUnitRange(hourMin, hourMax, hourStep), displayHour),
  };
};

const buildMinuteColumn = ({
  minuteLabel,
  minuteStep,
  parts,
}: Pick<BuildTimeWheelOptions, 'minuteLabel' | 'minuteStep' | 'parts'>) => ({
  id: 'minute',
  label: minuteLabel,
  options: toWheelOptions(buildTimeUnitRange(0, 59, minuteStep ?? 1), parts.minute),
});

const buildSecondColumn = ({
  parts,
  secondLabel,
  secondStep,
}: Pick<BuildTimeWheelOptions, 'parts' | 'secondLabel' | 'secondStep'>) => ({
  id: 'second',
  label: secondLabel,
  options: toWheelOptions(buildTimeUnitRange(0, 59, secondStep ?? 1), parts.second),
});

const buildMeridiemColumn = (meridiemLabel: string) => ({
  id: 'meridiem',
  label: meridiemLabel,
  options: [
    { value: 'am', label: 'AM' },
    { value: 'pm', label: 'PM' },
  ],
});

const toTimeWheelValue = (value: WheelPickerValue) =>
  value as Partial<Record<'hour' | 'minute' | 'second' | 'meridiem', string>>;

const getWheelMeridiem = (value: ReturnType<typeof toTimeWheelValue>, parts: TimeParts) =>
  value.meridiem === 'am' || value.meridiem === 'pm' ? value.meridiem : toMeridiem(parts.hour);
