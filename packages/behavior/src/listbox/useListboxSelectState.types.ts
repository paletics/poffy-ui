import type { ListboxOptionLike, ListboxValueOptionLike } from './listbox';

/** Option shape required by listbox-select state, including a stable value and display label. */
export interface ListboxSelectOptionLike extends ListboxOptionLike, ListboxValueOptionLike {}

/** Stable identity for a selected option when duplicate values or labels are present. */
export interface ListboxSelectOptionIdentity {
  /** Display label used with `value` to disambiguate repeated option occurrences. */
  label: string;
  /** Zero-based occurrence among earlier options with the same value and label. */
  occurrence: number;
  /** Persisted option value. */
  value: string;
}

/** Inputs used to reconcile a persisted selection with the current option collection. */
export interface ReconcileListboxSelectSelectionOptions {
  /** Controlled values remain owned by the caller and are never replaced by reconciliation. */
  isControlled: boolean;
  /** Current ordered option collection. */
  options: readonly ListboxSelectOptionLike[];
  /** Last uncontrolled occurrence-aware selection identity. */
  selectedIdentity: ListboxSelectOptionIdentity | undefined;
  /** Current persisted selection value. */
  selectedValue: string;
}

/** Reconciliation result, including replacement selection data and update signals for the caller. */
export interface ReconciledListboxSelectSelection {
  /** Whether uncontrolled occurrence identity should be replaced. */
  identityNeedsUpdate: boolean;
  /** Index matching the persisted value before any first-enabled fallback. */
  matchedValueIndex: number;
  /** Replacement occurrence identity when `identityNeedsUpdate` is true. */
  nextIdentity: ListboxSelectOptionIdentity | undefined;
  /** Replacement value when `valueNeedsUpdate` is true. */
  nextValue: string;
  /** Current selected option index, or the first enabled fallback / `-1`. */
  selectedIndex: number;
  /** Whether an uncontrolled persisted value was absent and needs replacement. */
  valueNeedsUpdate: boolean;
}

/** Keyboard event data needed to ignore IME composition while handling listbox navigation. */
export interface ListboxSelectKeyboardInput {
  isComposing?: boolean;
  key: string;
  keyCode?: number;
}

/** Controlled or uncontrolled listbox-select state and its option collection. */
export interface UseListboxSelectStateOptions<
  TOption extends ListboxSelectOptionLike = ListboxSelectOptionLike,
> {
  /** Initial uncontrolled value and reset target; a missing value falls back to the first enabled option. */
  defaultValue: string;
  /** Blocks opening, navigation, and selection when true. */
  interactionBlocked?: boolean;
  /** Reads additional disabledness at interaction time, such as an ancestor fieldset state. */
  isInteractionBlockedNow?: () => boolean;
  /**
   * Requests that an owning UI select an enabled option index. The hook does not
   * update controlled or uncontrolled selection from this callback; use
   * `handleSelectionChange` after the owner accepts the request.
   */
  onRequestSelection?: (index: number) => void;
  /** Ordered source collection. Uncontrolled selection keeps occurrence identity through reorder. */
  options: readonly TOption[];
  /** Externally owned selected value. Omit it to use internal state initialized by `defaultValue`. */
  value?: string;
}

/** Current selection and popup state together with keyboard and selection actions. */
export interface UseListboxSelectStateReturn {
  /** Handles a keyboard input and returns whether the caller should prevent its browser default. */
  handleKeyDown: (input: ListboxSelectKeyboardInput) => boolean;
  /**
   * Applies a value accepted by the owner and returns false when blocked or unchanged.
   * It preserves uncontrolled occurrence identity and does not close the popup.
   */
  handleSelectionChange: (value: string, index: number) => boolean;
  /** Highlight index in the current options, or `-1` when none. */
  highlightedIndex: number;
  /** Whether `selectedValue` is owned through the `value` option. */
  isControlled: boolean;
  /** Whether the popup is requested open and the collection is not blocked. */
  isOpen: boolean;
  /** Resets uncontrolled selection to the latest default target, restores highlight, and closes. */
  reset: () => void;
  /** Selected option index or the first enabled fallback / `-1`. */
  selectedIndex: number;
  /** Current persisted selected value. */
  selectedValue: string;
  /**
   * Requests selection of an enabled index, closes the popup, and returns false
   * for blocked, missing, or disabled options.
   */
  selectIndex: (index: number) => boolean;
  /** Sets highlight by option index without changing selection. */
  setHighlightedIndex: (index: number) => void;
  /** Opens or closes the popup; opening is ignored while blocked. */
  setOpen: (open: boolean) => void;
  /** Requests the opposite popup state subject to the same block rules. */
  toggleOpen: () => void;
}
