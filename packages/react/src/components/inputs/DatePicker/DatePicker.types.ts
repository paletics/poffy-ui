import { InputVariantProps } from '@/styled-system/recipes';
import { type InputAppearance, PrimitiveProps } from '@poffy-ui/types';

/**
 * Variant types for DatePicker; mirrors Input variants for API consistency.
 */
export type DatePickerVariants = InputVariantProps;

/**
 * Public DatePicker variant props with shared input appearance names.
 */
export interface DatePickerVariantSubset extends Omit<InputVariantProps, 'variant'> {
  /** Surface treatment. */
  appearance?: InputAppearance;
  /** Legacy recipe variant alias. */
  variant?: InputVariantProps['variant'];
}

/**
 * Format used for DatePicker hidden form values.
 */
export type DatePickerValueFormat = 'iso-date' | 'iso-datetime' | ((date: Date) => string);

/**
 * Properties for the DatePicker component.
 * A composite molecule that combines an Input trigger (with calendar icon endElement)
 * and a Calendar popover.
 *
 * ### Notes
 * `value` is controlled and must be updated from `onChange`; use `defaultValue`
 * for uncontrolled initial selection. The trigger is an input, so provide a
 * visible label, `aria-label`, or `aria-labelledby`. When `name` is set, the
 * hidden form value uses `valueFormat`.
 *
 * Do: use `native` for platform date pickers in simple forms.
 * Don't: pass strings as values; DatePicker state is `Date | null`.
 *
 * @example
 * ```tsx
 * import { DatePicker } from '@poffy-ui/react/inputs';
 *
 * <DatePicker aria-label="Due date" value={dueDate} onChange={setDueDate} />
 * ```
 *
 * Related: CalendarProps for the embedded calendar API.
 * Related: DateTimePickerProps for combined date and time selection.
 */
export type DatePickerProps = Omit<
  PrimitiveProps<
    'input',
    Omit<DatePickerVariantSubset, 'error'> & {
      error?: boolean;
      /**
       * The currently selected date (controlled).
       */
      value?: Date | null;
      /**
       * The initial selected date (uncontrolled).
       */
      defaultValue?: Date | null;
      /**
       * Callback invoked when a date is selected.
       */
      onChange?: (date: Date | null) => void;
      /**
       * The BCP 47 language tag for localization (e.g., 'ja-JP').
       * @defaultValue `navigator.language`
       */
      locale?: string;
      /**
       * Options for date formatting in the trigger input.
       */
      formatOptions?: Intl.DateTimeFormatOptions;
      /**
       * Format used for the hidden form value.
       * @defaultValue `'iso-date'`
       */
      valueFormat?: DatePickerValueFormat;
      /**
       * Render a native `<input type="date">` instead of the custom calendar popover.
       * Use this when platform pickers are preferred.
       * @defaultValue `false`
       */
      native?: boolean;
    }
  >,
  'asChild' | 'type'
>;
