import type { DateConstraintOptions } from './date.types';

/** Controlled or uncontrolled date selection together with the selectable-date constraints. */
export interface UseDatePickerStateOptions extends DateConstraintOptions {
  defaultValue?: Date | null;
  interactionBlocked?: boolean;
  onChange?: (date: Date | null) => void;
  value?: Date | null;
}

/** Effective date selection, normalized constraints, and a commit operation that applies them. */
export interface UseDatePickerStateReturn {
  commitValue: (date: Date | null) => void;
  defaultValue: Date | null;
  hasUnavailableSelection: boolean;
  isControlled: boolean;
  maxDate: Date | undefined;
  minDate: Date | undefined;
  reset: () => void;
  value: Date | null;
}
