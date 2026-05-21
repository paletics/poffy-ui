/**
 * Options for the shared accordion state controller.
 *
 * ### Notes
 * The hook normalizes both scalar and array inputs to `currentValue: string[]`.
 * `onChange` mirrors public component semantics: single mode receives a string
 * (or `''` when closed) and multiple mode receives a string array.
 */
export interface UseAccordionStateProps {
  /**
   * Whether multiple item values may be open at the same time.
   *
   * @defaultValue `false`
   */
  multiple?: boolean;
  /** Controlled open value or values. Use with `onChange`. */
  value?: string | string[];
  /** Initial open value or values for uncontrolled usage. */
  defaultValue?: string | string[];
  /** Callback fired when the open value set changes. */
  onChange?: (value: string | string[]) => void;
}

/**
 * State and actions returned by `useAccordionState`.
 */
export interface UseAccordionStateReturn {
  /** Normalized array of currently open item values. */
  currentValue: string[];
  /** Toggles an item value according to single or multiple mode. */
  toggle: (val: string) => void;
}
