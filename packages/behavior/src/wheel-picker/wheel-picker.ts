import type {
  WheelPickerColumn,
  WheelPickerNavigationOptions,
  WheelPickerOption,
  WheelPickerValue,
} from './wheel-picker.types';
import { getDuplicateListboxOptionValues, getUnambiguousListboxOptions } from '../listbox/listbox';

/** Returns every column id that is owned by more than one column. */
export const getDuplicateWheelPickerColumnIds = (
  columns: readonly WheelPickerColumn[],
): string[] => {
  const counts = new Map<string, number>();
  for (const column of columns) {
    counts.set(column.id, (counts.get(column.id) ?? 0) + 1);
  }
  return [...counts].flatMap(([id, count]) => (count > 1 ? [id] : []));
};

/** Returns duplicate option values grouped by their unique column id. */
export const getDuplicateWheelPickerOptionValues = (
  columns: readonly WheelPickerColumn[],
): { columnId: string; values: string[] }[] => {
  const duplicateColumnIds = new Set(getDuplicateWheelPickerColumnIds(columns));
  return columns.flatMap((column) => {
    if (duplicateColumnIds.has(column.id)) return [];
    const values = getDuplicateListboxOptionValues(column.options);
    return values.length > 0 ? [{ columnId: column.id, values }] : [];
  });
};

/**
 * Removes ambiguous columns and ambiguous options while preserving safe data.
 *
 * Every occurrence of a duplicate column id or option value is removed. This
 * keeps value maps, React keys, and option refs aligned to a single owner.
 */
export const getUnambiguousWheelPickerColumns = (
  columns: readonly WheelPickerColumn[],
): WheelPickerColumn[] => {
  const duplicateColumnIds = new Set(getDuplicateWheelPickerColumnIds(columns));
  return columns
    .filter((column) => !duplicateColumnIds.has(column.id))
    .map((column) => ({
      ...column,
      options: getUnambiguousListboxOptions(column.options),
    }));
};

/**
 * Returns wheel picker options that can be selected.
 */
export const getEnabledWheelPickerOptions = (options: WheelPickerOption[]) =>
  options.filter((option) => !option.disabled);

/**
 * Resolves the selected wheel picker option.
 *
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
 * Missing, unknown, or disabled selections fall back per column to the first
 * enabled option, then to the first option when every option is disabled. Empty
 * columns do not add a key to the returned value map.
 */
export const normalizeWheelPickerValue = (
  columns: WheelPickerColumn[],
  value: WheelPickerValue | undefined,
) =>
  Object.fromEntries(
    columns.flatMap((column) => {
      const suppliedValue =
        value && Object.prototype.hasOwnProperty.call(value, column.id)
          ? value[column.id]
          : undefined;
      const selected = getWheelPickerSelectedOption(column.options, suppliedValue);
      return selected ? [[column.id, selected.value] as const] : [];
    }),
  );

/**
 * Returns whether one column owns a complete, enabled selection.
 *
 * Placeholder options remain selectable so applications can represent an
 * explicit unselected state without reserving the empty string value.
 */
export const isWheelPickerColumnValueComplete = (
  column: WheelPickerColumn,
  value: WheelPickerValue,
) => {
  if (!Object.prototype.hasOwnProperty.call(value, column.id)) return false;

  return column.options.some(
    (option) =>
      option.value === value[column.id] && option.disabled !== true && option.placeholder !== true,
  );
};

/**
 * Returns the next enabled wheel picker option in the requested direction.
 *
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
