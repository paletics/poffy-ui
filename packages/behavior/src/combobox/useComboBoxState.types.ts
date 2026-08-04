import type { ComboBoxOptionLike } from './combobox.types';

type ComboBoxSelectionState =
  | {
      value: string | null;
      onValueChange: (value: string | null) => void;
      defaultValue?: never;
    }
  | {
      value?: never;
      defaultValue?: string | null;
      onValueChange?: (value: string | null) => void;
    };

type ComboBoxInputState =
  | {
      inputValue: string;
      onInputValueChange: (inputValue: string) => void;
      defaultInputValue?: never;
    }
  | {
      inputValue?: never;
      defaultInputValue?: string;
      onInputValueChange?: (inputValue: string) => void;
    };

interface UseComboBoxStateBaseOptions<TOption extends ComboBoxOptionLike> {
  /** Overrides locale-aware default label filtering for the supplied collection. */
  filterOption?: (option: TOption, inputValue: string) => boolean;
  /**
   * Prevents opening or changing selection and closes an already open popup asynchronously.
   * Use it while an owning UI is disabled, read-only, or otherwise unavailable.
   */
  interactionBlocked?: boolean;
  /** BCP 47 locale used by the default listbox label filter. */
  locale?: string;
  /** Source collection; changing it re-filters the input and may reconcile selection. */
  options: readonly TOption[];
  /**
   * Whether a selected value missing from `options` should be exposed as null
   * and request one `onValueChange(null)` reconciliation.
   * @defaultValue `true`
   */
  reconcileSelection?: boolean;
}

/**
 * Controlled or uncontrolled selection and input state for a filtered option collection.
 *
 * `value` requires `onValueChange`; `inputValue` independently requires `onInputValueChange`.
 * Either state can instead be uncontrolled with its matching `default*` value. A controlled
 * caller must reflect callbacks to change the returned state.
 */
export type UseComboBoxStateOptions<TOption extends ComboBoxOptionLike> =
  UseComboBoxStateBaseOptions<TOption> & ComboBoxSelectionState & ComboBoxInputState;

/** Filtered options, popup state, and actions for selection, input, and highlight changes. */
export interface UseComboBoxStateReturn<TOption extends ComboBoxOptionLike> {
  /** Options matching the current input according to `filterOption` or locale-aware default filtering. */
  filteredOptions: TOption[];
  /** Filters the current source collection without changing hook state. */
  filterOptions: (inputValue: string) => TOption[];
  /** Index of the highlighted filtered option, or -1 when there is no matching highlight. */
  highlightedIndex: number;
  /** Current controlled or uncontrolled text value. */
  inputValue: string;
  /** Whether input text is controlled by `inputValue`. */
  isInputValueControlled: boolean;
  /** Whether the requested popup is open and interaction is not blocked. */
  isOpen: boolean;
  /** Whether selection is controlled by `value`. */
  isValueControlled: boolean;
  /**
   * Replaces hook-owned state without invoking change callbacks, clears the
   * highlight, and closes the popup. Controlled selection remains the caller's
   * currently reflected value.
   */
  reset: (value: string | null, inputValue?: string) => void;
  /** Current selected value; `null` represents no selection, including an orphan reconciled value. */
  selectedValue: string | null | undefined;
  /** Sets highlight by index in an explicitly supplied rendered option list. */
  setHighlightedIndex: (
    options: readonly TOption[],
    index: number | ((previousIndex: number) => number),
  ) => void;
  /** Updates text and invokes `onInputValueChange` unless it is unchanged. */
  setInputValue: (value: string) => void;
  /** Opens or closes the popup; opening is ignored while interaction is blocked. */
  setIsOpen: (open: boolean) => void;
  /** Updates selection and invokes `onValueChange` unless blocked or unchanged. */
  setSelectedValue: (value: string | null) => void;
}
