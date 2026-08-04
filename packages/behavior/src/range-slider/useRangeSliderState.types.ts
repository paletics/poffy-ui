import type {
  RangeSliderKeyboardAction,
  RangeSliderOptions,
  RangeSliderThumb,
  RangeSliderValue,
} from './range-slider.types';

/** Controlled or uncontrolled range value, interaction policy, and change or commit callbacks. */
export interface UseRangeSliderStateOptions extends RangeSliderOptions {
  /** Initial uncontrolled endpoints, normalized against the latest options. */
  defaultValue?: RangeSliderValue;
  /** Permanently blocks new changes and discards a pending interaction when it becomes true. */
  interactionBlocked?: boolean;
  /** Dynamic event-time interaction gate, also checked before a pending commit callback. */
  isInteractionBlockedNow?: () => boolean;
  /** Receives each accepted intermediate normalized value and the moved thumb. */
  onValueChange?: (value: RangeSliderValue, thumb: RangeSliderThumb) => void;
  /** Receives the final value once for a matching `commitInteraction` call. */
  onValueCommit?: (value: RangeSliderValue, thumb: RangeSliderThumb) => void;
  /** Controlled endpoints; callers must reflect accepted change requests. */
  value?: RangeSliderValue;
}

/** Current range and pointer or keyboard operations; commit is separate from intermediate changes. */
export interface UseRangeSliderStateReturn {
  /** Applies one keyboard action as an intermediate move for the selected thumb. */
  applyKeyboardAction: (thumb: RangeSliderThumb, action: RangeSliderKeyboardAction) => void;
  /** Discards the pending commit while retaining the last accepted value. */
  cancelInteraction: () => void;
  /** Commits the latest pending move only when it belongs to this thumb. */
  commitInteraction: (thumb: RangeSliderThumb) => void;
  /** Whether `value` currently owns the range state. */
  isControlled: boolean;
  /** Applies a pointer-like intermediate move, subject to normalization and interaction gates. */
  moveThumb: (thumb: RangeSliderThumb, value: number) => void;
  /** Restores latest normalized defaults only for uncontrolled state and clears pending commit. */
  reset: () => void;
  /** Current ascending, bounded, stepped, gap-respecting endpoints. */
  value: RangeSliderValue;
}
