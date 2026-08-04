import type { ComponentPropsWithoutRef } from 'react';
import type { TimeClockUnit as BehaviorTimeClockUnit } from '@poffy-ui/behavior/time';
import type { NumberInputSize } from '../NumberInput/NumberInput.types';
import type { TimePickerMessages } from '../TimePicker/TimePicker.types';

/** Clock-face size for `TimeClock`. */
export type TimeClockSize = NumberInputSize;

/** Hour cycle rendered by TimeClock. The 24-hour face uses two hour rings. */
export type TimeClockFormat = '24h' | '12h';

/**
 * Editable time unit represented by a TimeClock segment.
 */
export type TimeClockUnit = BehaviorTimeClockUnit;

/** Props for a controlled or uncontrolled clock-face time field. */
export interface TimeClockBaseProps extends Omit<
  ComponentPropsWithoutRef<'div'>,
  'aria-disabled' | 'aria-readonly' | 'aria-required' | 'defaultValue' | 'onChange' | 'role'
> {
  /**
   * Controlled local `HH:mm` or `HH:mm:ss` value, or `null` for an empty clock. Reflect
   * `onChange` selections to update it.
   */
  value?: string | null;
  /** Initial uncontrolled local time value, restored by native form reset. */
  defaultValue?: string | null;
  /**
   * Called after an accepted selection with normalized `HH:mm` or `HH:mm:ss`. User selection
   * never emits `null`; use a controlled `value={null}` to clear the clock externally.
   */
  onChange?: (value: string | null) => void;
  /** Visual clock size. @defaultValue `'md'` */
  size?: TimeClockSize;
  /**
   * Clock hour cycle.
   *
   * @defaultValue `'24h'`
   */
  format?: TimeClockFormat;
  /** BCP 47 locale for default labels. Overrides the nearest LocaleProvider. */
  locale?: string;
  /** Overrides localized default labels. */
  messages?: Partial<TimePickerMessages>;
  /**
   * Adds a seconds selection unit.
   *
   * @defaultValue `false`
   */
  withSeconds?: boolean;
  /** Disabled state, including hidden form field and clock actions; FormControl supplies omission. */
  disabled?: boolean;
  /**
   * Keeps clock actions focusable but blocks selection. Required native validation is disabled
   * while read-only; FormControl supplies omission.
   */
  readOnly?: boolean;
  /** Whether a nonempty time is required through a native validation proxy. */
  required?: boolean;
  /** Whether the clock should expose an invalid state. */
  error?: boolean;
  /** Hour option increment; invalid values normalize to a positive whole increment. */
  hourStep?: number;
  /** Minute option increment; the currently selected minute remains available even off-step. */
  minuteStep?: number;
  /** Second option increment; the currently selected second remains available even off-step. */
  secondStep?: number;
  /** Name of one hidden normalized local-time form field. */
  name?: string;
  /** Associates the hidden value and validation proxy with an external form. */
  form?: string;
  hourLabel?: string;
  minuteLabel?: string;
  secondLabel?: string;
  meridiemLabel?: string;
}

/**
 * Props for a controlled or uncontrolled clock-face time field.
 *
 * Controlled use requires `onChange`; a 24-hour dial uses inner/outer rings while 12-hour mode
 * adds meridiem controls.
 */
export type TimeClockProps = Omit<TimeClockBaseProps, 'defaultValue' | 'onChange' | 'value'> &
  (
    | {
        value: string | null;
        defaultValue?: never;
        onChange: (value: string | null) => void;
      }
    | {
        value?: never;
        defaultValue?: string | null;
        onChange?: (value: string | null) => void;
      }
  );
