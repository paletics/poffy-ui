/** Digit normalization and immutable segment-edit helpers for fixed-position OTP input. */
export {
  applyOtpBackspace,
  applyOtpInputChange,
  applyOtpPaste,
  applyOtpPasteAtIndex,
  normalizeOtpDigits,
  normalizeOtpSegments,
  resizeOtpSegments,
  toOtpSegments,
} from './otp-input';
/** Immutable OTP edit-result contracts. */
export type {
  OtpInputBackspaceResult,
  OtpInputChangeResult,
  OtpInputPasteResult,
} from './otp-input.types';
