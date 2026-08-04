/**
 * Options for the shared radio-group state hook.
 *
 * `value` is controlled and wins over internal state. `defaultValue` is used
 * only for the initial uncontrolled value.
 */
export interface UseRadioGroupStateOptions {
  /** Controlled selected value. Use with `onChange`. */
  value?: string;
  /** Initial selected value for uncontrolled usage. */
  defaultValue?: string;
  /** Callback fired with the requested selected value. */
  onChange?: (value: string) => void;
}

/**
 * Shared radio-group state returned by the behavior hook.
 *
 * `onChange` emits the requested option value every time it is called. React
 * components that need to ignore repeated selections should compare against
 * `value` before calling it.
 */
export interface UseRadioGroupStateReturn {
  /** Current selected option value after controlled/uncontrolled resolution. */
  value: string;
  /** Requests selection of an option value. */
  onChange: (value: string) => void;
  /** Updates the uncontrolled selection without emitting a change event. */
  setValue: (value: string) => void;
}
