import type {
  ComboBoxKeyboardIntent,
  ComboBoxOptionLike,
  GetComboBoxKeyboardIntentOptions,
} from './combobox.types';
import { getDuplicateListboxOptionValues, getUnambiguousListboxOptions } from '../listbox/listbox';

/**
 * Removes every option whose value is ambiguous within the collection.
 *
 * ComboBox values identify selection, highlight, and ARIA option ids. Keeping
 * either duplicate would make those relationships depend on render order, so
 * duplicates fail closed.
 */
export const getUnambiguousComboBoxOptions = <TOption extends ComboBoxOptionLike>(
  options: readonly TOption[],
): TOption[] => getUnambiguousListboxOptions(options);

/** Returns duplicate values in first-occurrence order. */
export const getDuplicateComboBoxValues = (options: readonly ComboBoxOptionLike[]): string[] =>
  getDuplicateListboxOptionValues(options);

/**
 * Resolves a keyboard event to a ComboBox intent.
 *
 * Enter only becomes a selection intent when an open list owns a valid
 * highlighted option. Otherwise the browser keeps its native form behavior.
 */
export const getComboBoxKeyboardIntent = ({
  highlightedIndex,
  isOpen,
  key,
  optionCount,
}: GetComboBoxKeyboardIntentOptions): ComboBoxKeyboardIntent | undefined => {
  if (key === 'ArrowDown') return 'next';
  if (key === 'ArrowUp') return 'previous';
  if (key === 'Escape' && isOpen) return 'close';
  if (key === 'Enter' && isOpen && highlightedIndex >= 0 && highlightedIndex < optionCount) {
    return 'select';
  }
  return undefined;
};
