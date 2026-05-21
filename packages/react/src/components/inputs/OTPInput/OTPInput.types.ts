import { OtpInputVariantProps } from '@/styled-system/recipes';
import { type InputAppearance, PrimitiveProps } from '@poffy-ui/types';

/**
 * Variants for the OTPInput component based on Panda CSS recipe.
 */
export type OTPInputVariants = OtpInputVariantProps;

/** Public OTPInput variant props with shared input appearance names. */
export interface OTPInputVariantSubset extends Omit<OtpInputVariantProps, 'appearance'> {
  /** Surface treatment. */
  appearance?: InputAppearance;
}

/**
 * Properties for the OTPInput component.
 * Specialized for entering One-Time Passwords or verification codes.
 *
 * ### Notes
 * `value` is controlled and must be updated from `onChange`; omit it for
 * internal segment state. `onComplete` fires only when every segment is filled.
 * Provide a visible label, `aria-label`, or `aria-labelledby` on the wrapper.
 *
 * Do: set `length` to the exact code length expected by the backend.
 * Don't: use OTPInput for arbitrary passwords or long text secrets.
 *
 * @example
 * ```tsx
 * import { OTPInput } from '@poffy-ui/react/inputs';
 *
 * <OTPInput aria-label="Verification code" length={6} value={code} onChange={setCode} />
 * ```
 */
export interface OTPInputProps extends PrimitiveProps<
  'div',
  OTPInputVariantSubset & { onChange?: (value: string) => void }
> {
  /**
   * Number of digit segments to display.
   * @defaultValue `6`
   */
  length?: number;

  /**
   * The current value of the OTP entries as a single string.
   */
  value?: string;

  /**
   * Callback fired when the OTP value changes.
   * @param value The updated OTP string.
   */
  onChange?: (value: string) => void;

  /**
   * Callback fired when all digit segments are filled.
   * @param value The complete OTP string.
   */
  onComplete?: (value: string) => void;

  /**
   * Whether the input segments are disabled.
   * @defaultValue `false`
   */
  disabled?: boolean;
}
