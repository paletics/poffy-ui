import type { ComponentPropsWithoutRef } from 'react';
import type { TimeClockUnit as BehaviorTimeClockUnit } from '@poffy-ui/behavior/time';
import type { NumberInputSize } from '../NumberInput/NumberInput.types';

/**
 * Public size for TimeClock.
 */
export type TimeClockSize = NumberInputSize;

/**
 * Compatibility flag for callers that share props with TimePicker.
 * The analog clock face uses 12-hour options and AM/PM controls for all values.
 */
export type TimeClockFormat = '24h' | '12h';

/**
 * Editable time unit represented by a TimeClock segment.
 */
export type TimeClockUnit = BehaviorTimeClockUnit;

/**
 * Props for TimeClock.
 */
export interface TimeClockProps extends Omit<
  ComponentPropsWithoutRef<'div'>,
  'defaultValue' | 'onChange'
> {
  value?: string | null;
  defaultValue?: string | null;
  onChange?: (value: string | null) => void;
  size?: TimeClockSize;
  format?: TimeClockFormat;
  withSeconds?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  hourStep?: number;
  minuteStep?: number;
  secondStep?: number;
  name?: string;
  hourLabel?: string;
  minuteLabel?: string;
  secondLabel?: string;
  meridiemLabel?: string;
}
