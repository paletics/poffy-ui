/**
 * Result of applying an OTP editing action.
 *
 * Consumers should render `otp` by segment and submit `value`. `nextFocusIndex`
 * is `null` when focus should remain on the current segment.
 */
export interface OtpInputChangeResult {
  /** OTP segments after the action. */
  otp: string[];
  /** Joined OTP string after the action. */
  value: string;
  /** Index that should receive focus next, or `null` when focus should stay unchanged. */
  nextFocusIndex: number | null;
  /** Whether all OTP segments are filled. */
  isComplete: boolean;
}

/**
 * Result of applying a backspace action to OTP segments.
 */
export type OtpInputBackspaceResult = OtpInputChangeResult;

/**
 * Result of applying pasted text to OTP segments.
 */
export type OtpInputPasteResult = OtpInputChangeResult;
