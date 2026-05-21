/**
 * Minimal option shape used by listbox-like input components.
 *
 * ### Notes
 * The React ComboBox, MultiSelect, and ListboxSelect APIs layer their public
 * option shapes on top of this behavior shape. `label` is what filtering reads;
 * `disabled` options are still renderable but are skipped by keyboard movement
 * and selection helpers.
 */
export interface ListboxOptionLike {
  disabled?: boolean;
  label: string;
}

/**
 * Filters options by case-insensitive label inclusion.
 *
 * ### Notes
 * This helper only filters the provided collection; it does not remove disabled
 * options. Components should combine it with the enabled-index helpers when
 * building keyboard highlight and selection behavior.
 */
export const filterListboxOptions = <TOption extends ListboxOptionLike>(
  options: readonly TOption[],
  inputValue: string,
): TOption[] => {
  const normalizedInput = inputValue.toLowerCase();
  return options.filter((option) => option.label.toLowerCase().includes(normalizedInput));
};

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
 * ### Notes
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
 * ### Notes
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
