import type {
  OtpInputBackspaceResult,
  OtpInputChangeResult,
  OtpInputPasteResult,
} from './otp-input.types';

const buildOtpResult = (otp: string[], nextFocusIndex: number | null): OtpInputChangeResult => {
  const value = otp.join('');

  return {
    otp,
    value,
    nextFocusIndex,
    isComplete: value.length === otp.length && !otp.includes(''),
  };
};

/**
 * Splits an OTP string into a fixed-length segment array.
 *
 * ### AI Usage
 * - Use before rendering segmented OTP inputs.
 * - Empty trailing segments are represented by empty strings.
 */
export const toOtpSegments = (value: string, length: number): string[] => {
  const chars = value.slice(0, length).split('');
  return [...chars, ...new Array(length - chars.length).fill('')].slice(0, length);
};

/**
 * Applies a single input event to an OTP segment array.
 *
 * ### Notes
 * Only the last typed character is accepted for the target segment.
 * The return value includes the next focus index for keyboard-friendly segment navigation.
 */
export const applyOtpInputChange = (
  otp: string[],
  index: number,
  rawValue: string,
): OtpInputChangeResult => {
  const lastChar = rawValue.slice(-1);

  if (!lastChar && rawValue.length > 0) {
    return buildOtpResult([...otp], null);
  }

  const nextOtp = [...otp];
  nextOtp[index] = lastChar;

  return buildOtpResult(nextOtp, lastChar && index < otp.length - 1 ? index + 1 : null);
};

/**
 * Applies backspace behavior to an OTP segment array.
 *
 * ### Notes
 * If the current segment is empty, the previous segment is cleared and receives focus.
 */
export const applyOtpBackspace = (otp: string[], index: number): OtpInputBackspaceResult => {
  const nextOtp = [...otp];

  if (nextOtp[index]) {
    nextOtp[index] = '';
    return buildOtpResult(nextOtp, null);
  }

  if (index > 0) {
    nextOtp[index - 1] = '';
    return buildOtpResult(nextOtp, index - 1);
  }

  return buildOtpResult(nextOtp, null);
};

/**
 * Applies pasted text to an OTP segment array.
 *
 * ### Notes
 * Pasted text is trimmed, truncated to `length`, and filled from the first segment.
 */
export const applyOtpPaste = (
  _otp: string[],
  length: number,
  pastedText: string,
): OtpInputPasteResult => {
  const chars = pastedText.trim().split('').slice(0, length);
  const nextOtp = [...chars, ...new Array(length - chars.length).fill('')].slice(0, length);

  const nextEmptyIndex = nextOtp.findIndex((char) => char === '');
  const nextFocusIndex = nextEmptyIndex === -1 ? length - 1 : nextEmptyIndex;

  return buildOtpResult(nextOtp, nextFocusIndex);
};
