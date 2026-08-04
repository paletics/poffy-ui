/** Minimal option contract required by ComboBox collection helpers. */
export interface ComboBoxOptionLike {
  disabled?: boolean;
  label: string;
  value: string;
}

/** Keyboard intent interpreted by the React input adapter. */
export type ComboBoxKeyboardIntent = 'close' | 'next' | 'previous' | 'select';

/** Current popup and highlight state used to interpret one keyboard event. */
export interface GetComboBoxKeyboardIntentOptions {
  /** Index in the currently rendered option collection; negative means none. */
  highlightedIndex: number;
  /** Whether the listbox popup is open. */
  isOpen: boolean;
  /** DOM keyboard-event key value. */
  key: string;
  /** Number of currently selectable rendered options. */
  optionCount: number;
}
