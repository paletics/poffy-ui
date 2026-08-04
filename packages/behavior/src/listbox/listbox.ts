/**
 * Minimal option shape used by listbox-like input components.
 *
 * The React ComboBox, MultiSelect, and ListboxSelect APIs layer their public
 * option shapes on top of this behavior shape. `label` is what filtering reads;
 * `disabled` options are still renderable but are skipped by keyboard movement
 * and selection helpers.
 */
export interface ListboxOptionLike {
  disabled?: boolean;
  label: string;
}

/** Minimal option identity used to preserve highlight across collection changes. */
export interface ListboxValueOptionLike {
  value: string;
}

/** Returns every value that is owned by more than one option. */
export const getDuplicateListboxOptionValues = (
  options: readonly ListboxValueOptionLike[],
): string[] => {
  const counts = new Map<string, number>();
  for (const option of options) {
    counts.set(option.value, (counts.get(option.value) ?? 0) + 1);
  }
  return [...counts].flatMap(([value, count]) => (count > 1 ? [value] : []));
};

/**
 * Removes every occurrence of ambiguous option values.
 *
 * Keeping one arbitrary duplicate would make keyboard identity, selection, and
 * React keys disagree about which option owns the value. Callers can warn with
 * `getDuplicateListboxOptionValues` while continuing to use the unique options.
 */
export const getUnambiguousListboxOptions = <TOption extends ListboxValueOptionLike>(
  options: readonly TOption[],
): TOption[] => {
  const duplicateValues = new Set(getDuplicateListboxOptionValues(options));
  return options.filter((option) => !duplicateValues.has(option.value));
};

/** Optional matching policy for case-insensitive listbox filtering. */
export interface ListboxFilterOptions<TOption extends ListboxOptionLike> {
  /** BCP 47 locale used by the default case folding. */
  locale?: string;
  /** Custom matcher. When supplied, it replaces the default label matching. */
  filter?: (option: TOption, inputValue: string) => boolean;
}

const toLocaleFoldedCase = (value: string, locale: string | undefined) => {
  if (!locale) return value.toLowerCase();
  try {
    return value.toLocaleLowerCase(locale);
  } catch {
    return value.toLowerCase();
  }
};

/**
 * Filters options by case-insensitive label inclusion.
 *
 * This helper only filters the provided collection; it does not remove disabled
 * options. Components should combine it with the enabled-index helpers when
 * building keyboard highlight and selection behavior.
 */
export const filterListboxOptions = <TOption extends ListboxOptionLike>(
  options: readonly TOption[],
  inputValue: string,
  filterOptions: ListboxFilterOptions<TOption> = {},
): TOption[] => {
  if (filterOptions.filter) {
    return options.filter((option) => filterOptions.filter?.(option, inputValue));
  }
  const normalizedInput = toLocaleFoldedCase(inputValue, filterOptions.locale);
  return options.filter((option) =>
    toLocaleFoldedCase(option.label, filterOptions.locale).includes(normalizedInput),
  );
};

/** Returns the index matching a highlighted value, or `-1` when it is absent. */
export const getListboxHighlightedIndex = (
  options: readonly ListboxValueOptionLike[],
  highlightedValue: string | undefined,
): number =>
  highlightedValue === undefined
    ? -1
    : options.findIndex((option) => option.value === highlightedValue);

/** Resolves an index against the explicitly supplied collection to a highlighted value. */
export const getListboxHighlightedValue = (
  options: readonly ListboxValueOptionLike[],
  highlightedIndex: number,
): string | undefined => (highlightedIndex >= 0 ? options[highlightedIndex]?.value : undefined);

/**
 * Returns indices for options that can receive keyboard highlight/selection.
 */
export const getEnabledListboxIndices = (
  options: readonly Pick<ListboxOptionLike, 'disabled'>[],
): number[] => options.flatMap((option, index) => (option.disabled ? [] : [index]));

/**
 * Returns the first enabled option index, or `-1` when none are enabled.
 */
export const getFirstEnabledListboxIndex = (
  options: readonly Pick<ListboxOptionLike, 'disabled'>[],
): number => getEnabledListboxIndices(options)[0] ?? -1;

/**
 * Returns the last enabled option index, or `-1` when none are enabled.
 */
export const getLastEnabledListboxIndex = (
  options: readonly Pick<ListboxOptionLike, 'disabled'>[],
): number => getEnabledListboxIndices(options).at(-1) ?? -1;

/**
 * Returns the next enabled option index after the current index.
 *
 * When there is no later enabled option, the result falls back to the last
 * enabled option instead of wrapping to the first. Empty/all-disabled lists
 * return `-1`.
 */
export const getNextEnabledListboxIndex = (
  options: readonly Pick<ListboxOptionLike, 'disabled'>[],
  currentIndex: number,
): number =>
  getEnabledListboxIndices(options).find((index) => index > currentIndex) ??
  getLastEnabledListboxIndex(options);

/**
 * Returns the previous enabled option index before the current index.
 *
 * When there is no earlier enabled option, the result falls back to the first
 * enabled option instead of wrapping to the last. Empty/all-disabled lists
 * return `-1`.
 */
export const getPreviousEnabledListboxIndex = (
  options: readonly Pick<ListboxOptionLike, 'disabled'>[],
  currentIndex: number,
): number =>
  [...getEnabledListboxIndices(options)].reverse().find((index) => index < currentIndex) ??
  getFirstEnabledListboxIndex(options);
