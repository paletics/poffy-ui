import type { MultiSelectOptionLike } from './multi-select.types';

/** Current selected values, option filtering, and policy for creating custom values. */
export interface UseMultiSelectInteractionStateOptions<TOption extends MultiSelectOptionLike> {
  /** Enables the custom-value path in addition to configured options. */
  allowCustomValues: boolean;
  /** Values that must not be reintroduced through the custom-value path. */
  disallowedCustomValues?: ReadonlySet<string>;
  /** Replaces locale-aware default label filtering. */
  filterOption?: (option: TOption, inputValue: string) => boolean;
  /**
   * Converts typed input into a custom value. Without it, the hook uses trimmed input;
   * with it, the returned string is used as-is and an empty result is rejected.
   */
  getCustomValue?: (inputValue: string) => string;
  /** Blocks opening, selection, custom values, and removal; an open popup closes asynchronously. */
  interactionBlocked?: boolean;
  /** BCP 47 locale used by the default listbox label filter. */
  locale?: string;
  /** Requests a replacement selection array. The caller owns and must reflect `value`. */
  onValueChange?: (value: string[]) => void;
  /** Current source option collection. */
  options: readonly TOption[];
  /** Caller-owned selected values. */
  value: readonly string[];
}

/** Popup and input state with operations that enforce option and custom-value policy. */
export interface UseMultiSelectInteractionStateReturn<TOption extends MultiSelectOptionLike> {
  /** Whether the current input can be added as a new custom value. */
  canSelectCustomValue: boolean;
  /** Options matching current input. */
  filteredOptions: TOption[];
  /** Filters the source collection without changing hook state. */
  filterOptions: (inputValue: string) => TOption[];
  /** Highlight index in filtered options, or `-1` when absent. */
  highlightedIndex: number;
  /** Current hook-owned filter text. */
  inputValue: string;
  /** Whether the popup is requested open and interaction is not blocked. */
  isOpen: boolean;
  /** Requests removal and returns false when blocked or absent. */
  removeValue: (value: string) => boolean;
  /** Clears typed text and highlight and closes the popup without changing selected values. */
  resetTransientState: () => void;
  /** Requests adding the normalized custom value and clears input on success. */
  selectCustomValue: () => boolean;
  /** Toggles one option value and clears input on success. */
  selectOption: (value: string) => boolean;
  /** Sets highlight by index in an explicitly supplied rendered option list. */
  setHighlightedIndex: (options: readonly TOption[], index: number) => void;
  /** Replaces hook-owned filter text. */
  setInputValue: (value: string) => void;
  /** Opens or closes the popup; opening is ignored while blocked. */
  setIsOpen: (open: boolean) => void;
}
