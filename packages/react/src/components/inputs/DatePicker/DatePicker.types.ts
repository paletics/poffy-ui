import type { InputVariantProps } from '@/styled-system/recipes';
import type { DateOnlyFormatOptions, PrimitiveProps } from '@poffy-ui/types';
import type { InputAppearanceProp } from '@/components/inputs/inputVariant';
import type { FormEventHandler, ReactElement, RefAttributes } from 'react';

/**
 * Public visual props for DatePicker; mirrors Input for API consistency.
 */
export type DatePickerVariants = DatePickerVariantSubset;

/**
 * Public DatePicker variant props with shared input appearance names.
 */
export interface DatePickerVariantSubset extends Omit<InputVariantProps, 'variant'> {
  /** Surface treatment. */
  appearance?: InputAppearanceProp;
}

/**
 * Format used for DatePicker hidden form values.
 */
export type DatePickerValueFormat = 'iso-date' | 'iso-datetime' | ((date: Date) => string);

/** Localized default text used by DatePicker. */
export interface DatePickerMessages {
  /** Generic name for a date field. */
  date: string;
  /** Default empty-value hint. */
  placeholder: string;
  /** Accessible name for the calendar dialog. */
  calendar: string;
  /** Native validation message for an unavailable selected date. */
  unavailable: string;
}

/** Shared props for native and custom date fields. Use a `Date` constructed in the target local day. */
interface DatePickerOwnProps extends Omit<DatePickerVariantSubset, 'error'> {
  error?: boolean;
  /** Earliest selectable calendar day, inclusive. */
  minDate?: Date;
  /** Latest selectable calendar day, inclusive. */
  maxDate?: Date;
  /** Returns whether a calendar day is unavailable for user selection. */
  isDateDisabled?: (date: Date) => boolean;
  /** The BCP 47 language tag used to format the custom trigger value. */
  locale?: string;
  /** Overrides localized default DatePicker text. */
  messages?: Partial<DatePickerMessages>;
  /** Options for date formatting in the custom trigger. */
  formatOptions?: DateOnlyFormatOptions;
  /** Format used for the submitted hidden value. */
  valueFormat?: DatePickerValueFormat;
  /** Empty-value text shown by the custom button trigger. */
  placeholder?: string;
  /** Prevents date changes while keeping the custom trigger focusable. */
  readOnly?: boolean;
  /** Participates in form validation through the owned validation control. */
  required?: boolean;
  /** Receives invalid events from the native input or owned validation proxy. */
  onInvalid?: FormEventHandler<HTMLInputElement>;
}

type DatePickerOwnedHostProps =
  | 'aria-controls'
  | 'aria-expanded'
  | 'aria-haspopup'
  | 'aria-required'
  | 'asChild'
  | 'children'
  | 'defaultValue'
  | 'onChange'
  | 'role'
  | 'type'
  | 'value';

/** Controlled DatePicker state. Reflect `onChange` to update the selected day. */
export interface ControlledDatePickerStateProps {
  value: Date | null;
  defaultValue?: never;
  onChange: (date: Date | null) => void;
}

/** DatePicker-owned state with an optional initial value restored on native form reset. */
export interface UncontrolledDatePickerStateProps {
  value?: never;
  defaultValue?: Date | null;
  onChange?: (date: Date | null) => void;
}

type DatePickerStateProps = ControlledDatePickerStateProps | UncontrolledDatePickerStateProps;

type DatePickerNativeBaseProps = Omit<
  PrimitiveProps<'input', DatePickerOwnProps>,
  DatePickerOwnedHostProps
> & {
  /** Uses the platform date input and forwards its ref. */
  native: true;
};

type DatePickerCustomBaseProps = Omit<
  PrimitiveProps<'button', DatePickerOwnProps>,
  DatePickerOwnedHostProps
> & {
  /**
   * Uses an input-styled native button that opens the calendar dialog.
   * @defaultValue `false`
   */
  native?: false;
};

/**
 * DatePicker props for the platform date-input branch. Its ref targets `HTMLInputElement`; native
 * min/max and submission are ISO unless `valueFormat` requests a separate hidden field.
 */
export type DatePickerNativeProps = DatePickerNativeBaseProps & DatePickerStateProps;

/**
 * DatePicker props for the button-and-calendar branch. Its ref targets `HTMLButtonElement`; it owns
 * dialog state, hidden submission, and an offscreen validation proxy.
 */
export type DatePickerCustomProps = DatePickerCustomBaseProps & DatePickerStateProps;

/** Discriminated DatePicker props selected by the `native` rendering branch. */
export type DatePickerProps = DatePickerNativeProps | DatePickerCustomProps;

/** Callable DatePicker contract preserving the ref host selected by `native`. */
export interface DatePickerComponent {
  (props: DatePickerNativeProps & RefAttributes<HTMLInputElement>): ReactElement | null;
  (props: DatePickerCustomProps & RefAttributes<HTMLButtonElement>): ReactElement | null;
  (
    props:
      | (DatePickerNativeProps & RefAttributes<HTMLInputElement>)
      | (DatePickerCustomProps & RefAttributes<HTMLButtonElement>),
  ): ReactElement | null;
}
