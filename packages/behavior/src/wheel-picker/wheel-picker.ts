import type {
  WheelPickerColumn,
  WheelPickerNavigationOptions,
  WheelPickerOption,
  WheelPickerValue,
} from './wheel-picker.types';

/**
 * Returns wheel picker options that can be selected.
 */
export const getEnabledWheelPickerOptions = (options: WheelPickerOption[]) =>
  options.filter((option) => !option.disabled);

/**
 * Resolves the selected wheel picker option.
 *
 * ### Notes
 * Falls back to the first enabled option, then to the first option when all are disabled.
 */
export const getWheelPickerSelectedOption = (
  options: WheelPickerOption[],
  value: string | undefined,
) => {
  const selected = options.find((option) => option.value === value && !option.disabled);
  return selected ?? getEnabledWheelPickerOptions(options)[0] ?? options[0];
};

/**
 * Normalizes a value map so every wheel picker column has a valid selected value.
 *
 * ### Notes
 * Missing, unknown, or disabled selections fall back per column to the first
 * enabled option, then to the first option when every option is disabled. Empty
 * columns do not add a key to the returned value map.
 */
export const normalizeWheelPickerValue = (
  columns: WheelPickerColumn[],
  value: WheelPickerValue | undefined,
) =>
  columns.reduce<WheelPickerValue>((nextValue, column) => {
    const selected = getWheelPickerSelectedOption(column.options, value?.[column.id]);
    if (selected) {
      nextValue[column.id] = selected.value;
    }
    return nextValue;
  }, {});

/**
 * Returns the next enabled wheel picker option in the requested direction.
 *
 * ### Notes
 * When `loop` is true, navigation wraps between the first and last enabled options.
 */
export const getNextWheelPickerOption = (
  options: WheelPickerOption[],
  currentValue: string | undefined,
  direction: 1 | -1,
  { loop = true }: WheelPickerNavigationOptions = {},
) => {
  const enabledIndices = options.flatMap((option, index) => (option.disabled ? [] : [index]));
  if (enabledIndices.length === 0) return undefined;

  const currentIndex = options.findIndex((option) => option.value === currentValue);
  const candidateIndex =
    direction > 0
      ? enabledIndices.find((index) => index > currentIndex)
      : [...enabledIndices].reverse().find((index) => index < currentIndex);

  if (candidateIndex !== undefined) return options[candidateIndex];
  if (!loop) return options[currentIndex] ?? options[enabledIndices[0]];

  return direction > 0 ? options[enabledIndices[0]] : options[enabledIndices.at(-1)!];
};
