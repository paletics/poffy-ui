import type {
  OtpInputBackspaceResult,
  OtpInputChangeResult,
  OtpInputPasteResult,
} from './otp-input.types';

const MAX_OTP_LENGTH = 32;

/** Converts ASCII and full-width decimal digits into the OTP's ASCII digit contract. */
export const normalizeOtpDigits = (value: string): string =>
  Array.from(value, (character) => {
    const code = character.codePointAt(0);
    if (code !== undefined && code >= 0xff10 && code <= 0xff19) {
      return String(code - 0xff10);
    }
    return character;
  })
    .filter((character) => character >= '0' && character <= '9')
    .join('');

const normalizeOtpLength = (length: number) =>
  Number.isFinite(length) ? Math.min(MAX_OTP_LENGTH, Math.max(1, Math.floor(length))) : 1;

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
 * Splits an OTP string into a normalized fixed-length segment array, padding unused positions with
 * empty strings.
 */
export const toOtpSegments = (value: string, length: number): string[] => {
  const normalizedLength = normalizeOtpLength(length);
  const chars = Array.from(normalizeOtpDigits(value)).slice(0, normalizedLength);
  return [...chars, ...new Array(normalizedLength - chars.length).fill('')].slice(
    0,
    normalizedLength,
  );
};

/**
 * Resizes normalized OTP segment state without compacting empty positions.
 * Retained slots are copied verbatim and missing slots are padded with empty strings.
 */
export const resizeOtpSegments = (segments: string[], length: number): string[] => {
  const normalizedLength = normalizeOtpLength(length);
  return Array.from({ length: normalizedLength }, (_, index) => segments[index] ?? '');
};

/** Normalizes a public fixed-position OTP segment value. */
export const normalizeOtpSegments = (segments: readonly string[], length: number): string[] =>
  resizeOtpSegments(
    segments.map((segment) => normalizeOtpDigits(segment).slice(-1)),
    length,
  );

/**
 * Applies a single input event to an OTP segment array.
 *
 * Only the last typed character is accepted for the target segment.
 * The return value includes the next focus index for keyboard-friendly segment navigation.
 */
export const applyOtpInputChange = (
  otp: string[],
  index: number,
  rawValue: string,
): OtpInputChangeResult => {
  const lastChar = normalizeOtpDigits(rawValue).slice(-1);

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
 * ASCII and full-width digits are retained, all other characters are removed, and the result is
 * truncated to the normalized (1–32) length before replacing segments from the first position.
 */
export const applyOtpPaste = (
  _otp: string[],
  length: number,
  pastedText: string,
): OtpInputPasteResult => {
  const normalizedLength = normalizeOtpLength(length);
  const chars = Array.from(normalizeOtpDigits(pastedText)).slice(0, normalizedLength);
  const nextOtp = [...chars, ...new Array(normalizedLength - chars.length).fill('')].slice(
    0,
    normalizedLength,
  );

  const nextEmptyIndex = nextOtp.findIndex((char) => char === '');
  const nextFocusIndex = nextEmptyIndex === -1 ? normalizedLength - 1 : nextEmptyIndex;

  return buildOtpResult(nextOtp, nextFocusIndex);
};

/**
 * Applies pasted or autofilled digits from a particular segment without replacing surrounding
 * values. The start index is clamped into the existing segment range and the fill is truncated at
 * its last segment.
 */
export const applyOtpPasteAtIndex = (
  otp: string[],
  index: number,
  pastedText: string,
): OtpInputPasteResult => {
  const nextOtp = [...otp];
  const startIndex = Math.max(0, Math.min(index, nextOtp.length - 1));
  const chars = Array.from(normalizeOtpDigits(pastedText)).slice(0, nextOtp.length - startIndex);
  if (chars.length === 0) return buildOtpResult(nextOtp, null);

  chars.forEach((character, offset) => {
    nextOtp[startIndex + offset] = character;
  });
  const nextFocusIndex = Math.min(startIndex + chars.length, nextOtp.length - 1);
  return buildOtpResult(nextOtp, nextFocusIndex);
};
