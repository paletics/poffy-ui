import type { ComponentPropsWithoutRef } from 'react';
import type { InputAppearance } from '@poffy-ui/types';
import type { NumberInputSize, NumberInputVariant } from '../NumberInput/NumberInput.types';
import type { TimeClockFormat } from '../TimeClock/TimeClock.types';

/**
 * Public size for TimePicker.
 */
export type TimePickerSize = NumberInputSize;

/**
 * Legacy visual variant for TimePicker inputs.
 */
export type TimePickerVariant = NumberInputVariant;

/**
 * Hour cycle used by TimePicker.
 */
export type TimePickerFormat = TimeClockFormat;

/**
 * Input interaction mode rendered by TimePicker.
 */
export type TimePickerInputMode = 'segments' | 'clock' | 'wheel';

/**
 * Props for time-only input.
 *
 * ### Notes
 * Values are strings in normalized clock form, for example `"09:30"` or
 * `"09:30:15"` when `withSeconds` is true. `value` is controlled and must be
 * updated from `onChange`; use `defaultValue` for uncontrolled initial state.
 * Provide a visible label, `aria-label`, or `aria-labelledby`.
 *
 * Do: choose `inputMode="segments"` for compact keyboard entry and
 * `inputMode="wheel"` for picker-style selection.
 * Don't: pass Date objects; use DateTimePicker for date and time together.
 *
 * @example
 * ```tsx
 * import { TimePicker } from '@poffy-ui/react/inputs';
 *
 * <TimePicker aria-label="Start time" value={time} onChange={setTime} />
 * ```
 *
 * Related: DateTimePickerProps for Date-backed date and time selection.
 * Related: WheelPickerProps for generic multi-column wheel selection.
 */
export interface TimePickerProps extends Omit<
  ComponentPropsWithoutRef<'div'>,
  'defaultValue' | 'inputMode' | 'onChange'
> {
  value?: string | null;
  defaultValue?: string | null;
  onChange?: (value: string | null) => void;
  size?: TimePickerSize;
  appearance?: InputAppearance;
  variant?: TimePickerVariant;
  inputMode?: TimePickerInputMode;
  format?: TimePickerFormat;
  withSeconds?: boolean;
  error?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  hourStep?: number;
  minuteStep?: number;
  secondStep?: number;
  name?: string;
  form?: string;
  separator?: string;
  hourLabel?: string;
  minuteLabel?: string;
  secondLabel?: string;
  meridiemLabel?: string;
}
