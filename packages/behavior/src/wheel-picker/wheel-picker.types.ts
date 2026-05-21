/**
 * Option record shared by wheel-style pickers.
 *
 * ### Notes
 * `value` must be unique within a column. Disabled options may be rendered but
 * are skipped by navigation and normalization fallbacks.
 */
export interface WheelPickerOption {
  value: string;
  label: string;
  disabled?: boolean;
}

/**
 * Column record for multi-column wheel selection.
 *
 * ### Notes
 * `id` is the key used in `WheelPickerValue`; keep it stable across renders.
 */
export interface WheelPickerColumn {
  id: string;
  label: string;
  options: WheelPickerOption[];
}

/**
 * Selected value map keyed by column id.
 *
 * ### Notes
 * Values are normalized by column. Missing or disabled selections fall back to
 * the first enabled option, then the first option.
 */
export type WheelPickerValue = Record<string, string>;

/**
 * Options for moving through wheel picker options.
 */
export interface WheelPickerNavigationOptions {
  /** Whether navigation wraps from the last enabled option to the first, and back. */
  loop?: boolean;
}
