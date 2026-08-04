import type { ComponentPropsWithoutRef } from 'react';
import type { TimeConstraintOptions } from '@poffy-ui/behavior/time';
import type { NumberInputSize } from '../NumberInput/NumberInput.types';
import type { InputAppearanceProp } from '@/components/inputs/inputVariant';

/** Field size for `TimePicker`. */
export type TimePickerSize = NumberInputSize;

/** Hour cycle used by `TimePicker`. */
export type TimePickerFormat = '24h' | '12h';

/** Localized default text shared by TimePicker and TimeClock. */
export interface TimePickerMessages {
  time: string;
  hours: string;
  minutes: string;
  seconds: string;
  meridiem: string;
  am: string;
  pm: string;
  unavailable: string;
}

/**
 * Input interaction mode rendered by TimePicker.
 */
export type TimePickerInputMode = 'segments' | 'clock' | 'wheel';

/** Shared props for a controlled or uncontrolled time-only field. Provide a visible or ARIA label. */
export interface TimePickerBaseProps
  extends
    Omit<
      ComponentPropsWithoutRef<'div'>,
      | 'aria-disabled'
      | 'aria-readonly'
      | 'aria-required'
      | 'defaultValue'
      | 'inputMode'
      | 'onChange'
      | 'role'
    >,
    TimeConstraintOptions {
  /** Controlled normalized value such as `"09:30"`. Reflect `onChange` to update it. */
  value?: string | null;
  /** Initial uncontrolled normalized value, restored by native form reset. */
  defaultValue?: string | null;
  /** Called after an accepted time change; unavailable candidate times are not reported. */
  onChange?: (value: string | null) => void;
  size?: TimePickerSize;
  appearance?: InputAppearanceProp;
  inputMode?: TimePickerInputMode;
  format?: TimePickerFormat;
  /** BCP 47 locale used for default labels. Overrides the nearest LocaleProvider. */
  locale?: string;
  /** Overrides localized default labels and validation text. */
  messages?: Partial<TimePickerMessages>;
  withSeconds?: boolean;
  error?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
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

/**
 * Props for a controlled or uncontrolled time-only field.
 * A controlled `value` requires `onChange` and excludes `defaultValue`; omitting it selects
 * hook-owned state that native form reset restores from `defaultValue`.
 */
export type TimePickerProps = Omit<TimePickerBaseProps, 'defaultValue' | 'onChange' | 'value'> &
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
