/** Keyboard event data used to navigate or clear a specific OTP segment. */
export interface OtpInputKeyboardInput {
  /** Focused segment index; callers should provide an index in `segments`. */
  index: number;
  /** Whether this key belongs to an in-progress IME composition. */
  isComposing?: boolean;
  /** DOM key value; ArrowLeft, ArrowRight, and Backspace are recognized. */
  key: string;
  /** Legacy IME marker; `229` is treated as composing. */
  keyCode?: number;
}

/** Result of OTP keyboard handling, including the segment that should receive focus next. */
export interface OtpInputKeyboardResult {
  /** Whether the caller should claim the key event. */
  handled: boolean;
  /** Segment to focus after handling, or `null` when focus remains unchanged. */
  nextFocusIndex: number | null;
}

/** Controlled or uncontrolled OTP segments, completion callback, and interaction policy. */
export interface UseOtpInputStateOptions {
  /** Initial uncontrolled fixed-position segments, normalized without compacting holes. */
  defaultValue?: readonly string[];
  /** Blocks edits and keyboard handling. */
  disabled?: boolean;
  /** Reverses ArrowLeft/ArrowRight focus movement. */
  isRtl?: boolean;
  /** Requested segment count, normalized to an integer from 1 through 32. */
  length: number;
  /** Receives a fresh normalized segment array after an actual edit. */
  onChange?: (value: string[]) => void;
  /** Fires only when an edit transitions from incomplete to a new complete OTP value. */
  onComplete?: (value: string) => void;
  /** Blocks edits but still allows arrow-key focus navigation. */
  readOnly?: boolean;
  /** Controlled fixed-position segments; callers must reflect edits after `onChange`. */
  value?: readonly string[];
}

/** Normalized OTP segments and actions that apply typed, pasted, composed, or keyboard input. */
export interface UseOtpInputStateReturn {
  /** Applies typed or autofilled text at a segment and returns the requested next focus index. */
  applyInput: (rawValue: string, index: number) => number | null;
  /** Applies digit-only pasted text from a segment without replacing earlier segments. */
  applyPaste: (text: string, index: number) => number | null;
  /** Starts buffering IME text until `endComposition`. */
  beginComposition: () => void;
  /** Commits buffered IME text, or the supplied fallback when no buffered text exists. */
  endComposition: (fallbackValue: string, index: number) => number | null;
  handleKeyDown: (input: OtpInputKeyboardInput) => OtpInputKeyboardResult;
  /** Whether `value` currently owns the normalized segment state. */
  isControlled: boolean;
  /** Concatenated segments, which can be shorter than `resolvedLength` while incomplete. */
  joinedValue: string;
  /** Restores the latest default only for uncontrolled state and never emits callbacks. */
  reset: () => void;
  /** Actual normalized segment count. */
  resolvedLength: number;
  /** Fixed-position normalized one-digit-or-empty segment array. */
  segments: string[];
}
