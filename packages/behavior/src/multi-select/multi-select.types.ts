import type { ListboxOptionLike, ListboxValueOptionLike } from '../listbox';

/** Minimal option shape required by MultiSelect behavior. */
export interface MultiSelectOptionLike extends ListboxOptionLike, ListboxValueOptionLike {}

/** Semantic keyboard operation interpreted by a MultiSelect React adapter. */
export type MultiSelectKeyboardIntent =
  | 'close'
  | 'create-custom'
  | 'first'
  | 'last'
  | 'next'
  | 'previous'
  | 'remove-last'
  | 'select-first'
  | 'select-highlighted';

/** Current interaction state used to interpret one keyboard event. */
export interface GetMultiSelectKeyboardIntentOptions {
  /** Whether the current non-empty input may become a custom value. */
  canCreateCustomValue: boolean;
  /** Whether filtering produced at least one enabled option. */
  hasEnabledOption: boolean;
  /** Whether the editable input contains any text. */
  hasInputValue: boolean;
  /** Highlight index in the filtered option collection. */
  highlightedIndex: number;
  /** Whether the option popup is open. */
  isOpen: boolean;
  /** DOM keyboard-event key value. */
  key: string;
  /** Number of filtered options. */
  optionCount: number;
  /** Number of currently selected values, used by empty-input Backspace. */
  selectedValueCount: number;
}
