import { OtpInputVariantProps } from '@/styled-system/recipes';
import { type InputAppearance, NativeProps } from '@poffy-ui/types';

type OTPInputRecipeVariants = OtpInputVariantProps;

/** Localized accessible messages used by OTPInput. */
export interface OTPInputMessages {
  digit: (index: number, length: number) => string;
}

/** Public OTPInput variant props with shared input appearance names. */
export interface OTPInputVariantSubset extends Omit<OTPInputRecipeVariants, 'appearance'> {
  /** Surface treatment. */
  appearance?: InputAppearance;
}

/** Canonical public variants accepted by OTPInput. */
export type OTPInputVariants = OTPInputVariantSubset;

/** Fixed-position OTP segment state. Empty strings preserve unfilled positions. */
export type OTPInputValue = readonly string[];

/** Shared props for a controlled or uncontrolled fixed-position verification-code field. */
interface OTPInputBaseProps extends NativeProps<
  'div',
  OTPInputVariantSubset & { onChange?: (value: string[]) => void }
> {
  /**
   * Number of digit segments to display.
   * Runtime values are normalized to the inclusive range 1 through 32.
   * @defaultValue `6`
   */
  length?: number;

  /**
   * Fixed-position OTP segments. Empty strings preserve unfilled positions.
   */
  value?: OTPInputValue;

  /** Initial uncontrolled segment value, restored by a native form reset. */
  defaultValue?: OTPInputValue;

  /**
   * Callback fired when the OTP value changes.
   * @param value The updated fixed-position OTP segments.
   */
  onChange?: (value: string[]) => void;

  /**
   * Called when the value transitions from incomplete to all segments filled.
   * @param value The complete OTP string.
   */
  onComplete?: (value: string) => void;

  /**
   * HTML name used for one hidden joined-value form field. Individual visible segments have no
   * `name`, preventing one code from submitting as multiple unrelated fields.
   */
  name?: string;

  /**
   * Whether input segments and the optional hidden form field are disabled.
   * The nearest FormControl disabled state applies when omitted.
   * @defaultValue `false`
   */
  disabled?: boolean;

  /**
   * Prevents typing, paste, composition, and Backspace while preserving Arrow-key focus
   * navigation. The nearest FormControl read-only state applies when omitted.
   */
  readOnly?: boolean;

  /** Requires every visible OTP segment before native form submission. */
  required?: boolean;

  /** Applies invalid styling and `aria-invalid` to every OTP segment. */
  error?: boolean;

  /** Associates visible required segments and the optional hidden value with an external form. */
  form?: string;

  /** BCP 47 locale for default accessible messages; exact locale, base language, then English match. */
  locale?: string;

  /** Overrides localized accessible messages. */
  messages?: Partial<OTPInputMessages>;
}

type OTPInputNativeProps = Omit<
  OTPInputBaseProps,
  'aria-disabled' | 'defaultValue' | 'onChange' | 'role' | 'value'
>;

/**
 * Props for a controlled or uncontrolled OTP field.
 *
 * Controlled use requires `onChange`; runtime values and length normalize to fixed digit-only
 * segments. `onComplete` fires only on an incomplete-to-complete transition.
 */
export type OTPInputProps = OTPInputNativeProps &
  (
    | {
        value: OTPInputValue;
        defaultValue?: never;
        onChange: (value: string[]) => void;
      }
    | {
        value?: never;
        defaultValue?: OTPInputValue;
        onChange?: (value: string[]) => void;
      }
  );
