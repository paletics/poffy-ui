import { getFirstEnabledListboxIndex } from './listbox';
import type {
  ListboxSelectOptionIdentity,
  ListboxSelectOptionLike,
  ReconcileListboxSelectSelectionOptions,
  ReconciledListboxSelectSelection,
} from './useListboxSelectState.types';

/** Builds an option identity that distinguishes repeated value-and-label pairs by occurrence. */
export const getListboxSelectOptionIdentity = (
  options: readonly ListboxSelectOptionLike[],
  index: number,
): ListboxSelectOptionIdentity | undefined => {
  const option = options[index];
  if (!option) return undefined;

  return {
    label: option.label,
    occurrence: options
      .slice(0, index)
      .filter((candidate) => candidate.value === option.value && candidate.label === option.label)
      .length,
    value: option.value,
  };
};

/** Resolves an occurrence-aware option identity, returning `-1` when it is absent. */
export const getListboxSelectOptionIndex = (
  options: readonly ListboxSelectOptionLike[],
  identity: ListboxSelectOptionIdentity | undefined,
): number => {
  if (!identity) return -1;

  let occurrence = 0;
  return options.findIndex((option) => {
    if (option.value !== identity.value || option.label !== identity.label) return false;
    const isMatch = occurrence === identity.occurrence;
    occurrence += 1;
    return isMatch;
  });
};

/** Finds a selected value or falls back to the first enabled option. */
export const getListboxSelectSelectedIndex = (
  options: readonly ListboxSelectOptionLike[],
  value: string,
): number => {
  const matchedIndex = options.findIndex((option) => option.value === value);
  return matchedIndex >= 0 ? matchedIndex : getFirstEnabledListboxIndex(options);
};

/**
 * Reconciles selection after option changes. Controlled values remain value-owned; uncontrolled
 * values preserve occurrence-aware identity where possible and report required state updates.
 */
export const reconcileListboxSelectSelection = ({
  isControlled,
  options,
  selectedIdentity,
  selectedValue,
}: ReconcileListboxSelectSelectionOptions): ReconciledListboxSelectSelection => {
  const matchedValueIndex = options.findIndex((option) => option.value === selectedValue);
  const valueSelectedIndex =
    matchedValueIndex >= 0 ? matchedValueIndex : getFirstEnabledListboxIndex(options);
  const identitySelectedIndex = getListboxSelectOptionIndex(options, selectedIdentity);
  const selectedIndex =
    !isControlled &&
    identitySelectedIndex >= 0 &&
    options[identitySelectedIndex]?.value === selectedValue
      ? identitySelectedIndex
      : valueSelectedIndex;
  const valueNeedsUpdate = !isControlled && matchedValueIndex < 0 && selectedIndex >= 0;
  const identityNeedsUpdate =
    !isControlled && selectedIndex >= 0 && Math.min(identitySelectedIndex, matchedValueIndex) < 0;

  return {
    identityNeedsUpdate,
    matchedValueIndex,
    nextIdentity: identityNeedsUpdate
      ? getListboxSelectOptionIdentity(options, selectedIndex)
      : selectedIdentity,
    nextValue: valueNeedsUpdate ? (options[selectedIndex]?.value ?? '') : selectedValue,
    selectedIndex,
    valueNeedsUpdate,
  };
};
