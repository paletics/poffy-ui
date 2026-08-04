interface UseAccordionStateBaseProps {
  /**
   * Whether multiple item values may be open at the same time.
   *
   * @defaultValue `false`
   */
  multiple?: boolean;
}

/** Controlled single-open accordion state; `onChange` receives the requested open value. */
export interface ControlledSingleUseAccordionStateProps extends UseAccordionStateBaseProps {
  multiple?: false;
  value: string | null;
  defaultValue?: never;
  onChange: (value: string | null) => void;
}

/** Uncontrolled single-open accordion state initialized from `defaultValue`. */
export interface UncontrolledSingleUseAccordionStateProps extends UseAccordionStateBaseProps {
  multiple?: false;
  value?: never;
  defaultValue?: string | null;
  onChange?: (value: string | null) => void;
}

/** Controlled multi-open accordion state; `onChange` receives the complete open-value set. */
export interface ControlledMultipleUseAccordionStateProps extends UseAccordionStateBaseProps {
  multiple: true;
  value: string[];
  defaultValue?: never;
  onChange: (value: string[]) => void;
}

/** Uncontrolled multi-open accordion state initialized from `defaultValue`. */
export interface UncontrolledMultipleUseAccordionStateProps extends UseAccordionStateBaseProps {
  multiple: true;
  value?: never;
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
}

/**
 * Controlled or uncontrolled accordion state, with single- and multi-open modes encoded by
 * `multiple`. A `value` always requires `onChange` and cannot be combined with `defaultValue`.
 */
export type UseAccordionStateProps =
  | ControlledSingleUseAccordionStateProps
  | UncontrolledSingleUseAccordionStateProps
  | ControlledMultipleUseAccordionStateProps
  | UncontrolledMultipleUseAccordionStateProps;

/** Normalized open values and the operation that toggles an item. */
export interface UseAccordionStateReturn {
  /** Normalized array of currently open item values. */
  currentValue: string[];
  /** Toggles an item value according to single or multiple mode. */
  toggle: (val: string) => void;
}
