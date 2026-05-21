import type { WheelPickerColumn, WheelPickerValue } from '@poffy-ui/behavior/wheel-picker';
import type { ComponentPropsWithoutRef } from 'react';

/** Public size for WheelPicker. */
export type WheelPickerSize = 'sm' | 'md' | 'lg';

/** Format used for WheelPicker hidden form values. */
export type WheelPickerValueFormat = 'json' | 'entries' | ((value: WheelPickerValue) => string);

/** Re-exported behavior types used by WheelPicker. */
export type {
  WheelPickerColumn,
  WheelPickerOption,
  WheelPickerValue,
} from '@poffy-ui/behavior/wheel-picker';

/**
 * Props for a generic multi-column wheel picker.
 *
 * ### Notes
 * `columns` defines the required structure: each column has a stable `id`,
 * label, and option list. `value` is controlled and keyed by column id; use
 * `defaultValue` for uncontrolled initial selections. Provide a visible label,
 * `aria-label`, or `aria-labelledby` for the picker region.
 *
 * Do: keep every selected value present in its column options.
 * Don't: reuse the same column `id` in multiple columns.
 *
 * @example
 * ```tsx
 * import { WheelPicker } from '@poffy-ui/react/inputs';
 *
 * <WheelPicker
 *   aria-label="Duration"
 *   columns={[{ id: 'minutes', label: 'Minutes', options: [{ label: '15', value: '15' }] }]}
 *   value={duration}
 *   onChange={setDuration}
 * />
 * ```
 *
 * Related: TimePickerProps for time-specific wheel and segment modes.
 */
export interface WheelPickerProps extends Omit<
  ComponentPropsWithoutRef<'div'>,
  'defaultValue' | 'onChange'
> {
  columns: WheelPickerColumn[];
  value?: WheelPickerValue;
  defaultValue?: WheelPickerValue;
  onChange?: (value: WheelPickerValue, columnId: string) => void;
  size?: WheelPickerSize;
  disabled?: boolean;
  readOnly?: boolean;
  error?: boolean;
  loop?: boolean;
  name?: string;
  form?: string;
  valueFormat?: WheelPickerValueFormat;
}
