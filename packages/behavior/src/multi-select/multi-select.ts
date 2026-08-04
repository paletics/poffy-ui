import type {
  GetMultiSelectKeyboardIntentOptions,
  MultiSelectKeyboardIntent,
} from './multi-select.types';

/**
 * Resolves a keyboard event to a MultiSelect interaction intent.
 *
 * Enter is intentionally absent when no selection or custom-value action can
 * occur, allowing forms to retain native submission behavior.
 */
export const getMultiSelectKeyboardIntent = ({
  canCreateCustomValue,
  hasEnabledOption,
  hasInputValue,
  highlightedIndex,
  isOpen,
  key,
  optionCount,
  selectedValueCount,
}: GetMultiSelectKeyboardIntentOptions): MultiSelectKeyboardIntent | undefined => {
  if (key === 'ArrowDown') return 'next';
  if (key === 'ArrowUp') return 'previous';
  if (key === 'Home') return 'first';
  if (key === 'End') return 'last';
  if (key === 'Escape' && isOpen) return 'close';
  if (key === 'Backspace' && !hasInputValue && selectedValueCount > 0) return 'remove-last';
  if (key !== 'Enter') return undefined;

  if (isOpen && highlightedIndex >= 0 && highlightedIndex < optionCount) {
    return 'select-highlighted';
  }
  if (hasInputValue && hasEnabledOption) return 'select-first';
  if (canCreateCustomValue) return 'create-custom';
  return undefined;
};
